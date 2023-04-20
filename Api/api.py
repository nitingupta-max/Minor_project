import pickle
import pandas as pd
from fastapi import FastAPI, Form
from pydantic import BaseModel
from sklearn.preprocessing import StandardScaler
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Set up CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define input data schema


class InputData(BaseModel):
    amt: float
    gender: int
    city_pop: int
    age: float
    trans_month: int
    trans_year: int
    latitudinal_distance: float
    longitudinal_distance: float
    category_food_dining: int
    category_gas_transport: int
    category_grocery_net: int
    category_grocery_pos: int
    category_health_fitness: int
    category_home: int
    category_kids_pets: int
    category_misc_net: int
    category_misc_pos: int
    category_personal_care: int
    category_shopping_net: int
    category_shopping_pos: int
    category_travel: int


# Load pre-trained model and standard scaler
with open("logistic_reg.sav", "rb") as f:
    model = pickle.load(f)
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Endpoint to receive form data and return prediction

temp = {
    "category_food_dining": 0,
    "category_gas_transport": 0,
    "category_grocery_net": 0,
    "category_grocery_pos": 0,
    "category_health_fitness": 0,
    "category_home": 0,
    "category_kids_pets": 0,
    "category_misc_net": 0,
    "category_misc_pos": 0,
    "category_personal_care": 0,
    "category_shopping_net": 0,
    "category_shopping_pos": 0,
    "category_travel": 0
}


def update_dict_value(key, temp):
    # convert the user input to the corresponding dictionary key
    switcher = {
        1: "category_food_dining",
        2: "category_gas_transport",
        3: "category_grocery_net",
        4: "category_grocery_pos",
        5: "category_health_fitness",
        6: "category_home",
        7: "category_kids_pets",
        8: "category_misc_net",
        9: "category_misc_pos",
        10: "category_personal_care",
        11: "category_shopping_net",
        12: "category_shopping_pos",
        13: "category_travel"
    }
    dict_key = switcher.get(key)

    # check if the dictionary key is valid
    if dict_key is None:
        print("Invalid key.")
        return

    # update the dictionary value at the given key
    temp[dict_key] = 1

    # print(f"Value at {dict_key} updated to {temp[dict_key]}.")
    return temp


@app.post("/predict")
async def predict(
    amt: float = Form(...),
    gender: int = Form(...),
    city_pop: int = Form(...),
    age: float = Form(...),
    trans_month: int = Form(...),
    trans_year: int = Form(...),
    latitudinal_distance: float = Form(...),
    longitudinal_distance: float = Form(...),
    category: int = Form(...)
):

    print(
        amt,
        gender,
        city_pop,
        age,
        trans_month,
        trans_year,
        latitudinal_distance,
        longitudinal_distance,
        category
    )
    # Create InputData object from form data
    category_data = update_dict_value(category, temp)
    data = InputData(
        amt=amt,
        gender=gender,
        city_pop=city_pop,
        age=age,
        trans_month=trans_month,
        trans_year=trans_year,
        latitudinal_distance=latitudinal_distance,
        longitudinal_distance=longitudinal_distance,
        **category_data
    )
    # Convert InputData object to pandas DataFrame
    df = pd.DataFrame([data.dict()])
    # Apply standard scaling
    X_scaled = scaler.transform(df)
    # Make prediction using pre-trained model
    y_pred = model.predict(X_scaled)
    # Convert prediction to list and extract the first element
    prediction = y_pred.tolist()[0]
    # Return JSON response with prediction result

    return {"prediction": prediction}
