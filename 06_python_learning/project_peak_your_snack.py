# lets make an small project like we are selling some snacks based on user input

# first tell the customer what we are selling
print("We are selling the following snacks:")
print("1. Chocolate - $2.50")
print("2. Cookies - $1.50")
print("3. Candy - $3.00")
print("4. Sweets - $4.50")

# first lets get the user input
snack = input("What kind of snack do you want? ")
quantity = int(input("How many do you want? "))

# now lets calculate the total cost
total_cost = 0
if snack == "chocolate":
    total_cost = quantity * 2.50
elif snack == "cookies":
    total_cost = quantity * 1.50
elif snack == "candy":
    total_cost = quantity * 3.00
else:
    total_cost = quantity * 4.50

# now lets print the total cost
print(f"Okay thank you for your order. your Total cost is: ${total_cost}")

# now lets print the total cost with tax
tax_rate = 0.08
tax = total_cost * tax_rate
total_cost_with_tax = total_cost + tax
print(f"Total cost with tax: ${total_cost_with_tax}")

# now lets print the total cost with tax and tip
tip_rate = 0.15
tip = total_cost_with_tax * tip_rate
total_cost_with_tax_and_tip = total_cost_with_tax + tip
print(f"Total cost with tax and tip: ${total_cost_with_tax_and_tip}")

# now lets print the total cost with tax and tip and discount
discount_rate = 0.10
discount = total_cost_with_tax_and_tip * discount_rate
total_cost_with_tax_and_tip_and_discount = total_cost_with_tax_and_tip - discount
print(f"Total cost with tax and tip and discount: ${total_cost_with_tax_and_tip_and_discount}")
