# data types in python

# int
# float
# str
# bool
# list
# tuple
# dict
# set
# frozenset
# None
# complex
# range
# bytes
# memoryview
# bytearray
# ellipsis
# not implemented

# None
# type()

# first find the mutable and immutable data types in python
# mutable data types can be changed
# immutable data types cannot be changed

# mutable data types
# list
# dict
# set
# frozenset
# bytearray
# memoryview
# ellipsis

# immutable data types
# int
# float
# str
# bool
# tuple
# range
# bytes
# complex
# None

# example of mutable data types in python prove its mutable

list1 = [1, 2, 3, 4, 5]
print("ID of list1: " + str(id(list1)))
list1[0] = 10
print("ID of list1 after modification: " + str(id(list1)))
print("Value of list1: " + str(list1))


# example of immutable data types in python prove its immutable

int1 = 10
print("ID of int1: " + str(id(int1)))
int1 = 20
print("ID of int1 after reassignment: " + str(id(int1)))
print("Value of int1: " + str(int1))
