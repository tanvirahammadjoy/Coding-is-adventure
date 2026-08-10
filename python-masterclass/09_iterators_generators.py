"""
09 — ITERATORS & GENERATORS
==============================
Iterators, yield, generator expressions, itertools.

Run: python3 09_iterators_generators.py
"""

# ---------------------------------------------------------------------------
# 1. THE ITERATOR PROTOCOL — how `for` loops actually work under the hood
# ---------------------------------------------------------------------------
nums = [1, 2, 3]
it = iter(nums)                 # __iter__() gives you an iterator
print(next(it), next(it), next(it))    # __next__() advances it
try:
    next(it)
except StopIteration:
    print("StopIteration: iterator exhausted")

# A `for x in nums:` loop is roughly equivalent to:
it2 = iter(nums)
while True:
    try:
        x = next(it2)
    except StopIteration:
        break
    print(f"  manual loop: {x}")

# ---------------------------------------------------------------------------
# 2. BUILDING A CUSTOM ITERATOR CLASS
# ---------------------------------------------------------------------------
class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):             # returns the iterator (itself, here)
        return self

    def __next__(self):             # returns the next value or raises StopIteration
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

print(f"\nCountdown(5): {list(Countdown(5))}")

# ---------------------------------------------------------------------------
# 3. GENERATORS — functions with `yield` that build iterators automatically
# ---------------------------------------------------------------------------
def countdown_gen(start):
    while start > 0:
        yield start              # pauses here, resumes on next call to next()
        start -= 1

print(f"countdown_gen(5): {list(countdown_gen(5))}")

def infinite_counter(start=0):
    n = start
    while True:                  # generators can be infinite — values are lazy
        yield n
        n += 1

counter = infinite_counter()
first_five = [next(counter) for _ in range(5)]
print(f"first 5 from infinite generator: {first_five}")

# yield from delegates to a sub-generator
def flatten(nested):
    for item in nested:
        if isinstance(item, list):
            yield from flatten(item)      # recursively yields all inner items
        else:
            yield item

print(f"flatten: {list(flatten([1, [2, 3, [4, 5]], 6]))}")

# ---------------------------------------------------------------------------
# 4. GENERATOR EXPRESSIONS — like list comprehensions, but lazy
# ---------------------------------------------------------------------------
squares_list = [n ** 2 for n in range(5)]        # built entirely in memory, right away
squares_gen = (n ** 2 for n in range(5))         # values produced one at a time, on demand
print(f"\nlist: {squares_list}")
print(f"generator (must iterate to see values): {list(squares_gen)}")

# Why it matters: memory efficiency for large/streaming data.
huge_sum = sum(n for n in range(10_000_000))     # never builds a 10M-element list
print(f"sum of 10M range via generator (constant memory): {huge_sum}")

# ---------------------------------------------------------------------------
# 5. ITERTOOLS — the standard library's toolbox for iterator composition
# ---------------------------------------------------------------------------
import itertools

print(f"\nchain: {list(itertools.chain([1, 2], [3, 4]))}")
print(f"cycle (first 6): {list(itertools.islice(itertools.cycle([1, 2, 3]), 6))}")
print(f"combinations: {list(itertools.combinations('ABC', 2))}")
print(f"permutations: {list(itertools.permutations('AB'))}")
print(f"product: {list(itertools.product([0, 1], repeat=2))}")
print(f"groupby: {[(k, list(g)) for k, g in itertools.groupby('aaabbbcca')]}")
print(f"accumulate: {list(itertools.accumulate([1, 2, 3, 4]))}")     # running totals
print(f"islice (like slicing a generator): {list(itertools.islice(itertools.count(10), 5))}")

if __name__ == "__main__":
    print("\n[09_iterators_generators.py] Done. Next: 10_standard_library.py")
