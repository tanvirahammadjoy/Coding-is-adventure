"""
14 — DECORATORS & METAPROGRAMMING
====================================
Decorators (with args), descriptors, metaclasses, __slots__.

Run: python3 14_decorators_metaprogramming.py
"""

import functools

# ---------------------------------------------------------------------------
# 1. DECORATORS — a function that takes a function and returns a new function
# ---------------------------------------------------------------------------
def log_calls(func):
    @functools.wraps(func)              # preserves __name__/__doc__ of the original
    def wrapper(*args, **kwargs):
        print(f"  calling {func.__name__}({args}, {kwargs})")
        result = func(*args, **kwargs)
        print(f"  {func.__name__} returned {result!r}")
        return result
    return wrapper

@log_calls
def add(a, b):
    return a + b

add(2, 3)

# ---------------------------------------------------------------------------
# 2. DECORATORS WITH ARGUMENTS — a function that returns a decorator
# ---------------------------------------------------------------------------
def retry(times=3):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_error = None
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_error = e
                    print(f"  attempt {attempt} failed: {e}")
            raise last_error
        return wrapper
    return decorator

attempt_count = 0

@retry(times=3)
def flaky_operation():
    global attempt_count
    attempt_count += 1
    if attempt_count < 3:
        raise ValueError("not yet!")
    return "success"

print(f"\nflaky_operation() -> {flaky_operation()}")

# ---------------------------------------------------------------------------
# 3. CHAINING MULTIPLE DECORATORS — applied bottom-up
# ---------------------------------------------------------------------------
def bold(func):
    @functools.wraps(func)
    def wrapper(*a, **kw):
        return f"<b>{func(*a, **kw)}</b>"
    return wrapper

def italic(func):
    @functools.wraps(func)
    def wrapper(*a, **kw):
        return f"<i>{func(*a, **kw)}</i>"
    return wrapper

@bold
@italic
def message():
    return "hi"

print(f"\nchained decorators: {message()}")   # <b><i>hi</i></b> — italic applied first

# ---------------------------------------------------------------------------
# 4. DESCRIPTORS — objects that customize attribute access via __get__/__set__
# (this is the machinery behind @property, functools.cached_property, etc.)
# ---------------------------------------------------------------------------
class PositiveNumber:
    """A reusable, validated attribute — a descriptor."""
    def __set_name__(self, owner, name):
        self.name = f"_{name}"

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name, 0)

    def __set__(self, instance, value):
        if value <= 0:
            raise ValueError(f"{self.name[1:]} must be positive, got {value}")
        setattr(instance, self.name, value)

class Product:
    price = PositiveNumber()      # reusable across as many attributes/classes as needed
    quantity = PositiveNumber()

    def __init__(self, price, quantity):
        self.price = price
        self.quantity = quantity

product = Product(9.99, 3)
print(f"\nproduct.price={product.price} product.quantity={product.quantity}")
try:
    product.price = -5
except ValueError as e:
    print(f"descriptor validation caught: {e}")

# ---------------------------------------------------------------------------
# 5. __slots__ — restrict instance attributes, save memory, skip __dict__
# ---------------------------------------------------------------------------
class RegularPoint:
    def __init__(self, x, y):
        self.x, self.y = x, y

class SlottedPoint:
    __slots__ = ("x", "y")        # no __dict__ created -> less memory, faster attribute access
    def __init__(self, x, y):
        self.x, self.y = x, y

rp, sp = RegularPoint(1, 2), SlottedPoint(1, 2)
print(f"\nRegularPoint has __dict__: {hasattr(rp, '__dict__')}")
print(f"SlottedPoint has __dict__: {hasattr(sp, '__dict__')}")
try:
    sp.z = 3                       # blocked — not in __slots__
except AttributeError as e:
    print(f"__slots__ blocked new attribute: {e}")

# ---------------------------------------------------------------------------
# 6. METACLASSES — "classes are objects too, and their type is a metaclass"
# A metaclass controls HOW a class itself is created (rare, powerful, use sparingly).
# ---------------------------------------------------------------------------
class UpperAttrMeta(type):
    """Forces all class-level string attributes to uppercase at class creation time."""
    def __new__(mcs, name, bases, namespace):
        upper_namespace = {
            key: (value.upper() if isinstance(value, str) and not key.startswith("__") else value)
            for key, value in namespace.items()
        }
        return super().__new__(mcs, name, bases, upper_namespace)

class Config(metaclass=UpperAttrMeta):
    environment = "production"
    region = "eu-west"

print(f"\nmetaclass effect: {Config.environment=} {Config.region=}")
print(f"type(Config)={type(Config)}  (Config's class is the metaclass)")
print(f"type(type)={type(type)}  (even `type` is its own metaclass, at the very bottom)")

if __name__ == "__main__":
    print("\n[14_decorators_metaprogramming.py] Done. Next: 15_performance.py")
