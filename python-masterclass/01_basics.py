"""
01 — PYTHON BASICS
===================
Variables, types, numbers, strings, operators, input/output.

Run: python3 01_basics.py
"""

# ---------------------------------------------------------------------------
# 1. VARIABLES — Python is dynamically typed. No declaration keyword needed.
# ---------------------------------------------------------------------------
name = "Tanbir"           # str
age = 28                  # int
height_m = 1.78           # float
is_learning = True        # bool
nothing = None            # NoneType — Python's "no value"

print(f"{name=} {age=} {height_m=} {is_learning=} {nothing=}")

# `type()` tells you the runtime type. Types are objects too.
for value in (name, age, height_m, is_learning, nothing):
    print(f"  {value!r:>15} -> {type(value).__name__}")

# ---------------------------------------------------------------------------
# 2. NUMBERS — int, float, complex. Ints have unlimited precision.
# ---------------------------------------------------------------------------
big_number = 2 ** 200          # no overflow — Python ints grow as needed
division = 7 / 2               # true division -> float: 3.5
floor_division = 7 // 2        # floor division -> int-like: 3
modulo = 7 % 2                 # remainder: 1
power = 2 ** 10                # exponent: 1024
print(f"\n{division=} {floor_division=} {modulo=} {power=}")
print(f"2**200 has {len(str(big_number))} digits")

# Underscores improve readability of large literals.
population = 1_400_000_000
print(f"{population:,}")

# ---------------------------------------------------------------------------
# 3. STRINGS — immutable sequences of characters.
# ---------------------------------------------------------------------------
greeting = "Hello"
subject = 'World'
combined = f"{greeting}, {subject}!"          # f-strings: preferred formatting
multiline = """This spans
multiple lines."""

print(f"\n{combined}")
print(combined.upper(), combined.lower(), combined.replace("Hello", "Hi"))
print(combined.split(","))                    # -> ['Hello', ' World!']
print(" padded ".strip())                     # remove leading/trailing whitespace
print(f"{3.14159:.2f}")                        # format spec: 2 decimal places
print(f"{42:05d}")                             # zero-padded to width 5: 00042
print(f"{'right':>10}|{'left':<10}|{'mid':^10}|")  # alignment

# Strings are indexable and sliceable (see 03_data_structures.py for details).
s = "Python"
print(s[0], s[-1], s[1:4], s[::-1])            # 'P' 'n' 'yth' 'nohtyP'

# ---------------------------------------------------------------------------
# 4. OPERATORS
# ---------------------------------------------------------------------------
a, b = 10, 3
print(f"\n{a + b=} {a - b=} {a * b=} {a / b=} {a // b=} {a % b=} {a ** b=}")
print(f"{a > b=} {a == b=} {a != b=}")
print(f"{True and False=} {True or False=} {not True=}")
# `is` checks identity (same object), `==` checks equality (same value).
x = [1, 2]
y = [1, 2]
print(f"{x == y=} {x is y=}")   # True, False — different list objects

# ---------------------------------------------------------------------------
# 5. TYPE CONVERSION
# ---------------------------------------------------------------------------
print(f"\n{int('42')=} {float('3.14')=} {str(99)=} {bool(0)=} {bool('')=} {bool('x')=}")
# Falsy values: 0, 0.0, "", [], {}, (), set(), None, False
# Everything else is truthy.

# ---------------------------------------------------------------------------
# 6. INPUT / OUTPUT (skipped interactively in this demo file)
# ---------------------------------------------------------------------------
# user_input = input("Your name: ")   # always returns a str
print("\ninput() reads a line as a string; cast it (int(), float()) as needed.")
print("print() accepts sep= and end= kwargs:", end=" ")
print("a", "b", "c", sep="-", end="\n")

if __name__ == "__main__":
    print("\n[01_basics.py] Done. Next: 02_control_flow.py")
