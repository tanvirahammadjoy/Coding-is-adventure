# lets explore strings in python

# strings are immutable
# strings are ordered
# strings are indexed
# strings are iterable

# strings are immutable in python, which means that once a string is created, it cannot be changed. However, we can create a new string by concatenating or slicing the original string.
# example of string immutability in python
string1 = "Hello"
string2 = "World"
string3 = string1 + " " + string2
print(string3)  # Output: Hello World
print(f"ID of string1: {id(string1)}")
string1 = "Hello World"
print(f"ID of string1: {id(string1)}")

# strings are ordered in python, which means that the characters in a string are in a specific order. This order is determined by the position of each character in the string.
# example of string ordering in python
string1 = "Hello World"
print(string1[0])  # Output: H
print(string1[1])  # Output: e
print(string1[2])  # Output: l
print(string1[3])  # Output: l
print(string1[4])  # Output: o

# strings are indexed in python, which means that we can access a specific character in a string by its position in the string.
# example of string indexing in python
string1 = "Hello World"
print(string1[0])  # Output: H
print(string1[1])  # Output: e
print(string1[2])  # Output: l
print(string1[3])  # Output: l
print(string1[4])  # Output: o

# strings are iterable in python, which means that we can use a for loop to iterate over the characters in a string.
# example of string iteration in python
string1 = "Hello World"
for char in string1:
    print(char)

# string slicing in python
string1 = "Hello World"
print(string1[0:5])  # Output: Hello
print(string1[6:])  # Output: World
print(string1[:5])  # Output: Hello
print(string1[:-1])  # Output: Hello Worl
print(string1[::-1])  # Output: Hello Worl

# lets explore string methods in python
# string methods are functions that can be used on strings
# string methods are defined in the string module
# string methods are defined in the str class
# string methods are defined in the __str__ method
# string methods are defined in the __repr__ method

# example of string methods in python
string1 = "Hello World"
print(string1.upper())  # Output: HELLO WORLD
print(string1.lower())  # Output: hello world
print(string1.capitalize())  # Output: Hello world
print(string1.title())  # Output: Hello World
print(string1.swapcase())  # Output: hELLO wORLD
print(string1.replace("Hello", "Hi"))  # Output: Hi World

# example of string methods in python
string1 = "Hello World"
print(string1.startswith("Hello"))  # Output: True
print(string1.endswith("World"))  # Output: True

# how to work with strings encoding
# example of string encoding in python
string1 = "Hello World"
print(string1.encode("utf-8"))  # Output: b'Hello World'
print(string1.encode("ascii"))  # Output: b'Hello World'
print(string1.encode("latin-1"))  # Output: b'Hello World'

# example of string encoding characters in python
string1 = "Hello World"
print(string1.encode("utf-8"))  # Output: b'Hello World'
print(string1.encode("utf-16"))  # Output: b'Hello World'
print(string1.encode("utf-32"))  # Output: b'Hello World'

# lets write some japanese, korean and chinese in python
japanese = "こんにちは世界"
print(japanese.encode("utf-8"))
print(japanese.encode("utf-16"))
print(japanese.encode("utf-32"))
print(f"japanese: {japanese.encode("shift-jis")}")
print(f"japanese: {japanese.encode('euc-jp')}")
print(f"japanese: {japanese.encode('iso-2022-jp')}")
print(f"japanese: {japanese.encode('cp932')}")
print(f"japanese: {japanese.encode('cp949')}")
print(japanese)
# write some korean in python
korean = "안녕하세요"
print(korean.encode("utf-8"))
print(korean.encode("utf-16"))
print(korean.encode("utf-32"))
# print(f"korean: {korean.encode("euc-kr")}")
# print(f"korean: {korean.encode('cp949')}")
print(korean)
# write some chinese in python
chinese = "你好世界"
print(chinese.encode("utf-8"))
print(chinese.encode("utf-16"))
print(chinese.encode("utf-32"))
print(f"chinese: {chinese.encode("gbk")}")
print(f"chinese: {chinese.encode('gb2312')}")
print(f"chinese: {chinese.encode('gb18030')}")
print(chinese)
