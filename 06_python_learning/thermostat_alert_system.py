# lets make project for thermostat alert system

# lets check the is device is on or off
device_is_on = False

# lets check temperature
if device_is_on:
    temperature = 35
    if temperature > 30:
        print("Temperature is too high")
    elif temperature < 20:
        print("Temperature is too low")
    else:
        print("Temperature is normal")
else:
    print("Device is off")
