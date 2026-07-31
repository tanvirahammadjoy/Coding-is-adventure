# we want to simulate a boiling pot
# we want to print the temperature every 5 seconds
# we want to start the pot at 30 degrees
# we want to stop the pot when the temperature is 100 degrees

# first lets have a temperature
temperature = 30

# now lets print the temperature
while temperature < 100:
    print(f"The temperature is {temperature} degrees")
    temperature += 5

# now lets print the temperature
print(f"This pot is done. The temperature is {temperature} degrees")

