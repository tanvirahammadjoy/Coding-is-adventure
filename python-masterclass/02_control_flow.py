"""
02 — CONTROL FLOW
==================
if/elif/else, loops, break/continue/else, match statements.

Run: python3 02_control_flow.py
"""

# ---------------------------------------------------------------------------
# 1. CONDITIONALS
# ---------------------------------------------------------------------------
score = 82
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
print(f"score={score} -> grade={grade}")

# Ternary (conditional expression) — use for short, simple choices only.
status = "pass" if score >= 60 else "fail"
print(f"status={status}")

# Chained comparisons are valid Python (not "a < b and b < c"):
print(f"{0 < score < 100=}")

# ---------------------------------------------------------------------------
# 2. FOR LOOPS — iterate over any iterable (list, str, range, dict, file...)
# ---------------------------------------------------------------------------
for i in range(5):              # 0,1,2,3,4
    print(i, end=" ")
print()

for ch in "abc":
    print(ch, end=" ")
print()

fruits = ["apple", "banana", "cherry"]
for idx, fruit in enumerate(fruits):        # index + value
    print(f"{idx}: {fruit}")

prices = {"apple": 1.5, "banana": 0.5}
for name, price in prices.items():          # key + value
    print(f"{name} costs ${price}")

# zip() walks multiple iterables in parallel.
names = ["Alice", "Bob"]
ages = [30, 25]
for n, a in zip(names, ages):
    print(f"{n} is {a}")

# ---------------------------------------------------------------------------
# 3. WHILE LOOPS
# ---------------------------------------------------------------------------
count = 3
while count > 0:
    print(f"countdown: {count}")
    count -= 1

# ---------------------------------------------------------------------------
# 4. BREAK / CONTINUE / LOOP-ELSE
# ---------------------------------------------------------------------------
for n in range(10):
    if n == 3:
        continue     # skip this iteration
    if n == 6:
        break        # exit the loop entirely
    print(f"n={n}", end=" ")
print()

# The `else` on a loop runs only if the loop finished WITHOUT hitting `break`.
# Common use: "search and if not found, do X".
for n in range(5):
    if n == 99:
        break
else:
    print("loop completed without break -> value not found")

# ---------------------------------------------------------------------------
# 5. MATCH STATEMENTS (Python 3.10+) — structural pattern matching
# ---------------------------------------------------------------------------
def describe(command):
    match command.split():
        case ["go", direction] if direction in ("north", "south", "east", "west"):
            return f"Moving {direction}"
        case ["look"]:
            return "Looking around"
        case ["take", *items]:
            return f"Taking: {', '.join(items)}"
        case _:
            return "Unknown command"

for cmd in ["go north", "look", "take sword shield", "fly"]:
    print(f"{cmd!r:25} -> {describe(cmd)}")

# match also works on literals, types, and object attributes:
def category(value):
    match value:
        case int() | float() if value < 0:
            return "negative number"
        case 0:
            return "zero"
        case int() | float():
            return "positive number"
        case str():
            return "string"
        case [x, y]:
            return f"pair: {x}, {y}"
        case _:
            return "something else"

for v in [-5, 0, 3.14, "hi", [1, 2], {1: 2}]:
    print(f"{v!r:10} -> {category(v)}")

if __name__ == "__main__":
    print("\n[02_control_flow.py] Done. Next: 03_data_structures.py")
