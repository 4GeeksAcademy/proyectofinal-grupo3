import React from 'react';
import { Link } from 'react-router-dom';
import "../../../styles/bloodTestForm.css"

const BloodTestForm = () => {
    return (
      <form className="bloodTestForm">
      <h1>
        Blood Test Form
      </h1>
      <div className="form-group">
        <label htmlFor="hemoglobin">
          Hemoglobin (g/dL)
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
          Hematocrit (%)
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
          Glycemia (mg/dL)
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
          Cholesterol (mg/dL)
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
          Triglycerides (mg/dL)
        </label>
        <input
          className="form-control"
          id="triglycerides"
          placeholder="Enter Triglycerides value"
          type="number"
        />
      </div>
      <button
        className="btn btn-primary"
        type="submit"
      >
        Submit
      </button>
    </form>
    );
  };
  
  export default BloodTestForm;