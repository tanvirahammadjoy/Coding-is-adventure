# Python Masterclass: Concurrency vs Parallelism

## 1. The Core Distinction

**Concurrency** is about _structure_: dealing with many things at once by interleaving their progress. One worker, many tasks, constantly switching attention between them.

**Parallelism** is about _execution_: doing many things at the exact same instant. Multiple workers, each making progress simultaneously.

The classic mental model:

- **Concurrency** = one cashier serving multiple customers by working on each order a little bit at a time (take order 1, start order 2 while order 1's coffee brews, ring up order 3...).
- **Parallelism** = multiple cashiers, each serving one customer, all working literally at the same moment.

A program can be:

- Concurrent but not parallel (single core, switching between tasks)
- Parallel but not concurrent (rare — e.g., SIMD operations on one task)
- Both (multi-core machine running many independent workers)
- Neither (plain sequential code)

The key insight: **concurrency is a way of structuring a program; parallelism is a way of executing it.** You can write concurrent code that never runs in parallel (single-core asyncio), and you can have parallel execution without a "concurrent" design (just running the same script twice).

## 2. Why These Exist At All

### The I/O problem (→ concurrency)

Most real programs spend the majority of their time _waiting_: waiting for a network response, a disk read, a database query, a user click. During that wait, the CPU is idle. Concurrency exists to exploit that idle time — while task A waits on the network, the program can make progress on task B.

This has nothing to do with having multiple CPU cores. Even on a single core, concurrency turns wasted waiting time into useful work.

### The compute problem (→ parallelism)

Some workloads are CPU-bound: image processing, numerical simulation, compression. There's no "waiting" to exploit — the CPU is the bottleneck. The only way to go faster is to throw more CPUs at the problem simultaneously. That's parallelism's job, and it requires actual multiple cores (or machines).

Confusing these two problems is the single most common mistake people make with Python concurrency. Using threads for CPU-bound work, or multiprocessing for a simple web scraper, both miss the point.

## 3. Python's Three Concurrency Tools

Python gives you three distinct mechanisms, and each solves a different problem:

| Tool              | Unit of work              | Best for                    | Real parallelism? |
| ----------------- | ------------------------- | --------------------------- | ----------------- |
| `threading`       | OS thread                 | I/O-bound tasks             | No (GIL-limited)  |
| `multiprocessing` | OS process                | CPU-bound tasks             | Yes               |
| `asyncio`         | Coroutine (single thread) | High-volume I/O-bound tasks | No                |

## 4. The GIL: Why Python Threads Don't Parallelize CPU Work

CPython has a **Global Interpreter Lock (GIL)** — a single mutex that ensures only one thread executes Python bytecode at a time, even on a multi-core machine. This exists because CPython's memory management (reference counting) isn't thread-safe by default; the GIL sidesteps that by only letting one thread touch Python objects at a time.

Practical consequence: spinning up 8 threads to do pure CPU-bound Python computation on an 8-core machine will **not** run 8x faster. The threads take turns holding the GIL, so you get roughly the performance of one core, with added overhead from context switching.

The GIL is released, however, during I/O operations (file reads, network calls) and during certain C-extension calls (NumPy, for instance, releases it for heavy array operations). This is why threading _does_ help I/O-bound work: while one thread is blocked waiting on a socket, it releases the GIL and another thread runs.

> Note: as of Python 3.13, an experimental **free-threaded build** (PEP 703) removes the GIL entirely. It's not yet the default build and has real trade-offs (single-threaded code runs somewhat slower), but it's the direction CPython is heading. For now, assume the GIL is present unless you've deliberately opted into the free-threaded build.

## 5. `threading` — Concurrency for I/O-Bound Work

Use when: you're waiting on many slow I/O operations (network requests, file I/O, database calls) and want to overlap the waiting.

```python
import threading
import time
import requests

urls = [
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/1",
]

def fetch(url, results, index):
    response = requests.get(url)
    results[index] = response.status_code

def run_threaded():
    results = [None] * len(urls)
    threads = []
    start = time.perf_counter()

    for i, url in enumerate(urls):
        t = threading.Thread(target=fetch, args=(url, results, i))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    print(f"Threaded: {time.perf_counter() - start:.2f}s -> {results}")

run_threaded()
```

Three roughly-1-second requests finish in ~1 second total, not ~3, because the threads overlap their waiting.

**Higher-level API — `ThreadPoolExecutor`** (preferred in modern code over raw `Thread` objects):

```python
from concurrent.futures import ThreadPoolExecutor
import requests

def fetch(url):
    return requests.get(url).status_code

with ThreadPoolExecutor(max_workers=5) as pool:
    results = list(pool.map(fetch, urls))
print(results)
```

### Threading pitfalls

- **Race conditions**: two threads mutating shared state without synchronization corrupts it. Use `threading.Lock` around critical sections.
- **Overhead**: too many threads (hundreds+) waste memory and context-switch time.
- **Not for CPU-bound work** — see the GIL section above.

```python
counter = 0
lock = threading.Lock()

def increment():
    global counter
    for _ in range(100_000):
        with lock:
            counter += 1
```

## 6. `multiprocessing` — True Parallelism for CPU-Bound Work

Each process gets its own Python interpreter and its own GIL, so processes genuinely run in parallel across cores. The cost: no shared memory by default — data must be serialized (pickled) between processes, which adds overhead.

```python
from concurrent.futures import ProcessPoolExecutor
import time

def cpu_heavy(n):
    total = 0
    for i in range(n):
        total += i * i
    return total

def run_parallel():
    numbers = [10_000_000] * 4
    start = time.perf_counter()

    with ProcessPoolExecutor() as pool:
        results = list(pool.map(cpu_heavy, numbers))

    print(f"Parallel: {time.perf_counter() - start:.2f}s -> {results}")

if __name__ == "__main__":
    run_parallel()
```

On a 4+ core machine, this finishes in roughly the time of _one_ `cpu_heavy` call, not four — genuine parallelism, unlike the threaded equivalent.

### Multiprocessing pitfalls

- **Serialization cost**: arguments and return values are pickled across process boundaries. Passing huge objects repeatedly can erase your speedup.
- **Startup overhead**: spawning a process is much heavier than spawning a thread. Don't use it for tiny, frequent tasks.
- **`if __name__ == "__main__":` guard is required** on Windows/macOS (spawn start method) to avoid infinite recursive process creation.
- **Shared state needs explicit tools**: `multiprocessing.Value`, `Array`, `Manager`, or a `Queue` — plain global variables are _not_ shared across processes.

```python
from multiprocessing import Process, Queue

def worker(q):
    q.put("result from child process")

if __name__ == "__main__":
    q = Queue()
    p = Process(target=worker, args=(q,))
    p.start()
    p.join()
    print(q.get())
```

## 7. `asyncio` — Single-Threaded Concurrency at Scale

`asyncio` runs many coroutines on a **single thread**, using an event loop that switches between tasks at `await` points. There's no GIL contention, no thread overhead, no race conditions on Python objects — because only one thing ever runs at a time, by design. It's concurrency without parallelism, optimized for handling thousands of simultaneous I/O-bound operations cheaply.

```python
import asyncio
import aiohttp
import time

async def fetch(session, url):
    async with session.get(url) as response:
        return response.status

async def run_async():
    urls = ["https://httpbin.org/delay/1"] * 3
    start = time.perf_counter()

    async with aiohttp.ClientSession() as session:
        results = await asyncio.gather(*(fetch(session, u) for u in urls))

    print(f"Async: {time.perf_counter() - start:.2f}s -> {results}")

asyncio.run(run_async())
```

Same ~1 second result as the threaded version — but asyncio can comfortably scale to thousands of concurrent connections where thousands of OS threads would exhaust memory.

### Why asyncio needs its own ecosystem

Regular blocking libraries (`requests`, `time.sleep`, standard file I/O) block the _entire_ event loop, freezing every other coroutine. You need async-native libraries (`aiohttp`, `asyncpg`, `aiofiles`) or you defeat the purpose entirely.

```python
# WRONG — blocks the whole event loop, no concurrency happens
async def bad():
    import time
    time.sleep(1)   # freezes everything

# RIGHT
async def good():
    await asyncio.sleep(1)   # yields control back to the event loop
```

### Core asyncio pitfalls

- **Blocking calls inside coroutines** stall the entire program, not just that task.
- **Forgetting `await`** — calling a coroutine function without awaiting it just creates a coroutine object and does nothing.
- **CPU-bound work inside a coroutine** starves every other task, since nothing yields control. Offload it: `await loop.run_in_executor(None, cpu_heavy_fn, arg)`.

## 8. Combining Them: The Real-World Pattern

Production systems often mix approaches. A common one: an asyncio event loop handling thousands of I/O-bound requests, which occasionally needs to run CPU-heavy work — so it hands that off to a process pool without blocking the loop.

```python
import asyncio
from concurrent.futures import ProcessPoolExecutor

def cpu_heavy(n):
    return sum(i * i for i in range(n))

async def handle_request(loop, pool, n):
    # Runs in a separate process, doesn't block the event loop
    result = await loop.run_in_executor(pool, cpu_heavy, n)
    return result

async def main():
    loop = asyncio.get_running_loop()
    with ProcessPoolExecutor() as pool:
        results = await asyncio.gather(*(handle_request(loop, pool, 5_000_000) for _ in range(4)))
    print(results)

if __name__ == "__main__":
    asyncio.run(main())
```

This is essentially how frameworks like FastAPI handle a mix of fast I/O-bound endpoints and occasional CPU-heavy background tasks.

## 9. Decision Framework

Ask these in order:

1. **Is the task CPU-bound or I/O-bound?**
   - CPU-bound (parsing, math, image processing, compression) → **multiprocessing**
   - I/O-bound (network, disk, DB, external APIs) → continue

2. **How many concurrent operations do you need?**
   - Dozens to low hundreds, and you're integrating with existing sync libraries → **threading**
   - Hundreds to tens of thousands, and async libraries exist for your I/O sources → **asyncio**

3. **Do you need to mix CPU-bound work into an I/O-bound system?**
   - → **asyncio + `run_in_executor` with a `ProcessPoolExecutor`**

4. **Is the task trivially small and infrequent (a handful of quick calls)?**
   - → Don't bother with concurrency at all; the overhead isn't worth it. Just write sequential code.

## 10. Quick Reference Table

| Scenario                                            | Tool                                                             |
| --------------------------------------------------- | ---------------------------------------------------------------- |
| Scraping 20 URLs                                    | `threading` (ThreadPoolExecutor) or `asyncio`                    |
| Scraping 10,000 URLs                                | `asyncio` + `aiohttp`                                            |
| Resizing 500 images                                 | `multiprocessing` (ProcessPoolExecutor)                          |
| Web server handling many simultaneous requests      | `asyncio` (e.g., FastAPI/Starlette)                              |
| Matrix multiplication across 4 cores                | `multiprocessing`, or NumPy (which releases the GIL internally)  |
| Reading a few config files at startup               | Plain sequential code — no concurrency needed                    |
| Real-time chat server with thousands of connections | `asyncio`                                                        |
| Batch video encoding n across 4 cores               | `multiprocessing`, or NumPy (which releases the GIL internally)  |
| Reading a few config files at startup               | Plain sequential code — no concurrency needed                    |
| Real-time chat server with thousands of connections | `asyncio`                                                        |
| Batch video encoding                                | `multiprocessing`, often shelling out to a C library like ffmpeg |

## 11. Key Takeaways

- **Concurrency ≠ parallelism.** Concurrency is about structuring work to overlap waiting; parallelism is about executing work simultaneously on multiple cores.
- **The GIL means Python threads give you concurrency, not parallelism**, for pure Python code.
- **`multiprocessing` sidesteps the GIL** by using separate interpreters — genuine parallelism, at the cost of serialization and startup overhead.
- **`asyncio` is concurrency without threads at all** — cheapest option for massive I/O scale, but requires an async-native ecosystem and careful avoidance of blocking calls.
- **Match the tool to the bottleneck**: waiting → threading/asyncio; computing → multiprocessing.
