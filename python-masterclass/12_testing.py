"""
12 — TESTING
==============
unittest (stdlib), pytest-style assertions, mocking, fixtures.

Run: python3 12_testing.py
(This file runs its own unittest suite via unittest.main() at the bottom.)
"""

import unittest
from unittest.mock import Mock, patch, MagicMock

# ---------------------------------------------------------------------------
# CODE UNDER TEST
# ---------------------------------------------------------------------------
def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        raise ValueError("cannot divide by zero")
    return a / b

class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        return self.balance

class WeatherClient:
    """Pretend this calls a real API — we'll mock it in tests."""
    def get_temperature(self, city):
        raise NotImplementedError("would call a real API in production")

def describe_weather(client, city):
    temp = client.get_temperature(city)
    return "hot" if temp > 25 else "cold"

# ---------------------------------------------------------------------------
# 1. unittest — Python's built-in testing framework
# ---------------------------------------------------------------------------
class TestMathFunctions(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(2, 3), 5)
        self.assertEqual(add(-1, 1), 0)

    def test_divide(self):
        self.assertEqual(divide(10, 2), 5)

    def test_divide_by_zero_raises(self):
        with self.assertRaises(ValueError):
            divide(10, 0)

class TestBankAccount(unittest.TestCase):
    def setUp(self):
        # setUp runs before EVERY test method — use it to build fresh fixtures.
        self.account = BankAccount(balance=100)

    def test_deposit(self):
        self.assertEqual(self.account.deposit(50), 150)

    def test_withdraw(self):
        self.assertEqual(self.account.withdraw(30), 70)

    def test_withdraw_too_much_raises(self):
        with self.assertRaises(ValueError):
            self.account.withdraw(1000)

    def test_negative_deposit_raises(self):
        with self.assertRaises(ValueError):
            self.account.deposit(-10)

# ---------------------------------------------------------------------------
# 2. MOCKING — replace real dependencies (APIs, databases, clocks) with fakes
# ---------------------------------------------------------------------------
class TestWeatherDescription(unittest.TestCase):
    def test_hot_weather(self):
        mock_client = Mock()
        mock_client.get_temperature.return_value = 30    # fake the API response
        self.assertEqual(describe_weather(mock_client, "Cairo"), "hot")
        mock_client.get_temperature.assert_called_once_with("Cairo")   # verify the call

    def test_cold_weather(self):
        mock_client = Mock()
        mock_client.get_temperature.return_value = 5
        self.assertEqual(describe_weather(mock_client, "Oslo"), "cold")

    @patch("builtins.print")     # patch replaces print() only for this test
    def test_patch_decorator(self, mock_print):
        print("this call is intercepted")
        mock_print.assert_called_once_with("this call is intercepted")

# ---------------------------------------------------------------------------
# 3. WHAT PYTEST WOULD LOOK LIKE (for comparison — not run here, no dependency)
# ---------------------------------------------------------------------------
PYTEST_EXAMPLE = '''
# pytest uses plain assert statements and function-based tests — less boilerplate:

import pytest

def test_add():
    assert add(2, 3) == 5

def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(10, 0)

@pytest.fixture
def account():
    return BankAccount(balance=100)          # fixtures replace setUp()

def test_withdraw(account):
    assert account.withdraw(30) == 70

@pytest.mark.parametrize("a,b,expected", [(1, 1, 2), (2, 3, 5), (-1, 1, 0)])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected

# Run with:  pip install pytest && pytest -v
'''
print(PYTEST_EXAMPLE)

if __name__ == "__main__":
    print("[12_testing.py] Running unittest suite...\n")
    unittest.main(argv=["ignored", "-v"], exit=False)
    print("\n[12_testing.py] Done. Next: 13_concurrency_async.py")
