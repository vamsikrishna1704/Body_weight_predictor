import json
from flask import Flask, request, jsonify
import Rules  # Import your Rules module
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

calorieS = None
goaL = None

@app.route('/predict', methods=['POST'])
def predict_calories():
    global calorieS
    global goaL
    data = request.json
    height = Rules.height_check((data['height']), data['heightUnit'])
    age = Rules.age_check(int(data['age']))
    gender = Rules.gender_check(data['gender'])
    weight = Rules.weight_check(float(data['weight']), data['weightUnit'])
    activity_level = data['activity']
    activity = Rules.find_activity_level(activity_level)
    bmi = Rules.calculate_bmi(weight, height)
    bmi_category = Rules.find_bmi_category(bmi)
    ideal_weight = Rules.find_ideal_weight(bmi, height)
    weight_difference, goal = Rules.weight_difference(ideal_weight, weight)
    goaL = goal
    calories = Rules.get_prediction(age, weight, height*100, bmi, gender)
    gain = Rules.get_percentage('medium gain', activity_level)
    loss = Rules.get_percentage('medium loss', activity_level)
    if goal == 'maintain':
        calories = calories * 1
    elif goal == 'gain':
        calories = calories * gain
    else:
        calories = calories * loss
    predicted_calories = calories * activity
    calorieS = predicted_calories
    return jsonify({'bmiCategory':bmi_category,'goal': goal,'weightDifference': weight_difference,'predictedCalories': predicted_calories,'idealWeight':ideal_weight})

@app.route('/diet-plan', methods = ['POST'])
def plan_diet():
    global goaL
    global calorieS
    data = request.json
    df = pd.read_csv('./data/nutrients.csv')
    goal = goaL
    meal = int(data['meals'])
    if( meal == 2 ):
        calories_meal1 = (calorieS * 0.35)/2
        calories_meal2 = (calorieS * 0.65)/3
        meal1 = Rules.suggest_food_items(df, calories_meal1, goal, 'Dairy products')
        item1, grams1= meal1.iloc[0,0], meal1.iloc[0,2]
        meal2 = Rules.suggest_food_items(df, calories_meal2, goal, 'Meat, Poultry')
        item2, grams2= meal2.iloc[0,0], meal2.iloc[0,2]
        result = {'items1':item1,'grams1':float(grams1)*2,'items2':item2,'grams2':float(grams2)*3, 'meal': meal}
    elif(meal == 3 ):
        calories_meal1 = calorieS * 0.30
        calories_meal2 = calorieS * 0.45
        calories_meal3 = calorieS * 0.25
        meal1 = Rules.suggest_food_items(df, calories_meal1, goal, 'Dairy products')
        item1, grams1= meal1.iloc[0,0], meal1.iloc[0,2]
        meal2 = Rules.suggest_food_items(df, calories_meal2, goal, 'Meat, Poultry')
        item2, grams2= meal2.iloc[0,0], meal2.iloc[0,2]
        meal3 = Rules.suggest_food_items(df, calories_meal3, goal, 'Meat, Poultry')
        item3, grams3= meal3.iloc[0,0], meal3.iloc[0,2]
        result = {'items1':item1,'grams1':grams1,'items2':item2,'grams2':grams2,'items3':item3,'grams3':grams3, 'meal': meal}
    return json.dumps(result)


if __name__ == '__main__':
    app.run(debug=True)
