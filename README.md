# 🩺 AI-Powered Clinical Decision Support System (CDSS)

![Status](https://img.shields.io/badge/Status-Active_Research-blue)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![Machine Learning](https://img.shields.io/badge/ML-Scikit--Learn-F7931E)
![XAI](https://img.shields.io/badge/XAI-SHAP-black)

## 📌 Abstract
This repository contains the architecture and implementation of a multimodal Clinical Decision Support System (CDSS). The system leverages ensemble machine learning models to assess cardiovascular and early-stage diabetic risk from patient vitals and laboratory results. 

Moving beyond traditional black-box classification, this system integrates **State-of-the-Art (SOTA) Explainable AI (XAI)** via SHAP (SHapley Additive exPlanations) to quantify feature importance, alongside **Generative AI (Google Gemini 2.5 Flash)** to automatically synthesize human-readable clinical summaries suitable for Electronic Health Record (EHR) integration.

---

## 🏗️ System Architecture

The architecture is decoupled into a high-performance mathematical backend and a reactive, tabbed frontend:

1. **Inference Engine (FastAPI):** An asynchronous Python backend handling payload validation via Pydantic, machine learning inference, SHAP value computation, and API calls to the LLM.
2. **Client Interface (React.js):** A lightweight, responsive dashboard designed for clinical environments, allowing physicians to input vitals and instantly review risk stratification and EHR notes.

---

## 🧬 Algorithmic Methodology

### 1. Cost-Sensitive Ensemble Learning
In clinical diagnostic models, the cost of a False Negative (failing to detect a diseased patient) vastly outweighs the cost of a False Positive (subjecting a healthy patient to further screening). 

To mathematically enforce this clinical priority, the Random Forest classifiers were trained using **Cost-Sensitive Learning**. By applying an asymmetric class weight penalty, the model's loss function heavily penalizes misclassifications of the minority/positive class. 

The optimization objective was strictly tied to maximizing **Recall (Sensitivity)**:

$$Recall = \frac{True \ Positives}{True \ Positives + False \ Negatives}$$

Through exhaustive `GridSearchCV` hyperparameter tuning across 5-fold cross-validation, the cardiovascular model achieved a SOTA **89% Recall** on the unseen test distribution, effectively minimizing critical diagnostic misses.

### 2. Explainable AI (SHAP)
To build physician trust and prevent automation bias, the system utilizes tree-explainer SHAP values based on cooperative game theory. It breaks down the marginal contribution of each patient vital to the final probability output.

The SHAP value for a specific feature $i$ is calculated as:

$$\phi_i(x) = \sum_{S \subseteq F \setminus \{i\}} \frac{|S|! (|F| - |S| - 1)!}{|F|!} [f_{S \cup \{i\}}(x_{S \cup \{i\}}) - f_S(x_S)]$$

*Where F is the set of all features, S is a subset of features excluding i, and f is the predictive model.*

The API returns the top localized risk drivers (e.g., High Cholesterol) and protective factors (e.g., Normal Resting BP) for individual patients.

### 3. Automated EHR Synthesis (Gemini 2.5 Flash)

Raw statistical data and SHAP values are securely formatted into a zero-shot prompt and passed to the Google `gemini-2.5-flash` model. The LLM acts as an automated medical scribe, synthesizing the raw probabilities and risk vectors into a concise, professional 2-sentence clinical note ready for EHR copy-pasting.
---

## 📊 Datasets
* **Cardiovascular Model:** Trained on the *Cleveland Heart Disease Dataset* (UCI Machine Learning Repository). Features include age, resting blood pressure, cholesterol, resting ECG, and thallium stress test results.
* **Diabetes Model:** Trained on the *Early Stage Diabetes Risk Prediction Dataset*. Features include polyuria, polydipsia, sudden weight loss, and other early-onset clinical indicators.

---

## 🚀 Local Installation & Reproducibility

### Prerequisites
* Python 3.9+
* Node.js & npm
* Google AI Studio API Key (for LLM generation)

### Backend Setup
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn main:app --reload

### Frontend Setup
    cd frontend
    npm install
    npm run dev

---

## ⚖️ Clinical Disclaimer
**For Educational and Research Purposes Only.** This software is a prototype machine learning model and is not FDA-approved or CE-marked for medical use. It must not be used to diagnose, treat, or make definitive medical decisions. Always consult a qualified, licensed healthcare professional.
