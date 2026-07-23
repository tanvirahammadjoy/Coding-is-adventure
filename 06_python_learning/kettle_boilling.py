# lets we have a kettle which we can boil water

# first lets have a kettle
kettle = "kettle"

# is it clean?
is_kettle_clean = True

# do we have a kettle?
has_kettle = True

# do we have water?
has_water = True

# can we boil the water?
can_boil = has_kettle and has_water and is_kettle_clean

# can we boil the water?
if can_boil:
    print("We can boil the water")
else:
    print("We can't boil the water")
