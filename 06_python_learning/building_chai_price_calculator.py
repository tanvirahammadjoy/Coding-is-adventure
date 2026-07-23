# lets make an project we have a tea stall offers different prices for different cup size?
# write a program that calculates the price of chai based on the cup size?

# first tasks
# lets have a cup size
cup_size_small = "small"
cup_size_medium = "medium"
cup_size_large = "large"

# lets have a price
price_small = 1.00
price_medium = 1.50
price_large = 2.00

# now lets print the cup size and price
print("We have the following cup sizes and prices:")
print(f"Small cup: ${price_small}")
print(f"Medium cup: ${price_medium}")
print(f"Large cup: ${price_large}")

# lets have a cup size
cup_size = input("What size cup do you want? ").lower()

# lets have a price
if cup_size == cup_size_small:
    price = price_small
elif cup_size == cup_size_medium:
    price = price_medium
elif cup_size == cup_size_large:
    price = price_large
else:
    print("Invalid cup size. Please try again.")
    exit()

# now lets print the price
print(f"thank you for your order. The price of chai is: ${price}")
