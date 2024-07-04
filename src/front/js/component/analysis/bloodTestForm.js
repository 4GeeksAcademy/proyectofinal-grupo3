import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../../styles/bloodTestForm.css"

const BloodTestForm = () => {
  // Estado para almacenar los valores del formulario
  const [formData, setFormData] = useState({
    hemoglobina: '',
    hematocrito: '',
    glicemia: '',
    colesterol: '',
    trigliceridos: ''
  });

  const [recommendations, setRecommendations] = useState(null);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: parseFloat(e.target.value)
    });
  };
  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      // Asegúrate de que la URL esté correcta y accesible
      const response = await fetch(process.env.BACKEND_URL + "/evaluate_blood_test", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(formData)
      });
      console.log('Fetch response status:', response.status);
      console.log('Fetch response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }
      // Parsear la respuesta como JSON
      const result = await response.json();
      setRecommendations(result.recommendations);
      

        // Aquí se puede manejar la respuesta, por ejemplo, mostrar recomendaciones
        console.log('Recommendation', result.recommendations);
      } catch (error) {
      // Manejar errores de red u otros errores
      console.error('Error al enviar el formulario', error);
      
    }
  };
  
  return (
    <form className="bloodTestForm" onSubmit={handleSubmit}>
      <h1 >
        Exámenes de Sangre
      </h1>
      <div className="form-group">
        <label htmlFor="hemoglobina">
          Hemoglobina (g/dL)
        </label >
        <input
          className="form-control"
          id="hemoglobina"
          placeholder="Ingrea tu valor de Hemoglobina"
          value={formData.hemoglobina}
          onChange={handleChange}
          required
          type="number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="hematocrito">Hematócrito (%)</label>
        <input
          type="number"
          className="form-control"
          id="hematocrito"
          placeholder="Ingresa tu valor de Hematócrito"
          value={formData.hematocrito}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="glicemia">
          Glicemia (g/dL)
        </label>
        <input
          className="form-control"
          id="glicemia"
          placeholder="Ingrea tu valor de Glicemia"
          value={formData.glicemia}
          onChange={handleChange}
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
          value={formData.colesterol}
          onChange={handleChange}
        />
      </div>
      
      
      <div className="form-group">
        <label htmlFor="trigliceridos">
          Triglicéridos (g/dL)
        </label>
        <input
          className="form-control"
          id="trigliceridos"
          placeholder="Ingrea tu valor de Triglicéridos"
          type="number"
          value={formData.trigliceridos}
          onChange={handleChange} 
          
        />
      </div>
      <button
        className="btn btn-primary mb-3"
        type="submit"
      >
        Enviar Resultados
      </button>

      {recommendations && (
        <div className="recommendations">
          <h2>Recomendaciones</h2>
          {recommendations.map((rec, index) => (
            <div key={index}>
              <p><strong>{rec.name}</strong>: {rec.text}</p>
              <p>Especialista: {rec.specialist}</p>
            </div>
          ))}
        </div>
      )}


    </form>


  );
};

export default BloodTestForm;
