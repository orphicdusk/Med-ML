from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os

# Initialize FastAPI App
app = FastAPI(title="Clinical Decision Support System API", version="1.0")

# Load Models
# Using os.path to ensure it finds the models relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
try:
    heart_model = joblib.load(os.path.join(BASE_DIR, "models/heart_model.joblib"))
    diabetes_model = joblib.load(os.path.join(BASE_DIR, "models/diabetes_model.joblib"))
except Exception as e:
    print(f"Error loading models. Check file paths: {e}")

# ==========================================
# PYDANTIC SCHEMAS (Data Validation Guardrails)
# ==========================================
class HeartData(BaseModel):
    age: int
    sex: int # 1 = male, 0 = female
    cp: int # Chest pain type (0-3)
    trestbps: int # Resting blood pressure
    chol: int # Serum cholesterol in mg/dl
    fbs: int # Fasting blood sugar > 120 mg/dl (1 = true; 0 = false)
    restecg: int # Resting electrocardiographic results (0-2)
    thalach: int # Maximum heart rate achieved
    exang: int # Exercise induced angina (1 = yes; 0 = no)
    oldpeak: float # ST depression induced by exercise
    slope: int # Slope of the peak exercise ST segment (0-2)
    ca: int # Number of major vessels (0-3)
    thal: int # 0 = normal; 1 = fixed defect; 2 = reversable defect

class DiabetesData(BaseModel):
    Age: int
    Gender: int # 1 = Male, 0 = Female
    Polyuria: int # 1 = Yes, 0 = No
    Polydipsia: int # 1 = Yes, 0 = No
    sudden_weight_loss: int
    weakness: int
    Polyphagia: int
    Genital_thrush: int
    visual_blurring: int
    Itching: int
    Irritability: int
    delayed_healing: int
    partial_paresis: int
    muscle_stiffness: int
    Alopecia: int
    Obesity: int

# ==========================================
# API ENDPOINTS
# ==========================================
@app.get("/")
def read_root():
    return {"message": "Welcome to the CDSS API. Go to /docs to test the endpoints."}

@app.post("/predict/heart")
def predict_heart(data: HeartData):
    # Convert incoming JSON to a Pandas DataFrame
    df = pd.DataFrame([data.dict()])
    
    # Make prediction (0 = No Disease, 1 = Disease)
    prediction = heart_model.predict(df)[0]
    probability = heart_model.predict_proba(df)[0][1] # Probability of class 1
    
    return {
        "disease_detected": bool(prediction),
        "risk_probability": round(probability * 100, 2),
        "warning": "High risk detected. Please consult a cardiologist." if prediction else "Low risk detected."
    }

@app.post("/predict/diabetes")
def predict_diabetes(data: DiabetesData):
    # Convert incoming JSON to a Pandas DataFrame, matching the dataset's column names
    # Note: Pydantic converts snake_case to match the keys exactly as written
    df = pd.DataFrame([{
        "Age": data.Age, "Gender": data.Gender, "Polyuria": data.Polyuria, 
        "Polydipsia": data.Polydipsia, "sudden weight loss": data.sudden_weight_loss, 
        "weakness": data.weakness, "Polyphagia": data.Polyphagia, 
        "Genital thrush": data.Genital_thrush, "visual blurring": data.visual_blurring, 
        "Itching": data.Itching, "Irritability": data.Irritability, 
        "delayed healing": data.delayed_healing, "partial paresis": data.partial_paresis, 
        "muscle stiffness": data.muscle_stiffness, "Alopecia": data.Alopecia, 
        "Obesity": data.Obesity
    }])
    
    prediction = diabetes_model.predict(df)[0]
    probability = diabetes_model.predict_proba(df)[0][1]
    
    return {
        "disease_detected": bool(prediction),
        "risk_probability": round(probability * 100, 2),
        "warning": "High risk of early-stage diabetes detected." if prediction else "Low risk detected."
    }