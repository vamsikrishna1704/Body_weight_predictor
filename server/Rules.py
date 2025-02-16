import joblib
import pandas as pd

#Rule1: height check and bring into single unit
def height_check(height, height_unit):
    if height_unit.lower() == 'ft':
        integer_part, decimal_part = height.split('.')
        sum = round(int(integer_part) * 30.48 + int(decimal_part) * 2.54, 2)
        return round(sum/100, 2)
    elif height_unit.lower() == 'cm':
        return round(float(height)/100, 2)
    else:
        return height


#Rule2: age check and throw error
def age_check(age):
    if age < 13:
        return 0
    else:
        return age
    
#Rule3: gender check and throw error
def gender_check(gender):
    if gender.lower() == 'm' or gender.lower() == 'male':
        return 'm'
    elif gender.lower() == 'f' or gender.lower() == 'female':
        return 'f'
    else:
        return 'o'

#Rule4: weight check and bring into single unit
def weight_check(weight, weight_unit):
    if weight_unit.lower() == 'lb':
        return round(weight/2.2046 , 2)
    else:
        return weight
    
#Rule5: activity level check and find the associated numeric value
def find_activity_level(activity):
    if activity.lower() == 'no active':
        return 1.20
    elif activity.lower() == 'little active':
        return 1.37
    elif activity.lower() == 'moderate active':
        return 1.46
    elif activity.lower() == 'active':
        return 1.54
    elif activity.lower() == 'very active':
        return 1.72
    elif activity.lower() == 'extra activity':
        return 1.89
    else:
        return 0
    

#Rule6: calculate bmi using formula
def calculate_bmi(weight, height):
    bmi = weight / (height ** 2)
    return round(bmi, 1)

#Rule7: check the bmi catergory based on bmi index
def find_bmi_category(bmi):
    if bmi < 18.5:
        return 'under weight'
    elif bmi >= 18.5 and bmi<=24.9:
        return 'normal weight'
    elif bmi>=25 and bmi<=29.9:
        return 'over weight'
    else:
        return 'obesity'
    
#Rule8: calculates the ideal weight
def find_ideal_weight(bmi, height):
   if bmi >= 18.5 and bmi <= 24.9:
       return round((bmi)*(height**2))
   else:
       return round((21.7)*(height)**2)
   
#Rule9: check weight difference between current weight and ideal weight
def weight_difference(w1, w2):
    diff = w1 - w2
    if diff < 0:
        return (-diff),'lose'
    elif diff == 0:
        return diff,'maintain'
    else:
        return diff,'gain'
    
#Rule10: check the pace of goal fulfilment
def get_pace(pace):
    if pace == 'slow':
        return 0.25
    elif pace == 'medium':
        return 0.5
    elif pace == 'fast':
        return 1
    
#Rule11: estimating the goal completion
def weekCounter(wieghtdiff,value):
    count = 0
    while(True):
        count += 1
        wieghtdiff -= value
        if(wieghtdiff == 0):
            break
    return count

#Rule12: get the proportionality based on pace and activity level
def get_percentage(pace, activity_level):
    data = {'pace': ['slow loss', 'medium loss', 'fast loss','slow gain','medium gain','fast gain'],
        'no active': [88, 75, 50, 112, 125, 150],
        'little active': [89,78,57,111,122,143],
        'medium active': [90,80,59,110,120,141],
        'active': [90,81,62,110,119,138],
        'very active': [91,83,65,109,117,135],
        'extra active': [92,84,69,108,116,131]}

    df = pd.DataFrame(data)

    # Set 'Name' column as the index
    df.set_index('pace', inplace=True)

    # Use .loc to select the cell
    selected_cell_value = df.loc[pace, activity_level]

    return selected_cell_value/100
        

#Rule13: calories intake prediction
def get_prediction(age, weight, height, bmi, gender):

    if gender.lower() == "male" or gender.lower() == "m":
        is_male = 1
        is_female= 0
    else:
        is_female = 1
        is_male = 0

    new_data = pd.DataFrame({
    'age': [age],      # Replace with the actual age  
    'weight': [weight], # Replace with the actual weight in kg
    'height': [height],  # Replace with the actual height in cm
    'bmi': [bmi],      # Replace with the actual BMI
    'is_female': [is_female ],
    'is_male': [is_male]     
    })

    model=joblib.load('./model/calorie_prediction_model.joblib')
    value = model.predict(new_data)
    calories = value[0]
    return round(calories, 2)

#Rule14: food items suggestion based on calories intake
def suggest_food_items(df, calorie_limit, goal, category):
    # Define macronutrient ratios
    macro_ratios = {
        'lose': [30, 30, 40],
        'gain': [30, 30, 40],
        'maintain': [30, 30, 40]
    }

    # Filter based on category if provided
    if category:
        df = df[df['Category'] == category]

    # Find items with closest calories to the limit, if exact match is not found
    df['Calorie_Diff'] = abs(df['Calories'] - calorie_limit)
    closest_calories_df = df.nsmallest(10, 'Calorie_Diff')

    # Calculate the total macronutrients in grams for the closest calorie items
    total_macros = closest_calories_df[['Protein', 'Fat', 'Carbs']].sum(axis=1)

    # Calculate the percentage of each macronutrient
    closest_calories_df.loc[:, 'Protein%'] = (closest_calories_df['Protein'] / total_macros) * 100
    closest_calories_df.loc[:, 'Fat%'] = (closest_calories_df['Fat'] / total_macros) * 100
    closest_calories_df.loc[:, 'Carbs%'] = (closest_calories_df['Carbs'] / total_macros) * 100

    # Filter based on macro ratios for the specific goal
    ratio = macro_ratios[goal]
    final_df = closest_calories_df[
        (closest_calories_df['Protein%'] >= ratio[0] - 10) & (closest_calories_df['Protein%'] <= ratio[0] + 10) &
        (closest_calories_df['Fat%'] >= ratio[1] - 10) & (closest_calories_df['Fat%'] <= ratio[1] + 10) &
        (closest_calories_df['Carbs%'] >= ratio[2] - 10) & (closest_calories_df['Carbs%'] <= ratio[2] + 10)
    ]

    return final_df[['Food', 'Measure', 'Grams', 'Calories', 'Protein', 'Fat', 'Carbs', 'Category']]









