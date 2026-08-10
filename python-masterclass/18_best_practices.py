"""
18 — BEST PRACTICES & IDIOMATIC PYTHON
==========================================
PEP 8, idiomatic patterns, EAFP vs LBYL, common anti-patterns.
The final stop in this course — read this after you've seen everything else.

Run: python3 18_best_practices.py
"""

# ---------------------------------------------------------------------------
# 1. PEP 8 — THE STYLE GUIDE (highlights, not exhaustive)
# ---------------------------------------------------------------------------
print("""
PEP 8 HIGHLIGHTS:
  - 4 spaces per indent level, never tabs
  - snake_case for functions/variables, PascalCase for classes, UPPER_CASE for constants
  - Max line length: 79-99 chars depending on team convention (Black default: 88)
  - Two blank lines between top-level functions/classes, one between methods
  - Imports at the top: stdlib, then third-party, then local — each group separated
  - Use `is`/`is not` for None checks, not `==`
  - Avoid `from module import *`

Tools that enforce this automatically:
  black .              # auto-formatter, zero config debates
  ruff check .          # fast linter (replaces flake8 + isort + more)
  ruff format .         # fast formatter (alternative to black)
""")

# ---------------------------------------------------------------------------
# 2. IDIOMATIC PYTHON — "Pythonic" ways to do common things
# ---------------------------------------------------------------------------

# BAD: manual index loop
items = ["a", "b", "c"]
for i in range(len(items)):
    pass  # print(i, items[i])
# GOOD: enumerate
for i, item in enumerate(items):
    pass  # print(i, item)

# BAD: building a list with a loop just to sum/filter/transform
squares_bad = []
for n in range(10):
    squares_bad.append(n ** 2)
# GOOD: comprehension
squares_good = [n ** 2 for n in range(10)]

# BAD: checking None with ==
x = None
if x == None:
    pass
# GOOD:
if x is None:
    pass

# BAD: checking truthiness of a container the verbose way
values = []
if len(values) == 0:
    pass
# GOOD: empty containers are falsy
if not values:
    pass

# BAD: string formatting with % or .format() (still valid, just dated)
name = "Sam"
old_style = "Hello, %s" % name
format_style = "Hello, {}".format(name)
# GOOD: f-strings (3.6+) — clearer, faster
f_string_style = f"Hello, {name}"

print(f"\nequivalent outputs: {old_style!r}, {format_style!r}, {f_string_style!r}")

# BAD: catching everything with a bare except
try:
    pass
except Exception:      # OK when you truly need broad handling + re-raise/log
    pass
# WORSE (avoid entirely): except: pass  — swallows even KeyboardInterrupt/SystemExit

# GOOD: swap variables without a temp variable
a, b = 1, 2
a, b = b, a
print(f"swapped: a={a} b={b}")

# GOOD: use `with` for anything that needs cleanup (files, locks, connections)
# (full coverage in 08_file_io.py)

# ---------------------------------------------------------------------------
# 3. EAFP vs LBYL — recap (Python favors EAFP, "Easier to Ask Forgiveness than Permission")
# ---------------------------------------------------------------------------
d = {"a": 1}
# LBYL — extra lookup, and a race condition risk in multithreaded/multiprocess code
if "a" in d:
    val = d["a"]
# EAFP — one lookup, handles the exceptional case directly, the Pythonic default
try:
    val = d["a"]
except KeyError:
    val = None
print(f"\nEAFP result: val={val}")

# ---------------------------------------------------------------------------
# 4. COMMON ANTI-PATTERNS TO AVOID
# ---------------------------------------------------------------------------
print("""
COMMON ANTI-PATTERNS:
  1. Mutable default arguments:  def f(x, items=[]):  -> use items=None, then items = items or []
  2. Using a list where a set/dict would be O(1) instead of O(n) for lookups
  3. Overusing inheritance where composition (has-a) is simpler than (is-a)
  4. Deep nesting instead of early returns / guard clauses
  5. Reinventing itertools/functools/collections instead of using the stdlib
  6. Not using virtual environments -> dependency conflicts across projects
  7. Global mutable state accessed from multiple functions/threads
  8. Overusing classes for things that are really just a function + data
  9. Not writing tests, "I'll add them later" (later rarely comes)
  10. Premature optimization before profiling (see 15_performance.py)
""")

# ---------------------------------------------------------------------------
# 5. THE ZEN OF PYTHON — the philosophy behind all of the above
# ---------------------------------------------------------------------------
import this  # noqa: this actually prints PEP 20, "The Zen of Python"

if __name__ == "__main__":
    print("\n[18_best_practices.py] Done. That's the whole course — nice work.")
