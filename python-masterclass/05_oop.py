"""
05 — OBJECT-ORIENTED PROGRAMMING
===================================
Classes, inheritance, dunder methods, properties, dataclasses, ABCs.

Run: python3 05_oop.py
"""

# ---------------------------------------------------------------------------
# 1. BASIC CLASS
# ---------------------------------------------------------------------------
class Dog:
    species = "Canis familiaris"          # class attribute — shared by all instances

    def __init__(self, name, age):        # constructor
        self.name = name                  # instance attribute
        self.age = age

    def bark(self):                       # instance method — `self` is required
        return f"{self.name} says woof!"

    def __str__(self):                    # controls str(obj) / print(obj)
        return f"Dog({self.name}, {self.age})"

    def __repr__(self):                   # controls repr(obj) — should be unambiguous
        return f"Dog(name={self.name!r}, age={self.age!r})"

rex = Dog("Rex", 3)
print(rex.bark())
print(rex)                 # uses __str__
print(repr(rex))           # uses __repr__
print(f"species is shared: {rex.species == Dog.species}")

# ---------------------------------------------------------------------------
# 2. INHERITANCE
# ---------------------------------------------------------------------------
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclasses must implement speak()")

class Cat(Animal):
    def speak(self):
        return f"{self.name} says meow!"

class Parrot(Animal):
    def __init__(self, name, vocabulary):
        super().__init__(name)             # call parent constructor
        self.vocabulary = vocabulary

    def speak(self):
        return f"{self.name} says: {', '.join(self.vocabulary)}"

for animal in [Cat("Whiskers"), Parrot("Polly", ["hello", "pieces of eight"])]:
    print(animal.speak())

print(f"isinstance check: {isinstance(Cat('x'), Animal)}")

# ---------------------------------------------------------------------------
# 3. DUNDER (MAGIC) METHODS — customize how objects behave with built-in ops
# ---------------------------------------------------------------------------
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):              # enables v1 + v2
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other):               # enables v1 == v2
        return (self.x, self.y) == (other.x, other.y)

    def __len__(self):                     # enables len(v)
        return int((self.x ** 2 + self.y ** 2) ** 0.5)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1, v2 = Vector(1, 2), Vector(3, 4)
print(f"{v1 + v2=} {v1 == Vector(1, 2)=} {len(v2)=}")

# ---------------------------------------------------------------------------
# 4. PROPERTIES — computed attributes with getter/setter validation
# ---------------------------------------------------------------------------
class Circle:
    def __init__(self, radius):
        self._radius = radius              # convention: leading underscore = "internal"

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value <= 0:
            raise ValueError("radius must be positive")
        self._radius = value

    @property
    def area(self):                        # read-only computed property
        return 3.14159 * self._radius ** 2

c = Circle(5)
print(f"area={c.area:.2f}")
c.radius = 10                              # goes through the setter/validation
print(f"new area={c.area:.2f}")
try:
    c.radius = -1
except ValueError as e:
    print(f"caught: {e}")

# ---------------------------------------------------------------------------
# 5. DATACLASSES — auto-generates __init__, __repr__, __eq__ for data-holding classes
# ---------------------------------------------------------------------------
from dataclasses import dataclass, field

@dataclass
class Point:
    x: float
    y: float
    tags: list = field(default_factory=list)   # safe way to default to a mutable type

p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
print(f"{p1=} {p1 == p2=}")                    # auto __repr__ and __eq__

@dataclass(frozen=True)                        # immutable dataclass
class ImmutablePoint:
    x: float
    y: float

ip = ImmutablePoint(1, 2)
try:
    ip.x = 5
except Exception as e:
    print(f"frozen dataclass blocks mutation: {type(e).__name__}: {e}")

# ---------------------------------------------------------------------------
# 6. ABSTRACT BASE CLASSES — enforce a subclass "contract"
# ---------------------------------------------------------------------------
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        ...

class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2

try:
    Shape()                                # TypeError: can't instantiate abstract class
except TypeError as e:
    print(f"can't instantiate ABC: {e}")

print(f"Square(4).area()={Square(4).area()}")

# ---------------------------------------------------------------------------
# 7. CLASS METHODS AND STATIC METHODS
# ---------------------------------------------------------------------------
class Pizza:
    def __init__(self, toppings):
        self.toppings = toppings

    @classmethod
    def margherita(cls):                   # alternate constructor
        return cls(["tomato", "mozzarella"])

    @staticmethod
    def is_valid_topping(topping):         # doesn't need self or cls
        return topping in {"tomato", "mozzarella", "basil", "pepperoni"}

print(Pizza.margherita().toppings)
print(Pizza.is_valid_topping("pepperoni"))

if __name__ == "__main__":
    print("\n[05_oop.py] Done. Next: 06_modules_packages.py")
