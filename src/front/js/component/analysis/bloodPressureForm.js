import React from 'react';
import { Link } from 'react-router-dom';
import "../../../styles/bloodPressureForm.css"

const BloodPressureForm = () => {
  return (
    <form className="blood-pressure-form">
    <h1>Presion arterial</h1> {/* Clearer title */}
    <div className="form-group">
      <label htmlFor="systolicPressure" className="form-label">
        Presion sistolica (mmHg)
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
        Presion diastolica (mmHg)
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
        Frecuencia cardiaca (bpm)
      </label>
      <input
        type="number"
        className="form-control"
        id="heartRate"
        placeholder="Enter Heart Rate"
        required
      />
    </div>
    <div className='consulta'>
    <button className="botonConsulta btn btn-primary" type="submit">
      Ingresar datos
    </button>
    </div>
  </form>
  );
};

export default BloodPressureForm;