import React from 'react';
import { Link } from 'react-router-dom';
import "../../../styles/bloodTestForm.css"

const BloodTestForm = () => {
    return (
      <form className="bloodTestForm">
      <h1>
      Análisis de Sangre
      </h1>
      <div className="form-group">
        <label htmlFor="hemoglobin">
          Hemoglobina (g/dL)
        </label>
        <input
          className="form-control"
          id="hemoglobin"
          placeholder="Enter Hemoglobin value"
          type="number"
        />
      </div>
      <div className="form-group">
        <label htmlFor="hematocrit">
          Hematocrito (%)
        </label>
        <input
          className="form-control"
          id="hematocrit"
          placeholder="Enter Hematocrit value"
          type="number"
        />
      </div>
      <div className="form-group">
        <label htmlFor="glycemia">
          Glicemia (mg/dL)
        </label>
        <input
          className="form-control"
          id="glycemia"
          placeholder="Enter Glycemia value"
          type="number"
        />
      </div>
      <div className="form-group">
        <label htmlFor="cholesterol">
          Colesterol (mg/dL)
        </label>
        <input
          className="form-control"
          id="cholesterol"
          placeholder="Enter Cholesterol value"
          type="number"
        />
      </div>
      <div className="form-group">
        <label htmlFor="triglycerides">
          Trigliceridos (mg/dL)
        </label>
        <input
          className="form-control"
          id="triglycerides"
          placeholder="Enter Triglycerides value"
          type="number"
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
  
  export default BloodTestForm;