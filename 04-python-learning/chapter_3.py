# lets explore boolean, None and logical operators in python

# boolean values
# True
# False

# None

# logical operators
# and
# or
# not

# boolean values can be used to check if something is true or false
is_raining = True
is_sunny = False
print(f"Is it raining? {is_raining}")

# None is a special value that represents the absence of a value
is_raining = None
print(f"Is it raining? {is_raining}")

# logical operators can be used to combine boolean values
is_raining_and_sunny = is_raining and is_sunny
is_raining_or_sunny = is_raining or is_sunny
is_not_raining = not is_raining
print(f"Is it raining and sunny? {is_raining_and_sunny}")
print(f"Is it raining or sunny? {is_raining_or_sunny}")
print(f"Is it not raining? {is_not_raining}")

# lets make an story using boolean values and logical operators
is_hungry = True
is_willing_to_eat = True

is_hungry_and_willing = is_hungry and is_willing_to_eat
is_hungry_or_willing = is_hungry or is_willing_to_eat
is_not_hungry = not is_hungry

print(f"Is the person hungry and willing to eat? {is_hungry_and_willing}")
print(f"Is the person hungry or willing to eat? {is_hungry_or_willing}")
print(f"Is the person not hungry? {is_not_hungry}")
