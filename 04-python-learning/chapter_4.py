import cmath
import decimal
import fractions
import math
import numbers
import operator
import random
import statistics
import sys

# real number/float/floating point/decimal/double/double precision
# complex number/complex/imaginary/(2 + 3j)

# float example
price_of_tea = 2.5
number_of_tea_bags = 3
total_cost = price_of_tea * number_of_tea_bags
print(f"Total cost: ${total_cost}")

# complex number/complex/imaginary/(2 + 3j)
complex_number = 2 + 3j
print(f"Complex number: {complex_number}")  # (2+3j)
print(f"Real part: {complex_number.real}")  # 2.0
print(f"Imaginary part: {complex_number.imag}")  # 3.0
print(f"Conjugate: {complex_number.conjugate()}")  # (2-3j)
print(f"Absolute value: {abs(complex_number)}")  # 3.605551275463989
print(f"Type of complex number: {type(complex_number)}")  # <class 'complex'>

# use the sys module to get the size of the complex number in bytes
print(f"Size of complex number in bytes: {sys.getsizeof(complex_number)}")  # 32
print(
    f"Size of complex number in bytes using math module: {math.ceil(math.log2(sys.getsizeof(complex_number)))}"
)  # 5

# use the sys module to get the size of the float number in bytes
print(f"Size of float number in bytes: {sys.getsizeof(total_cost)}")  # 24
print(
    f"Size of float number in bytes using math module: {math.ceil(math.log2(sys.getsizeof(total_cost)))}"
)  # 4

print(
    f"float information: {sys.float_info}"
)  # float information: sys.float_info(max=1.7976931348623157e+308, max_exp=1024, max_10_exp=308, min=2.2250738585072014e-308, min_exp=-1021, min_10_exp=-307, dig=15, mant_dig=53, epsilon=2.220

# lets see what can we do with the decimal module
price_of_tea = decimal.Decimal("2.50")
number_of_tea_bags = decimal.Decimal("3")
total_cost = price_of_tea * number_of_tea_bags
print(f"Total cost: ${total_cost}")

# lets see what can we do with the fractions module
fraction1 = fractions.Fraction(1, 2)
fraction2 = fractions.Fraction(3, 4)
print(fraction1 + fraction2)  # 5/4

# lets see what can we do with the random module
random_number = random.randint(1, 10)
print(random_number)  # 5

# lets see what can we do with the statistics module
data = [1, 2, 3, 4, 5]
mean = statistics.mean(data)
print(mean)  # 3.0

# lets see what can we do with the cmath module
complex_number = cmath.rect(2, 3)
print(complex_number)  # (2+3j)

# lets see what can we do with the numbers module
print(f"Number of types in numbers module: {len(numbers.__dict__)}")

# lets see what can we do with the operator module
print(f"Addition using operator module: {operator.add(2, 3)}")
print(f"Subtraction using operator module: {operator.sub(5, 3)}")
print(f"Multiplication using operator module: {operator.mul(2, 3)}")
print(f"Division using operator module: {operator.truediv(6, 3)}")
