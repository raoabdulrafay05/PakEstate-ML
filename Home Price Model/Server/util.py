import json
import pickle
import numpy as np

__city = None
__location = None
__type = None
__data_columns = None
__model = None
json_data = None

def get_city_names():
    return __city

def get_location_city_names():
    return __location

def get_types():
    return __type

def get_estimated_price(area, bedroom, bath, property_type, city, location):
    try:
        loc_index = __data_columns.index(location.lower())
    except:
        loc_index = -1
        
    x = np.zeros(len(__data_columns))
    x[0] = area
    x[1] = bedroom
    x[2] = bath
    try:
        type_index = __data_columns.index(property_type.lower())
    except:
        type_index = -1
    try:
        city_index = __data_columns.index(city.lower())
    except:
        city_index = -1
        
    if loc_index >= 0:
        x[loc_index] = 1
    if type_index >= 0:
        x[type_index] = 1
    if city_index >= 0:
        x[city_index] = 1
    return round(__model.predict([x])[0], 0)

def load_saved_artifacts():
    global __data_columns, __city, __model, __type, __location, json_data
    print("Loading saved artifacts...")
    
    with open("./server/artifacts/data_columns.json", "r") as f:
        __data_columns = json.load(f)["data_columns"]
        __type = __data_columns[3:8]
        __city = __data_columns[56:65]
        __location = __data_columns[8:56]
    
    with open('model/locations.json', 'r') as f:
        # Here we assume the value of "locations_data" is already a JSON array
        json_data = json.load(f)["locations_data"]
        
    with open("./server/artifacts/Pakistan_Home_Prices_Model.pickle", "rb") as f:
        __model = pickle.load(f)
    
    print("Loading saved artifacts...done")
with open('model/locations.json', 'r') as f:
    data = json.load(f)

# Check if "locations_data" is already a list.
if isinstance(data["locations_data"], list):
    locations_data = data["locations_data"]
else:
    locations_data = json.loads(data["locations_data"])

def get_location_names(property_type, city):
    matching_locations = []
    for record in locations_data:
        # Using case-insensitive matching for flexibility.
        if record["type"].lower() == property_type.lower() and record["location_city"].lower() == city.lower():
            matching_locations.extend(record["location"])
    # Remove duplicates, if any.
    return list(set(matching_locations))

if __name__ == "__main__":
    load_saved_artifacts()
    # get_location_names("house", "hyderabad")
    # print("location:", get_location_names("house", "hyderabad"))
    print(get_estimated_price(2178.000,4,6,"house","b-17","islamabad"))
    print(get_estimated_price(2178,6,4,"house","islamabad","b-17"))


