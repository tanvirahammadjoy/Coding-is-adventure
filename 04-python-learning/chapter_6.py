# lets explore about tuples in python
# what can do tuples in python
# tuples are immutable
# tuples are ordered
# tuples are indexed
# tuples are iterable

my_tuple = ("apple", "banana", "cherry", "orange", "kiwi", "melon", "mango")
print(my_tuple)

# unpacking tuples in python
fruits = ("apple", "banana", "cherry", "orange", "kiwi", "melon", "mango")
apple, banana, cherry, orange, kiwi, melon, mango = fruits
print(apple)
print(banana)
print(cherry)
print(orange)
print(kiwi)
print(melon)
print(mango)

# how to sort tuples in python
fruits = ("apple", "banana", "cherry", "orange", "kiwi", "melon", "mango")
sorted_fruits = sorted(fruits)
print(sorted_fruits)

# how to reverse tuples in python
fruits = ("apple", "banana", "cherry", "orange", "kiwi", "melon", "mango")
reversed_fruits = reversed(fruits)
print(reversed_fruits)

# how to count tuples in python
fruits = ("apple", "banana", "cherry", "orange", "kiwi", "melon", "mango")
count_fruits = len(fruits)
print(count_fruits)

# how to swap tuples in python
fruits = ("apple", "banana", "cherry", "orange", "kiwi", "melon", "mango")
apple, banana = banana, apple
print(f"apple is: {apple}, banana is: {banana}")
