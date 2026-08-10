"""
11 — TYPE HINTS & STATIC TYPING
==================================
Type hints, the typing module, generics, Protocol, static checking.

Run: python3 11_typing_hints.py
Note: type hints are NOT enforced at runtime by Python itself — they're for
humans, IDEs, and external tools like mypy/pyright. This file runs fine even
with "wrong" types, which is intentional (demonstrated below).
"""

from typing import Optional, Union, Any, Callable, TypeVar, Generic, Protocol

# ---------------------------------------------------------------------------
# 1. BASIC ANNOTATIONS
# ---------------------------------------------------------------------------
def greet(name: str, times: int = 1) -> str:
    return (f"Hello, {name}! " * times).strip()

age: int = 30
price: float = 9.99
tags: list[str] = ["python", "typing"]            # built-in generics (3.9+)
scores: dict[str, int] = {"alice": 90, "bob": 85}

print(greet("World", 2))
print(f"{age=} {price=} {tags=} {scores=}")

# Hints are advisory only — this "wrong" call still runs (no crash), because
# Python never checks that `name` is actually a str at runtime:
print(greet(name=12345, times=1))   # name is typed `str` but we passed an int — works fine

# ---------------------------------------------------------------------------
# 2. OPTIONAL AND UNION — "this or that, or maybe nothing"
# ---------------------------------------------------------------------------
def find_user(user_id: int) -> Optional[str]:      # same as Union[str, None]
    users = {1: "Ana", 2: "Bo"}
    return users.get(user_id)

def to_number(value: Union[int, str]) -> float:     # accepts int OR str
    return float(value)

# Modern syntax (3.10+) uses `|` instead of Optional/Union:
def find_user_modern(user_id: int) -> str | None:
    users = {1: "Ana", 2: "Bo"}
    return users.get(user_id)

print(f"\nfind_user(1)={find_user(1)} find_user(99)={find_user(99)}")
print(f"to_number('3.14')={to_number('3.14')}")

# ---------------------------------------------------------------------------
# 3. CALLABLE — typing functions passed as arguments
# ---------------------------------------------------------------------------
def apply(func: Callable[[int, int], int], a: int, b: int) -> int:
    return func(a, b)

print(f"\napply(lambda a,b: a+b, 2, 3) -> {apply(lambda a, b: a + b, 2, 3)}")

# ---------------------------------------------------------------------------
# 4. GENERICS — write code that works with any type, but stays type-checked
# ---------------------------------------------------------------------------
T = TypeVar("T")

def first_item(items: list[T]) -> T:
    return items[0]

print(f"\nfirst_item([1,2,3])={first_item([1, 2, 3])} first_item(['a','b'])={first_item(['a', 'b'])}")

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

    def __repr__(self) -> str:
        return f"Stack({self._items})"

int_stack: Stack[int] = Stack()
int_stack.push(1)
int_stack.push(2)
print(f"int_stack={int_stack} pop()={int_stack.pop()}")

# ---------------------------------------------------------------------------
# 5. PROTOCOL — structural typing ("duck typing" made explicit and checkable)
# ---------------------------------------------------------------------------
class SupportsArea(Protocol):
    def area(self) -> float: ...

class Square:
    def __init__(self, side: float):
        self.side = side
    def area(self) -> float:
        return self.side ** 2

class Circle:
    def __init__(self, radius: float):
        self.radius = radius
    def area(self) -> float:
        return 3.14159 * self.radius ** 2

def total_area(shapes: list[SupportsArea]) -> float:
    # Neither Square nor Circle explicitly inherits SupportsArea — they just
    # happen to implement `.area()`. That's enough to satisfy the Protocol.
    return sum(s.area() for s in shapes)

print(f"\ntotal_area: {total_area([Square(2), Circle(1)]):.2f}")

# ---------------------------------------------------------------------------
# 6. TypedDict — dict with a known, checkable shape (great for JSON-like data)
# ---------------------------------------------------------------------------
from typing import TypedDict

class Movie(TypedDict):
    title: str
    year: int

movie: Movie = {"title": "Arrival", "year": 2016}
print(f"\nmovie={movie}")

# ---------------------------------------------------------------------------
# 7. STATIC CHECKING — hints do nothing at runtime; tools like mypy/pyright
# analyze your code WITHOUT running it and flag mismatches. Typical workflow:
#   pip install mypy
#   mypy your_script.py
# In editors (VS Code, PyCharm), hints power autocomplete and inline warnings.
# ---------------------------------------------------------------------------
print("\nRun `pip install mypy && mypy 11_typing_hints.py` to see static analysis in action.")

if __name__ == "__main__":
    print("\n[11_typing_hints.py] Done. Next: 12_testing.py")
