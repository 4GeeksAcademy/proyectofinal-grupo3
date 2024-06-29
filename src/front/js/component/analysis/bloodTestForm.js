import React from 'react';
import { Link } from 'react-router-dom';
import "../../../styles/bloodTestForm.css"

const BloodTestForm = () => {
    return (
      <form className="bloodTestForm">
      <h1>
        Examens de sangre 
      </h1>
      <div className="form-group">
        <label htmlFor="hemoglobin">
          Hemoglobina (g/dL)
        </label>
        <input
          className="form-control"
          id="hemoglobina"
          placeholder="Ingrea tu valor de Hemoglobina"
          type="number"
        />
      </div>
      <div className="form-group">
        <label htmlFor="hematocrito">
          Hematocrito (%)
        </label>
        <input
          className="form-control"
          id="hematocrito"
          placeholder="Ingrea tu valor de Hematocrito"
          type="number"
        />
      </div>
      <div className="form-group">
        <label htmlFor="glicemia">
          Glicemia (mg/dL)
        </label>
        <input
          className="form-control"
          id="glycemia"
          placeholder="Ingresa tu valor de Glicemia"
          type="number"
        />
      </div>
      <div className="form-group">
        <label htmlFor="colesterol">
          Colesterol (mg/dL)
        </label>
        <input
          className="form-control"
          id="colesterol"
          placeholder="Ingresa tu valor de Colesterol"
          type="number"
        />
      </div>
      <div className="form-group">
        <label htmlFor="triglicedios">
          Triglicedios (mg/dL)
        </label>
        <input
          className="form-control"
          id="trigicedios"
          placeholder="Ingresa tu valor de Triglicedios"
          type="number"
        />
      </div>
      <button
        className="btn btn-primary"
        type="submit"
      >
        Enviar
      </button>
    </form>
    );
  };
  
  export default BloodTestForm;