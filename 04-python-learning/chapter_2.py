# lets explore Numbers, booleans and operators in details in Python

# numbers
# int/integer/whole number
# real number/float/floating point/decimal/double/double precision
# complex number/complex/imaginary/(2 + 3j)

# operators
# + addition
# - subtraction
# * multiplication
# / division
# % modulo
# ** exponent
# // floor division

# floor division
# integer/whole division
# pure division
# exponentiation

# integer example
black_coffee = 10
number_of_cups = 2
total_cost = black_coffee * number_of_cups
print(f"Total cost: ${total_cost}")

# float example
price_of_tea = 2.5
number_of_tea_bags = 3
total_cost = price_of_tea * number_of_tea_bags
print(f"Total cost: ${total_cost}")

# integer division example
# this the floor division operator which returns the integer value of the division
total_cost = 100
number_of_cups = 2
black_coffee = total_cost // number_of_cups
print(f"Black coffee through floor division: {black_coffee}")

# pure division but not integer this will return float
total_cost = 100
number_of_cups = 2
black_coffee = total_cost / number_of_cups
print(f"Black coffee through pure division: {black_coffee}")

# lets use the pure division to get the float value of total cost
total_coffee_bags = 7
pots = 3
total_cost = total_coffee_bags / pots
# keep two precision after decimal point
print(f"Total cost: ${total_cost:.2f}")

# lets use floor division to get the integer value of total cost
total_coffee_bags = 7
pots = 3
total_cost = total_coffee_bags // pots
print(f"Total cost: ${total_cost}")

# lets explore the modulo operator which returns the remainder of the division
carrots = 7
make_packets = 3
remainder = carrots % make_packets
print(f"Remainder: {remainder}")

# lets explore the exponent operator which returns the power of the number
base = 2
exponent = 3
power = base ** exponent
print(f"Power of {base} raised to {exponent}: {power}")

# lets write 1 billion in python using exponent operator
one_billion = 10 ** 9
print(f"One billion: {one_billion}")

# lets write 1 million in python using exponent operator
one_million = 10 ** 6
print(f"One million: {one_million}")

# lets write 1 thousand in python using exponent operator
one_thousand = 10 ** 3
print(f"One thousand: {one_thousand}")

# by underscore also we can write 1 million in python
one_million = 1_000_000
print(f"One million: {one_million}")
