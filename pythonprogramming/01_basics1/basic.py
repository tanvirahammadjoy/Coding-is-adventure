for item in range(1, 10):
    # spaces
    for j in range(9 - item):
        print(" ", end="")

    for j in range(item):
        print("* ", end="")

    print()

rows = 9
for i in range(rows, 0, -1):
    # spaces
    for j in range(9 - i):
        print(" ", end="")

    # stars
    for j in range(i * 2 - 1):
        print("*", end="")

    print()
