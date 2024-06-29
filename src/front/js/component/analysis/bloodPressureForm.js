import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../../styles/bloodPressureForm.css"

const BloodPressureForm = () => {
  const [systolicPressure, setSystolicPressure] = useState('');
  const [diastolicPressure, setDiastolicPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [recommendation, setRecommendation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      systolic: systolicPressure,
      diastolic: diastolicPressure,
      heart_rate: heartRate
    };

    try {
      const response = await fetch(`https://didactic-eureka-g4q7rr9x7xrxhv6g9-3001.app.github.dev/blood_pressure_form`, { // `${process.env.BACKEND_URL}/profile` fetch(process.env.BACKEND_URL + "login",  Asegúrate de que la URL esté correcta
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setRecommendation(result.recommendation);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="blood-pressure-form" onSubmit={handleSubmit}>
    <h1>Blood Pressure Measurement</h1> {/* Clearer title */}
    <div className="form-group">
      <label htmlFor="systolicPressure" className="form-label">
        Systolic Pressure (mmHg)
      </label>
      <input
        type="number" // Input type for numerical values
        className="form-control"
        id="systolicPressure"
        value={systolicPressure}
        placeholder="Enter Systolic Pressure"
        onChange={(e) => setSystolicPressure(e.target.value)}
        required // Mark as required
      />
    </div>
    <div className="form-group">
      <label htmlFor="diastolicPressure" className="form-label">
        Diastolic Pressure (mmHg)
      </label>
      <input
        type="number"
        className="form-control"
        id="diastolicPressure"
        value={diastolicPressure}
        onChange={(e) => setDiastolicPressure(e.target.value)}
        placeholder="Enter Diastolic Pressure"
        required
        
      />
    </div>
    <div className="form-group">
      <label htmlFor="heartRate" className="form-label">
        Heart Rate (bpm)
      </label>
      <input
        type="number"
        className="form-control"
        id="heartRate"
        placeholder="Enter Heart Rate"
        value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          required
        
      />
    </div>
    <button className="btn btn-primary" type="submit">
      Submit Reading
    </button>

    {recommendation && (
        <div className="recommendation">
          <h2>Recommendation</h2>
          <p>{recommendation.text}</p>
        </div>
      )}


  </form>
  );
};

export default BloodPressureForm;