"""
07 — ERROR HANDLING
======================
try/except/else/finally, custom exceptions, exception chaining, context.

Run: python3 07_error_handling.py
"""

# ---------------------------------------------------------------------------
# 1. BASIC TRY/EXCEPT
# ---------------------------------------------------------------------------
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"caught: {e}")

# Catch multiple specific exception types — always prefer specific over bare `except:`
try:
    value = int("not a number")
except (ValueError, TypeError) as e:
    print(f"caught: {type(e).__name__}: {e}")

# ---------------------------------------------------------------------------
# 2. ELSE AND FINALLY
# ---------------------------------------------------------------------------
def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("  error: division by zero")
        return None
    else:
        print("  else: no exception happened")   # runs only if try succeeded
        return result
    finally:
        print("  finally: always runs (cleanup, closing resources, etc.)")

print("safe_divide(10, 2):")
safe_divide(10, 2)
print("safe_divide(10, 0):")
safe_divide(10, 0)

# ---------------------------------------------------------------------------
# 3. RAISING EXCEPTIONS
# ---------------------------------------------------------------------------
def withdraw(balance, amount):
    if amount > balance:
        raise ValueError(f"insufficient funds: balance={balance}, requested={amount}")
    return balance - amount

try:
    withdraw(100, 150)
except ValueError as e:
    print(f"\ncaught: {e}")

# ---------------------------------------------------------------------------
# 4. CUSTOM EXCEPTIONS — subclass Exception for domain-specific errors
# ---------------------------------------------------------------------------
class InsufficientFundsError(Exception):
    """Raised when a withdrawal exceeds the available balance."""
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        super().__init__(f"balance={balance} cannot cover amount={amount}")

class AccountError(Exception):
    """Base class for account-related errors."""

class AccountFrozenError(AccountError):
    pass

def withdraw_v2(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(balance, amount)
    return balance - amount

try:
    withdraw_v2(50, 75)
except InsufficientFundsError as e:
    print(f"\ncustom exception caught: {e} (shortfall={e.amount - e.balance})")

# ---------------------------------------------------------------------------
# 5. EXCEPTION CHAINING — preserve context when translating one error to another
# ---------------------------------------------------------------------------
def parse_config(raw):
    try:
        return int(raw)
    except ValueError as e:
        raise RuntimeError(f"invalid config value: {raw!r}") from e   # keeps original traceback

try:
    parse_config("not-a-number")
except RuntimeError as e:
    print(f"\nchained exception: {e}")
    print(f"original cause: {e.__cause__}")

# ---------------------------------------------------------------------------
# 6. EXCEPTION GROUPS (Python 3.11+) — handle multiple errors at once
# ---------------------------------------------------------------------------
import sys
if sys.version_info >= (3, 11):
    # `except*` is new syntax in 3.11 — wrapped in exec() as a string so this
    # file still PARSES on 3.10 (only this demo is skipped there, not the file).
    exec(
        "try:\n"
        "    raise ExceptionGroup('multiple failures', [ValueError('bad value'), TypeError('bad type')])\n"
        "except* ValueError as eg:\n"
        "    print(f'\\ncaught ValueErrors: {[str(e) for e in eg.exceptions]}')\n"
        "except* TypeError as eg:\n"
        "    print(f'caught TypeErrors: {[str(e) for e in eg.exceptions]}')\n"
    )
else:
    print("\n(ExceptionGroup / except* requires Python 3.11+, skipping demo)")

# ---------------------------------------------------------------------------
# 7. EAFP vs LBYL (see also 18_best_practices.py)
# ---------------------------------------------------------------------------
d = {"a": 1}
# LBYL: "Look Before You Leap"
if "b" in d:
    print(d["b"])
else:
    print("LBYL: key missing, handled before access")

# EAFP: "Easier to Ask Forgiveness than Permission" — more Pythonic, avoids race conditions
try:
    print(d["b"])
except KeyError:
    print("EAFP: key missing, handled via exception")

if __name__ == "__main__":
    print("\n[07_error_handling.py] Done. Next: 08_file_io.py")
