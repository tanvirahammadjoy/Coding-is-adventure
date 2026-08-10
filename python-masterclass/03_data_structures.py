"""
03 — DATA STRUCTURES
======================
list, tuple, dict, set, slicing, comprehensions, unpacking.

Run: python3 03_data_structures.py
"""

# ---------------------------------------------------------------------------
# 1. LISTS — ordered, mutable, allow duplicates
# ---------------------------------------------------------------------------
nums = [3, 1, 4, 1, 5, 9, 2, 6]
nums.append(5)          # add to end
nums.insert(0, 100)     # insert at index
nums.remove(1)          # remove first matching value
popped = nums.pop()     # remove & return last item
print(f"nums={nums} popped={popped}")

sorted_nums = sorted(nums)              # returns new sorted list
nums.sort(reverse=True)                 # sorts in place
print(f"sorted_nums={sorted_nums} nums(desc)={nums}")

# Slicing: list[start:stop:step]
letters = list("abcdefgh")
print(letters[2:5], letters[:3], letters[-3:], letters[::2], letters[::-1])

# ---------------------------------------------------------------------------
# 2. TUPLES — ordered, IMMUTABLE, often used for fixed-size records
# ---------------------------------------------------------------------------
point = (3, 4)
x, y = point                     # unpacking
print(f"point={point} x={x} y={y}")

# Named tuples give fields names while staying lightweight & immutable.
from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(f"p={p} p.x={p.x} p.y={p.y}")

# ---------------------------------------------------------------------------
# 3. DICTIONARIES — key-value pairs, insertion-ordered (3.7+), mutable
# ---------------------------------------------------------------------------
person = {"name": "Ana", "age": 29, "city": "Lisbon"}
person["email"] = "ana@example.com"     # add/update
del person["city"]                       # remove
print(person)
print(person.get("age"), person.get("missing", "default_value"))

for key in person:
    print(f"  {key}: {person[key]}")

# Merging dicts (3.9+):
defaults = {"theme": "dark", "lang": "en"}
overrides = {"lang": "pt"}
merged = defaults | overrides
print(f"merged={merged}")

# ---------------------------------------------------------------------------
# 4. SETS — unordered, unique elements, fast membership tests
# ---------------------------------------------------------------------------
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(f"union={a | b} intersection={a & b} diff={a - b} sym_diff={a ^ b}")
print(f"3 in a -> {3 in a}")

# ---------------------------------------------------------------------------
# 5. COMPREHENSIONS — concise, Pythonic way to build collections
# ---------------------------------------------------------------------------
squares = [n ** 2 for n in range(10)]
evens = [n for n in range(20) if n % 2 == 0]
squares_dict = {n: n ** 2 for n in range(5)}
unique_lengths = {len(w) for w in ["hi", "bye", "ok", "sea"]}
print(f"\nsquares={squares}")
print(f"evens={evens}")
print(f"squares_dict={squares_dict}")
print(f"unique_lengths={unique_lengths}")

# Nested comprehension (flatten a matrix):
matrix = [[1, 2, 3], [4, 5, 6]]
flat = [n for row in matrix for n in row]
print(f"flat={flat}")

# Generator expression — lazy, doesn't build the whole list in memory.
gen = (n ** 2 for n in range(1_000_000))
print(f"first value from generator: {next(gen)}")

# ---------------------------------------------------------------------------
# 6. UNPACKING
# ---------------------------------------------------------------------------
first, *middle, last = [1, 2, 3, 4, 5]
print(f"first={first} middle={middle} last={last}")

a, (b, c) = (1, (2, 3))          # nested unpacking
print(f"a={a} b={b} c={c}")

def stats(*args):                 # collect positional args into a tuple
    return min(args), max(args), sum(args) / len(args)

print(f"stats(1,2,3,4)={stats(1, 2, 3, 4)}")

nums_list = [4, 8, 15]
print(*nums_list)                 # unpack list into separate print args

if __name__ == "__main__":
    print("\n[03_data_structures.py] Done. Next: 04_functions.py")
