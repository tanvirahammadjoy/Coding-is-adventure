"""
10 — STANDARD LIBRARY TOUR
=============================
collections, functools, datetime, os, re, random, and more "batteries included" modules.

Run: python3 10_standard_library.py
"""

# ---------------------------------------------------------------------------
# 1. collections — specialized container datatypes
# ---------------------------------------------------------------------------
from collections import Counter, defaultdict, deque, namedtuple, OrderedDict

words = "the quick brown fox jumps over the lazy dog the fox runs".split()
print(f"Counter: {Counter(words)}")
print(f"most_common(2): {Counter(words).most_common(2)}")

dd = defaultdict(list)                   # missing keys get a default value automatically
dd["fruits"].append("apple")
dd["fruits"].append("banana")
print(f"defaultdict: {dict(dd)}")

dq = deque([1, 2, 3], maxlen=3)          # fast appends/pops from both ends; auto-drops old items
dq.append(4)                              # 1 gets dropped since maxlen=3
dq.appendleft(0)
print(f"deque: {dq}")

# ---------------------------------------------------------------------------
# 2. functools — higher-order function tools
# ---------------------------------------------------------------------------
from functools import lru_cache, reduce, partial, cached_property

@lru_cache(maxsize=None)                  # memoizes results — huge speedup for recursion
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(f"\nfib(30) with memoization: {fib(30)}")

product = reduce(lambda acc, x: acc * x, [1, 2, 3, 4, 5])   # fold a list into one value
print(f"reduce (product of 1..5): {product}")

double = partial(lambda a, b: a * b, 2)   # pre-fills the first argument
print(f"partial: double(5)={double(5)}")

class Config:
    @cached_property                       # computed once, then cached on the instance
    def expensive_value(self):
        print("  (computing expensive_value...)")
        return sum(range(1_000_000))

cfg = Config()
cfg.expensive_value   # computes
cfg.expensive_value   # cached, no recompute

# ---------------------------------------------------------------------------
# 3. datetime — dates, times, deltas
# ---------------------------------------------------------------------------
from datetime import datetime, date, timedelta

now = datetime.now()
today = date.today()
print(f"\nnow={now.isoformat(timespec='seconds')} today={today}")

next_week = today + timedelta(days=7)
print(f"next_week={next_week}")

formatted = now.strftime("%Y-%m-%d %H:%M")     # datetime -> string
parsed = datetime.strptime("2026-01-15", "%Y-%m-%d")   # string -> datetime
print(f"formatted={formatted} parsed={parsed}")

# ---------------------------------------------------------------------------
# 4. os / os.environ — interacting with the operating system
# ---------------------------------------------------------------------------
import os
print(f"\ncwd={os.getcwd()}")
print(f"PATH env var present: {'PATH' in os.environ}")

# ---------------------------------------------------------------------------
# 5. re — regular expressions
# ---------------------------------------------------------------------------
import re

text = "Contact us at hello@example.com or sales@example.org"
emails = re.findall(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
print(f"\nemails found: {emails}")

match = re.search(r"(\w+)@(\w+)\.(\w+)", "hello@example.com")
if match:
    print(f"groups: {match.groups()}")

cleaned = re.sub(r"\s+", " ", "too    many     spaces")
print(f"cleaned: {cleaned!r}")

# ---------------------------------------------------------------------------
# 6. random — pseudo-random generation
# ---------------------------------------------------------------------------
import random
random.seed(42)                          # reproducible output for this demo
print(f"\nrandom.random()={random.random():.4f}")
print(f"randint(1,10)={random.randint(1, 10)}")
print(f"choice={random.choice(['a', 'b', 'c'])}")
sample = [1, 2, 3, 4, 5]
random.shuffle(sample)
print(f"shuffled: {sample}")

# ---------------------------------------------------------------------------
# 7. json / string / operator / itertools — already covered / worth knowing exist
# ---------------------------------------------------------------------------
import string
print(f"\nstring.ascii_lowercase={string.ascii_lowercase}")
print(f"string.punctuation={string.punctuation}")

from operator import itemgetter, attrgetter
people = [{"name": "Bo", "age": 22}, {"name": "Ana", "age": 29}]
print(f"sorted by itemgetter: {sorted(people, key=itemgetter('age'))}")

if __name__ == "__main__":
    print("\n[10_standard_library.py] Done. Next: 11_typing_hints.py")
