"""
16 — DESIGN PATTERNS IN PYTHON
=================================
Singleton, factory, observer, strategy, context manager pattern —
implemented the Pythonic way (not the Java-translation way).

Run: python3 16_design_patterns.py
"""

# ---------------------------------------------------------------------------
# 1. SINGLETON — only one instance ever exists
# Pythonic note: modules themselves are singletons (imported once, cached in
# sys.modules), so a plain module with functions is often the simplest singleton.
# ---------------------------------------------------------------------------
class Singleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

a, b = Singleton(), Singleton()
print(f"Singleton: a is b -> {a is b}")

# ---------------------------------------------------------------------------
# 2. FACTORY — centralize object creation logic
# ---------------------------------------------------------------------------
class Dog:
    def speak(self): return "Woof!"

class Cat:
    def speak(self): return "Meow!"

def animal_factory(kind):
    animals = {"dog": Dog, "cat": Cat}
    cls = animals.get(kind)
    if cls is None:
        raise ValueError(f"unknown animal kind: {kind}")
    return cls()

print(f"\nfactory: {animal_factory('dog').speak()}, {animal_factory('cat').speak()}")

# ---------------------------------------------------------------------------
# 3. OBSERVER — subscribers get notified when subject state changes
# ---------------------------------------------------------------------------
class EventPublisher:
    def __init__(self):
        self._subscribers = []

    def subscribe(self, callback):
        self._subscribers.append(callback)

    def notify(self, event):
        for callback in self._subscribers:
            callback(event)

def log_event(event):
    print(f"  [logger] event received: {event}")

def alert_event(event):
    print(f"  [alerter] handling: {event}")

publisher = EventPublisher()
publisher.subscribe(log_event)
publisher.subscribe(alert_event)
print("\nobserver pattern:")
publisher.notify("order_placed")

# ---------------------------------------------------------------------------
# 4. STRATEGY — swap algorithms at runtime
# In Python this is usually just "pass a function" — no need for a Strategy
# interface/class hierarchy like in statically-typed languages.
# ---------------------------------------------------------------------------
def sort_ascending(data): return sorted(data)
def sort_descending(data): return sorted(data, reverse=True)

def process(data, strategy):
    return strategy(data)

nums = [3, 1, 4, 1, 5]
print(f"\nstrategy: ascending={process(nums, sort_ascending)} descending={process(nums, sort_descending)}")

# ---------------------------------------------------------------------------
# 5. CONTEXT MANAGER PATTERN — Python's own idiom for "setup, do work, teardown"
# (Deep dive was in 08_file_io.py — shown again here as a *pattern*, not just I/O.)
# ---------------------------------------------------------------------------
from contextlib import contextmanager

@contextmanager
def transaction(db_log):
    db_log.append("BEGIN")
    try:
        yield db_log
        db_log.append("COMMIT")
    except Exception:
        db_log.append("ROLLBACK")
        raise

log = []
with transaction(log):
    log.append("INSERT row")
print(f"\ncontext manager pattern (successful transaction): {log}")

log2 = []
try:
    with transaction(log2):
        log2.append("INSERT row")
        raise RuntimeError("simulated failure")
except RuntimeError:
    pass
print(f"context manager pattern (failed transaction): {log2}")

# ---------------------------------------------------------------------------
# 6. DECORATOR PATTERN — already covered in depth in 14_decorators_metaprogramming.py
# Python's @decorator syntax IS the decorator pattern, built into the language.
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("\n[16_design_patterns.py] Done. Next: 17_packaging_deployment.py")
