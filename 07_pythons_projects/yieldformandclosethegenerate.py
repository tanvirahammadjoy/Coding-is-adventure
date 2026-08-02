def local_chai():
    yield "Masala Chai"
    yield "Ginger chai"

def imported_chai():
    yield "Matcha"
    yield "Ooplong"

def full_menue():
    yield from local_chai()
    yield from imported_chai()

for chai in full_menue():
    print(chai)
