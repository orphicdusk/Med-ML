import { useState } from 'react';
import axios from 'axios';
import './App.css';

// REPLACE THIS STRING WITH YOUR CODESPACE PORT 8000 URL
const API_URL = "https://literate-meme-7v46pjxpwv4w3p69-8000.app.github.dev"; 

function App() {
  const [activeTab, setActiveTab] = useState('heart');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Heart Disease Form State
  const [heartData, setHeartData] = useState({
    age: 63, sex: 1, cp: 3, trestbps: 145, chol: 233, 
    fbs: 1, restecg: 0, thalach: 150, exang: 0, 
    oldpeak: 2.3, slope: 0, ca: 0, thal: 1
  });

  // Diabetes Form State
  const [diabetesData, setDiabetesData] = useState({
    Age: 30, Gender: 1, Polyuria: 1, Polydipsia: 1, sudden_weight_loss: 1,
    weakness: 1, Polyphagia: 1, Genital_thrush: 0, visual_blurring: 0, 
    Itching: 0, Irritability: 0, delayed_healing: 0, partial_paresis: 0, 
    muscle_stiffness: 0, Alopecia: 0, Obesity: 1
  });

  const handleHeartInputChange = (e) => {
    const { name, value } = e.target;
    setHeartData({ ...heartData, [name]: isNaN(value) ? value : Number(value) });
  };

  const handleDiabetesInputChange = (e) => {
    const { name, value } = e.target;
    setDiabetesData({ ...diabetesData, [name]: isNaN(value) ? value : Number(value) });
  };

  const runHeartPrediction = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/predict/heart`, heartData);
      setResult({ ...response.data, type: 'heart' });
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to connect to the backend. Check the console and ensure your API_URL is correct.");
    }
    setLoading(false);
  };

  const runDiabetesPrediction = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/predict/diabetes`, diabetesData);
      setResult({ ...response.data, type: 'diabetes' });
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to connect to the backend. Check the console and ensure your API_URL is correct.");
    }
    setLoading(false);
  };

  const resetResults = () => {
    setResult(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="header-title">Clinical Decision Support System</h1>
          <p className="header-subtitle">AI-Powered Medical Diagnosis Assistant</p>
        </div>
      </header>

      <main className="app-main">
        {/* Tab Navigation */}
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'heart' ? 'active' : ''}`}
            onClick={() => { setActiveTab('heart'); resetResults(); }}
          >
            <span className="tab-icon">♥</span> Heart Disease
          </button>
          <button 
            className={`tab-button ${activeTab === 'diabetes' ? 'active' : ''}`}
            onClick={() => { setActiveTab('diabetes'); resetResults(); }}
          >
            <span className="tab-icon">🔬</span> Diabetes
          </button>
        </div>

        {/* Content Area */}
        <div className="content-wrapper">
          {/* Heart Disease Tab */}
          {activeTab === 'heart' && (
            <div className="tab-content active">
              <div className="form-section">
                <h2 className="section-title">Heart Disease Risk Assessment</h2>
                <p className="section-subtitle">Enter patient vitals and laboratory values</p>
                
                <form className="form-grid">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="age">Age (years)</label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={heartData.age}
                        onChange={handleHeartInputChange}
                        min="0"
                        max="120"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="sex">Sex</label>
                      <select id="sex" name="sex" value={heartData.sex} onChange={handleHeartInputChange}>
                        <option value={1}>Male</option>
                        <option value={0}>Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="cp">Chest Pain Type (0-3)</label>
                      <select id="cp" name="cp" value={heartData.cp} onChange={handleHeartInputChange}>
                        <option value={0}>Typical Angina</option>
                        <option value={1}>Atypical Angina</option>
                        <option value={2}>Non-anginal Pain</option>
                        <option value={3}>Asymptomatic</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="trestbps">Resting BP (mmHg)</label>
                      <input
                        type="number"
                        id="trestbps"
                        name="trestbps"
                        value={heartData.trestbps}
                        onChange={handleHeartInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="chol">Cholesterol (mg/dl)</label>
                      <input
                        type="number"
                        id="chol"
                        name="chol"
                        value={heartData.chol}
                        onChange={handleHeartInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="thalach">Max Heart Rate Achieved</label>
                      <input
                        type="number"
                        id="thalach"
                        name="thalach"
                        value={heartData.thalach}
                        onChange={handleHeartInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fbs">Fasting Blood Sugar &gt; 120</label>
                      <select id="fbs" name="fbs" value={heartData.fbs} onChange={handleHeartInputChange}>
                        <option value={0}>No</option>
                        <option value={1}>Yes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="restecg">Resting ECG (0-2)</label>
                      <input
                        type="number"
                        id="restecg"
                        name="restecg"
                        value={heartData.restecg}
                        onChange={handleHeartInputChange}
                        min="0"
                        max="2"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="exang">Exercise Induced Angina</label>
                      <select id="exang" name="exang" value={heartData.exang} onChange={handleHeartInputChange}>
                        <option value={0}>No</option>
                        <option value={1}>Yes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="oldpeak">ST Depression (oldpeak)</label>
                      <input
                        type="number"
                        id="oldpeak"
                        name="oldpeak"
                        value={heartData.oldpeak}
                        onChange={handleHeartInputChange}
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="slope">ST Slope (0-2)</label>
                      <input
                        type="number"
                        id="slope"
                        name="slope"
                        value={heartData.slope}
                        onChange={handleHeartInputChange}
                        min="0"
                        max="2"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ca">Major Vessels (0-3)</label>
                      <input
                        type="number"
                        id="ca"
                        name="ca"
                        value={heartData.ca}
                        onChange={handleHeartInputChange}
                        min="0"
                        max="3"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group full-width">
                      <label htmlFor="thal">Thalassemia (0-3)</label>
                      <select id="thal" name="thal" value={heartData.thal} onChange={handleHeartInputChange}>
                        <option value={0}>Normal</option>
                        <option value={1}>Fixed Defect</option>
                        <option value={2}>Reversible Defect</option>
                        <option value={3}>Severe</option>
                      </select>
                    </div>
                  </div>
                </form>

                <button 
                  className="btn-primary"
                  onClick={runHeartPrediction} 
                  disabled={loading}
                  style={{ marginTop: '20px', width: '100%', padding: '14px', fontSize: '16px' }}
                >
                  {loading ? "Analyzing SOTA Insights..." : "Run Assessment"}
                </button>
              </div>

              {/* Results Section */}
              <div className="result-section">
                <h2 className="section-title">Assessment Results</h2>
                {!result || result.type !== 'heart' ? (
                  <div className="empty-state">
                    <p className="empty-icon">🏥</p>
                    <p className="empty-text">Fill in the patient data and click "Run Assessment" to see results</p>
                  </div>
                ) : (
                  <div className={`result-card ${result.disease_detected ? 'risk-high' : 'risk-low'}`}>
                    <div className="result-badge">
                      {result.disease_detected ? '⚠️ HIGH RISK' : '✓ LOW RISK'}
                    </div>
                    <h3 className="result-title">
                      {result.disease_detected ? "Heart Disease Risk Detected" : "No Significant Risk Detected"}
                    </h3>
                    <div className="result-details">
                      <div className="detail-item" style={{ marginBottom: '10px' }}>
                        <span className="detail-label">Risk Probability:</span>
                        <span className="detail-value">{result.risk_probability}%</span>
                      </div>
                      
                      {/* SOTA UPGRADE: SHAP Explainability */}
                      {result.top_risk_factors && (
                        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', border: '1px solid #ddd' }}>
                          <h4 style={{ margin: '0 0 10px 0', color: '#455a64' }}>Model Explainability (SHAP Factors)</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                              <strong style={{ color: '#d32f2f', fontSize: '13px' }}>↑ Top Risk Drivers</strong>
                              <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: '#333' }}>
                                {result.top_risk_factors.map((factor, i) => (
                                  <li key={i}>{factor.feature.toUpperCase()} (Value: {factor.value})</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <strong style={{ color: '#388e3c', fontSize: '13px' }}>↓ Top Protective Factors</strong>
                              <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: '#333' }}>
                                {result.protective_factors.map((factor, i) => (
                                  <li key={i}>{factor.feature.toUpperCase()} (Value: {factor.value})</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SOTA UPGRADE: Gemini EHR Note */}
                      {result.clinical_summary && (
                        <div style={{ marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                          <h4 style={{ margin: '0 0 8px 0', color: '#2980b9', fontSize: '14px' }}>Automated EHR Clinical Note</h4>
                          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#34495e', fontStyle: 'italic' }}>
                            "{result.clinical_summary}"
                          </p>
                        </div>
                      )}
                      
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Diabetes Tab */}
          {activeTab === 'diabetes' && (
            <div className="tab-content active">
              <div className="form-section">
                <h2 className="section-title">Diabetes Risk Assessment</h2>
                <p className="section-subtitle">Enter patient symptoms and health indicators</p>
                
                <form className="form-grid">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="age_d">Age (years)</label>
                      <input
                        type="number"
                        id="age_d"
                        name="Age"
                        value={diabetesData.Age}
                        onChange={handleDiabetesInputChange}
                        min="0"
                        max="120"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="gender_d">Gender</label>
                      <select id="gender_d" name="Gender" value={diabetesData.Gender} onChange={handleDiabetesInputChange}>
                        <option value={1}>Male</option>
                        <option value={0}>Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-label-row" style={{ marginTop: '15px', fontWeight: 'bold', color: '#555' }}>Symptoms (Yes = 1, No = 0)</div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="polyuria">Polyuria</label>
                      <select id="polyuria" name="Polyuria" value={diabetesData.Polyuria} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="polydipsia">Polydipsia</label>
                      <select id="polydipsia" name="Polydipsia" value={diabetesData.Polydipsia} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="sudden_weight_loss">Sudden Weight Loss</label>
                      <select id="sudden_weight_loss" name="sudden_weight_loss" value={diabetesData.sudden_weight_loss} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="weakness">Weakness</label>
                      <select id="weakness" name="weakness" value={diabetesData.weakness} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="polyphagia">Polyphagia (Excessive Eating)</label>
                      <select id="polyphagia" name="Polyphagia" value={diabetesData.Polyphagia} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="genital_thrush">Genital Thrush</label>
                      <select id="genital_thrush" name="Genital_thrush" value={diabetesData.Genital_thrush} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="visual_blurring">Visual Blurring</label>
                      <select id="visual_blurring" name="visual_blurring" value={diabetesData.visual_blurring} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="itching">Itching</label>
                      <select id="itching" name="Itching" value={diabetesData.Itching} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="irritability">Irritability</label>
                      <select id="irritability" name="Irritability" value={diabetesData.Irritability} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="delayed_healing">Delayed Healing</label>
                      <select id="delayed_healing" name="delayed_healing" value={diabetesData.delayed_healing} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="partial_paresis">Partial Paresis</label>
                      <select id="partial_paresis" name="partial_paresis" value={diabetesData.partial_paresis} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="muscle_stiffness">Muscle Stiffness</label>
                      <select id="muscle_stiffness" name="muscle_stiffness" value={diabetesData.muscle_stiffness} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="alopecia">Alopecia (Hair Loss)</label>
                      <select id="alopecia" name="Alopecia" value={diabetesData.Alopecia} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="obesity">Obesity</label>
                      <select id="obesity" name="Obesity" value={diabetesData.Obesity} onChange={handleDiabetesInputChange}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                  </div>
                </form>

                <button 
                  className="btn-primary"
                  onClick={runDiabetesPrediction} 
                  disabled={loading}
                  style={{ marginTop: '20px', width: '100%', padding: '14px', fontSize: '16px' }}
                >
                  {loading ? "Analyzing..." : "Run Assessment"}
                </button>
              </div>

              {/* Results Section */}
              <div className="result-section">
                <h2 className="section-title">Assessment Results</h2>
                {!result || result.type !== 'diabetes' ? (
                  <div className="empty-state">
                    <p className="empty-icon">🧬</p>
                    <p className="empty-text">Fill in the patient data and click "Run Assessment" to see results</p>
                  </div>
                ) : (
                  <div className={`result-card ${result.disease_detected ? 'risk-high' : 'risk-low'}`}>
                    <div className="result-badge">
                      {result.disease_detected ? '⚠️ HIGH RISK' : '✓ LOW RISK'}
                    </div>
                    <h3 className="result-title">
                      {result.disease_detected ? "Diabetes Risk Detected" : "No Significant Risk Detected"}
                    </h3>
                    <div className="result-details">
                      <div className="detail-item">
                        <span className="detail-label">Risk Probability:</span>
                        <span className="detail-value">{result.risk_probability}%</span>
                      </div>
                      <div className="detail-item" style={{ marginTop: '10px' }}>
                        <span className="detail-label">Recommendation:</span>
                        <span className="detail-text">{result.warning}</span>
                      </div>
                      
                      {/* Note: If you ever add SHAP/Gemini to the diabetes backend endpoint, 
                          you can copy-paste the exact same conditional rendering blocks here! */}

                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Clinical Decision Support System | AI-Powered Medical Diagnosis</p>
        <p>⚠️ For educational purposes only. Always consult with a qualified healthcare professional.</p>
      </footer>
    </div>
  );
}

export default App;