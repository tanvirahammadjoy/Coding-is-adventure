"""
13 — CONCURRENCY & ASYNC
===========================
threading, multiprocessing, asyncio, and the GIL explained.

Run: python3 13_concurrency_async.py
"""

import time
import threading
import multiprocessing
import asyncio

# ---------------------------------------------------------------------------
# 1. THE GIL (Global Interpreter Lock) — the concept that shapes everything below
# ---------------------------------------------------------------------------
print("""
THE GIL, IN ONE PARAGRAPH:
CPython (the standard Python implementation) has a Global Interpreter Lock
that allows only ONE thread to execute Python bytecode at a time, even on a
multi-core machine. This means `threading` does NOT give you true parallelism
for CPU-bound work. It DOES help for I/O-bound work (network calls, file
reads, sleeping) because threads release the GIL while waiting on I/O.
For true CPU parallelism, use `multiprocessing` (separate processes, each
with its own GIL) or a library that releases the GIL in C extensions
(e.g. numpy). Python 3.13 introduced an experimental no-GIL build, but the
GIL is still the default as of this writing.
""")

# ---------------------------------------------------------------------------
# 2. THREADING — best for I/O-bound tasks (network requests, file I/O, sleep)
# ---------------------------------------------------------------------------
def io_bound_task(name, duration):
    time.sleep(duration)         # simulates waiting on a network call
    print(f"  thread {name} finished after {duration}s")

start = time.perf_counter()
threads = [threading.Thread(target=io_bound_task, args=(i, 0.3)) for i in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()                      # wait for all threads to finish
print(f"4 threads x 0.3s sleep, ran concurrently in {time.perf_counter() - start:.2f}s (not 1.2s!)\n")

# A thread-safe counter needs a Lock — without it, race conditions corrupt data.
counter = 0
lock = threading.Lock()

def increment(n):
    global counter
    for _ in range(n):
        with lock:                # only one thread can hold the lock at a time
            counter += 1

threads = [threading.Thread(target=increment, args=(10_000,)) for _ in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()
print(f"counter after 4 threads x 10,000 increments (with lock): {counter} (expected 40000)\n")

# ---------------------------------------------------------------------------
# 3. MULTIPROCESSING — best for CPU-bound tasks (true parallelism, separate processes)
# ---------------------------------------------------------------------------
def cpu_bound_task(n):
    return sum(i * i for i in range(n))

if __name__ == "__main__":
    # multiprocessing.Pool spreads work across real OS processes / CPU cores.
    with multiprocessing.Pool(processes=2) as pool:
        results = pool.map(cpu_bound_task, [2_000_000, 2_000_000])
    print(f"multiprocessing results: {results}\n")

# ---------------------------------------------------------------------------
# 4. ASYNCIO — cooperative concurrency for I/O-bound work, single thread
# ---------------------------------------------------------------------------
async def fetch_data(name, delay):
    print(f"  [{name}] starting fetch...")
    await asyncio.sleep(delay)     # yields control back to the event loop while "waiting"
    print(f"  [{name}] done!")
    return f"{name}-result"

async def main_async():
    start = time.perf_counter()
    # asyncio.gather runs coroutines concurrently on a SINGLE thread
    results = await asyncio.gather(
        fetch_data("A", 0.3),
        fetch_data("B", 0.3),
        fetch_data("C", 0.3),
    )
    print(f"asyncio.gather results: {results}")
    print(f"3 async tasks x 0.3s each, ran concurrently in {time.perf_counter() - start:.2f}s\n")

if __name__ == "__main__":
    asyncio.run(main_async())

# ---------------------------------------------------------------------------
# 5. WHEN TO USE WHAT — quick decision guide
# ---------------------------------------------------------------------------
print("""
DECISION GUIDE:
  I/O-bound, want simplicity           -> threading
  I/O-bound, high concurrency (1000s)  -> asyncio
  CPU-bound (crunching numbers)        -> multiprocessing (or numpy/C extensions)
  Mixed workload                       -> asyncio + run_in_executor for CPU parts
""")

if __name__ == "__main__":
    print("[13_concurrency_async.py] Done. Next: 14_decorators_metaprogramming.py")
