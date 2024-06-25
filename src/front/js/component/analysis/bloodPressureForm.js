import React from 'react';
import { Link } from 'react-router-dom';
import "../../../styles/bloodPressureForm.css"

const BloodPressureForm = () => {
  return (
    <form className="blood-pressure-form">
    <h1>Blood Pressure Measurement</h1> {/* Clearer title */}
    <div className="form-group">
      <label htmlFor="systolicPressure" className="form-label">
        Systolic Pressure (mmHg)
      </label>
      <input
        type="number" // Input type for numerical values
        className="form-control"
        id="systolicPressure"
        placeholder="Enter Systolic Pressure"
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
        required
      />
    </div>
    <button className="btn btn-primary" type="submit">
      Submit Reading
    </button>
  </form>
  );
};

export default BloodPressureForm;