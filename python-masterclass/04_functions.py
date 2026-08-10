"""
04 — FUNCTIONS
================
Args/kwargs, defaults, closures, lambdas, *args/**kwargs, recursion, decorators intro.

Run: python3 04_functions.py
"""

# ---------------------------------------------------------------------------
# 1. BASIC FUNCTIONS
# ---------------------------------------------------------------------------
def greet(name, greeting="Hello"):     # `greeting` has a default value
    """Docstring: returns a greeting string. Use triple quotes for docs."""
    return f"{greeting}, {name}!"

print(greet("Sam"))
print(greet("Sam", greeting="Hi"))
print(greet(name="Sam", greeting="Yo"))   # keyword arguments — any order

# CAUTION: never use a mutable default argument (list/dict). It's created ONCE
# and shared across all calls, causing surprising bugs.
def bad_append(item, bucket=[]):          # BUG
    bucket.append(item)
    return bucket

def good_append(item, bucket=None):       # FIX: use None, create fresh inside
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket

print(f"bad_append twice: {bad_append('a')} then {bad_append('b')}")   # shares state!
print(f"good_append twice: {good_append('a')} then {good_append('b')}")

# ---------------------------------------------------------------------------
# 2. *ARGS AND **KWARGS
# ---------------------------------------------------------------------------
def summarize(*args, **kwargs):
    print(f"positional args={args}")
    print(f"keyword args={kwargs}")

summarize(1, 2, 3, name="Sam", age=30)

def call_with_unpacking(a, b, c):
    return a + b + c

nums = [1, 2, 3]
print(call_with_unpacking(*nums))                       # unpack list as positional args
print(call_with_unpacking(**{"a": 1, "b": 2, "c": 3}))   # unpack dict as kwargs

# ---------------------------------------------------------------------------
# 3. LAMBDAS — small anonymous functions, use sparingly
# ---------------------------------------------------------------------------
square = lambda x: x ** 2
add = lambda x, y: x + y
print(f"square(5)={square(5)} add(2,3)={add(2, 3)}")

people = [{"name": "Ana", "age": 29}, {"name": "Bo", "age": 22}]
people_by_age = sorted(people, key=lambda p: p["age"])
print(f"sorted by age: {people_by_age}")

# ---------------------------------------------------------------------------
# 4. CLOSURES — a function that "remembers" variables from its enclosing scope
# ---------------------------------------------------------------------------
def make_multiplier(factor):
    def multiplier(x):
        return x * factor          # `factor` is captured from the enclosing scope
    return multiplier

double = make_multiplier(2)
triple = make_multiplier(3)
print(f"double(5)={double(5)} triple(5)={triple(5)}")

# ---------------------------------------------------------------------------
# 5. RECURSION
# ---------------------------------------------------------------------------
def factorial(n):
    if n <= 1:                     # base case — always needed to avoid infinite recursion
        return 1
    return n * factorial(n - 1)    # recursive case

print(f"factorial(6)={factorial(6)}")

# Python's default recursion limit is ~1000; deep recursion should usually be
# rewritten as a loop or use memoization (see functools.lru_cache in 10_standard_library.py).

# ---------------------------------------------------------------------------
# 6. FIRST-CLASS FUNCTIONS — functions are objects, can be passed around
# ---------------------------------------------------------------------------
def apply_twice(func, value):
    return func(func(value))

print(f"apply_twice(square, 3)={apply_twice(square, 3)}")

# ---------------------------------------------------------------------------
# 7. A SIMPLE DECORATOR — a function that wraps another function
# (Full deep dive in 14_decorators_metaprogramming.py)
# ---------------------------------------------------------------------------
import functools
import time

def timer(func):
    @functools.wraps(func)          # preserves func's name/docstring
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.6f}s")
        return result
    return wrapper

@timer
def slow_sum(n):
    return sum(range(n))

slow_sum(1_000_000)

# ---------------------------------------------------------------------------
# 8. KEYWORD-ONLY AND POSITIONAL-ONLY ARGUMENTS
# ---------------------------------------------------------------------------
def configure(host, port, *, timeout=30, retries=3):
    # everything after `*` must be passed by keyword
    return f"{host}:{port} timeout={timeout} retries={retries}"

def divide(a, b, /):
    # everything before `/` must be passed positionally
    return a / b

print(configure("localhost", 8080, timeout=5))
print(divide(10, 2))

if __name__ == "__main__":
    print("\n[04_functions.py] Done. Next: 05_oop.py")
