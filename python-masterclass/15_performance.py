"""
15 — PERFORMANCE
==================
Profiling, timeit, memory, Big-O intuition, common pitfalls.

Run: python3 15_performance.py
"""

import timeit
import cProfile
import pstats
import io
import sys

# ---------------------------------------------------------------------------
# 1. timeit — accurately measure small code snippets
# ---------------------------------------------------------------------------
concat_time = timeit.timeit(
    "s = ''\nfor i in range(1000): s += str(i)",
    number=1000,
)
join_time = timeit.timeit(
    "s = ''.join(str(i) for i in range(1000))",
    number=1000,
)
print(f"string += in a loop:     {concat_time:.4f}s")
print(f"''.join(generator):      {join_time:.4f}s")
print(f"-> join is ~{concat_time / join_time:.1f}x faster (string concat is O(n^2), join is O(n))\n")

# ---------------------------------------------------------------------------
# 2. cProfile — find out WHERE time is actually being spent
# ---------------------------------------------------------------------------
def slow_function():
    total = 0
    for i in range(200_000):
        total += i ** 2
    return total

def fast_function():
    return sum(i ** 2 for i in range(200_000))

def workload():
    slow_function()
    fast_function()

profiler = cProfile.Profile()
profiler.enable()
workload()
profiler.disable()

stream = io.StringIO()
stats = pstats.Stats(profiler, stream=stream).sort_stats("cumulative")
stats.print_stats(5)
print("cProfile output (top functions by cumulative time):")
print(stream.getvalue())

# ---------------------------------------------------------------------------
# 3. MEMORY — sys.getsizeof and common memory-saving patterns
# ---------------------------------------------------------------------------
regular_list = list(range(10_000))
gen = (x for x in range(10_000))
print(f"list(range(10000)) size:  {sys.getsizeof(regular_list):,} bytes")
print(f"generator expr size:      {sys.getsizeof(gen):,} bytes  (constant, regardless of length!)")

# __slots__ (see 14_decorators_metaprogramming.py) also reduces per-instance memory.

# ---------------------------------------------------------------------------
# 4. BIG-O INTUITION FOR COMMON OPERATIONS
# ---------------------------------------------------------------------------
print("""
COMMON COMPLEXITY GOTCHAS:
  list.append(x)              O(1) amortized  — fast
  list.insert(0, x)            O(n)            — shifts every element, avoid in loops
  x in list                    O(n)            — linear scan
  x in set / x in dict         O(1) average    — hash lookup, use these for membership tests
  dict[key]                    O(1) average
  sorted(list)                 O(n log n)
  string concatenation in loop O(n^2) total    — use ''.join() instead
  list slicing list[a:b]       O(k) where k = slice length — copies data
""")

# ---------------------------------------------------------------------------
# 5. QUICK WINS CHECKLIST
# ---------------------------------------------------------------------------
print("""
QUICK PERFORMANCE WINS:
  1. Use sets/dicts for membership tests, not lists.
  2. Use ''.join() to build strings, never += in a loop.
  3. Use list/dict/set comprehensions over manual append loops (faster + clearer).
  4. Cache expensive pure-function results with functools.lru_cache.
  5. Use generators for large/streaming data instead of building full lists.
  6. Move hot loops to numpy/vectorized operations when doing numeric work.
  7. Profile before optimizing — intuition about "the slow part" is often wrong.
""")

if __name__ == "__main__":
    print("[15_performance.py] Done. Next: 16_design_patterns.py")
