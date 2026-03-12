from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

# Initialize FastAPI App
app = FastAPI(title="Clinical Decision Support System API", version="1.0")

# Enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows your React app to bypass security blocks during development
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Load Models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
try:
    heart_model = joblib.load(os.path.join(BASE_DIR, "models/heart_model.joblib"))
    diabetes_model = joblib.load(os.path.join(BASE_DIR, "models/diabetes_model.joblib"))
except Exception as e:
    print(f"Error loading models. Check file paths: {e}")

# ==========================================
# PYDANTIC SCHEMAS
# ==========================================
class HeartData(BaseModel):
    age: int
    sex: int 
    cp: int 
    trestbps: int 
    chol: int 
    fbs: int 
    restecg: int 
    thalach: int 
    exang: int 
    oldpeak: float 
    slope: int 
    ca: int 
    thal: int 

class DiabetesData(BaseModel):
    Age: int
    Gender: int 
    Polyuria: int 
    Polydipsia: int 
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
    df = pd.DataFrame([data.dict()])
    
    prediction = heart_model.predict(df)[0]
    probability = heart_model.predict_proba(df)[0][1] 
    
    return {
        "disease_detected": bool(prediction),
        "risk_probability": round(probability * 100, 2),
        "warning": "High risk detected. Please consult a cardiologist." if prediction else "Low risk detected."
    }

@app.post("/predict/diabetes")
def predict_diabetes(data: DiabetesData):
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