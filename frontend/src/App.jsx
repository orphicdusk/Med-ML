import { useState } from 'react';
import axios from 'axios';

// REPLACE THIS STRING WITH YOUR CODESPACE PORT 8000 URL
const API_URL = "https://literate-meme-7v46pjxpwv4w3p69-8000.app.github.dev"; 

function App() {
  const [heartData, setHeartData] = useState({
    age: 63, sex: 1, cp: 3, trestbps: 145, chol: 233, 
    fbs: 1, restecg: 0, thalach: 150, exang: 0, 
    oldpeak: 2.3, slope: 0, ca: 0, thal: 1
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setHeartData({ ...heartData, [e.target.name]: Number(e.target.value) });
  };

  const runPrediction = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/predict/heart`, heartData);
      setResult(response.data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to connect to the backend. Check the console and ensure your API_URL is correct.");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Clinical Decision Support System</h1>
        <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>AI-Powered Cardiology Assessment</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* INPUT FORM */}
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          <h3>Patient Vitals & Labs</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            
            <label>Age: <br/><input type="number" name="age" value={heartData.age} onChange={handleInputChange} style={{width: '100%', padding: '5px'}} /></label>
            <label>Sex (1=M, 0=F): <br/><input type="number" name="sex" value={heartData.sex} onChange={handleInputChange} style={{width: '100%', padding: '5px'}} /></label>
            <label>Chest Pain (0-3): <br/><input type="number" name="cp" value={heartData.cp} onChange={handleInputChange} style={{width: '100%', padding: '5px'}} /></label>
            <label>Resting BP: <br/><input type="number" name="trestbps" value={heartData.trestbps} onChange={handleInputChange} style={{width: '100%', padding: '5px'}} /></label>
            <label>Cholesterol: <br/><input type="number" name="chol" value={heartData.chol} onChange={handleInputChange} style={{width: '100%', padding: '5px'}} /></label>
            <label>Max Heart Rate: <br/><input type="number" name="thalach" value={heartData.thalach} onChange={handleInputChange} style={{width: '100%', padding: '5px'}} /></label>
            
          </div>
          <button 
            onClick={runPrediction} 
            disabled={loading}
            style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
            {loading ? "Analyzing..." : "Run Assessment"}
          </button>
        </div>

        {/* RESULTS PANEL */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: '#fff' }}>
          <h3>Diagnostic Output</h3>
          {!result ? (
            <p style={{ color: '#95a5a6' }}>Awaiting patient data...</p>
          ) : (
            <div>
              <div style={{ 
                padding: '15px', 
                borderRadius: '6px', 
                background: result.disease_detected ? '#ffebee' : '#e8f5e9',
                borderLeft: `5px solid ${result.disease_detected ? '#f44336' : '#4caf50'}`
              }}>
                <h2 style={{ margin: '0 0 10px 0', color: result.disease_detected ? '#c62828' : '#2e7d32' }}>
                  {result.disease_detected ? "High Risk" : "Low Risk"}
                </h2>
                <p style={{ margin: 0, fontSize: '18px' }}><strong>Probability:</strong> {result.risk_probability}%</p>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>{result.warning}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;