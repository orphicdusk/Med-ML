from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import shap
from google import genai # <--- NEW 2026 IMPORT SYNTAX

# ==========================================
# SOTA UPGRADE: CONFIGURE GEMINI LLM
# ==========================================
# Remember: Delete this key from Google AI Studio after your project is done!
GEMINI_API_KEY = "AIzaSyAD0vhLVPvikGQ8fFf8pnSL7El6PMpxFHM" 
client = genai.Client(api_key=GEMINI_API_KEY) # <--- NEW CLIENT INITIALIZATION

# Initialize FastAPI App
app = FastAPI(title="SOTA Clinical Decision Support System", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Load Models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
try:
    heart_model = joblib.load(os.path.join(BASE_DIR, "models/heart_model.joblib"))
    diabetes_model = joblib.load(os.path.join(BASE_DIR, "models/diabetes_model.joblib"))
    
    # Initialize SHAP Explainer for the Heart Model
    heart_explainer = shap.TreeExplainer(heart_model)
except Exception as e:
    print(f"Error loading models or explainers: {e}")

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
    return {"message": "SOTA API is Live! Ready for predictions."}

@app.post("/predict/heart")
def predict_heart(data: HeartData):
    df = pd.DataFrame([data.dict()])
    
    # 1. Base Prediction
    prediction = int(heart_model.predict(df)[0])
    probability = float(heart_model.predict_proba(df)[0][1])
    risk_percentage = round(probability * 100, 2)
    
    # 2. SHAP Explainability 
    shap_values = heart_explainer.shap_values(df)
    
    if isinstance(shap_values, list):
        instance_shap = shap_values[1][0] 
    else:
        if len(shap_values.shape) == 3:
            instance_shap = shap_values[0, :, 1]
        else:
            instance_shap = shap_values[0]

    feature_names = df.columns
    impacts = []
    for i, val in enumerate(instance_shap):
        impacts.append({
            "feature": feature_names[i], 
            "impact_score": round(float(val), 3), 
            "value": float(df.iloc[0, i])
        })

    impacts.sort(key=lambda x: x['impact_score'], reverse=True)
    top_risk_factors = [f for f in impacts if f['impact_score'] > 0][:3]
    protective_factors = [f for f in impacts if f['impact_score'] < 0][-3:]

    # 3. LLM Clinical Reporting (Using the new GenAI SDK syntax)
    prompt = f"""
    You are an expert AI cardiology assistant. Analyze this patient data:
    Risk Probability: {risk_percentage}%
    Top risk drivers: {top_risk_factors}
    Protective factors: {protective_factors}
    
    Write a fast, professional 2-sentence clinical summary of this cardiovascular risk profile for an EHR system. No markdown.
    """
    
    try:
        # NEW 2026 GENERATION SYNTAX
        llm_response = client.models.generate_content(
            model='gemini-2.5-flash', 
            contents=prompt
        )
        clinical_summary = llm_response.text.strip()
    except Exception as e:
        print(f"Gemini API Error: {e}")
        clinical_summary = "AI Reporting unavailable. Please review risk factors manually."

    return {
        "disease_detected": bool(prediction),
        "risk_probability": risk_percentage,
        "warning": "High risk detected." if prediction else "Low risk detected.",
        "top_risk_factors": top_risk_factors,
        "protective_factors": protective_factors,
        "clinical_summary": clinical_summary
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
    