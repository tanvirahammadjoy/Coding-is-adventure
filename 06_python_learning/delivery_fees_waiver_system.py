# this is a delivery fees waiver system

# lets say we have a online tea store
# and if some one orders more than 5 cups of tea then we will waive the delivery fees
# otherwise we will charge the delivery fees as usual

# first lets have a cup size
cup_size_small = "small"
cup_size_medium = "medium"
cup_size_large = "large"

# first lets have a price
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
quantity = int(input("How many do you want? "))

# now lets calculate the total cost
total_cost = 0
if cup_size == cup_size_small:
    total_cost = quantity * price_small
elif cup_size == cup_size_medium:
    total_cost = quantity * price_medium
else:
    total_cost = quantity * price_large
    
# now lets print the total cost
print(f"Total cost: ${total_cost}")

# now lets calculate the delivery fees
delivery_fees = 0
if total_cost > 5:
    delivery_fees = 0
else:
    delivery_fees = 2.00

# now lets print the delivery fees
print(f"Delivery fees: ${delivery_fees}")
