# lets build an ticketing system for a train app
# and based on the seat type we will show its features

# first lets have a seat type
# seat_type_sleepers = "sleepers"
# seat_type_ac = "ac"
# general_seat = "general_seat"
# luxury_seat = "luxury"

# first lets have a price
price_sleepers = 100.00
price_ac = 200.00
price_general = 50.00
price_luxury = 250.00

# now lets print the seat type and price
print("We have the following seat types and prices:")
print(f"Sleepers: ${price_sleepers}")
print(f"AC: ${price_ac}")
print(f"General: ${price_general}")
print(f"Luxury: ${price_luxury}")

# lets have a seat type
seat_type = input("What type of seat do you want? ").lower()

# now lets calculate the total cost
total_cost = 0
# this way it will not work
# match seat_type:
#     case seat_type_sleepers:
#         total_cost = price_sleepers
#     case seat_type_ac:
#         total_cost = price_ac
#     case general_seat:
#         total_cost = price_general
#     case luxury_seat:
#         total_cost = price_luxury

# this way it will work

match seat_type:
    case "sleepers":
        total_cost += price_sleepers
    case "ac":
        total_cost = price_ac
    case "general_seat":
        total_cost = price_general
    case "luxury_seat":
        total_cost = price_luxury

# now lets print the total cost
print(f"Okay your total cost is: ${total_cost}")
