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
  
  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      // Asegúrate de que la URL esté correcta y accesible
      const response = await fetch('https://organic-robot-5gqxrr6vxq4qc4qgp-3001.app.github.dev/evaluate_blood_test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }
      // Parsear la respuesta como JSON
      const result = await response.json();
      setRecommendations(result.recommendations);

        // Aquí se puede manejar la respuesta, por ejemplo, mostrar recomendaciones
        console.log(result.recommendations);
      
      
    } catch (error) {
      // Manejar errores de red u otros errores
      console.error('Error al enviar el formulario', error);
      
    }
  };
  
  return (
    <form className="bloodTestForm" onSubmit={handleSubmit}>
      <h1>
        Examens de sangre
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
          onChange={(e) => setFormData({ ...formData, hemoglobina: e.target.value })}
          required
          type="number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="hematocrito">Hematocrito (%)</label>
        <input
          type="number"
          className="form-control"
          id="hematocrito"
          placeholder="Ingresa tu valor de Hematocrito"
          value={formData.hematocrito}
          onChange={(e) => setFormData({ ...formData, hematocrito: e.target.value })}
          required
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
          onChange={(e) => setFormData({ ...formData, glicemia: e.target.value })}
          required
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
          onChange={(e) => setFormData({ ...formData, colesterol: e.target.value })}
          required
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
          value={formData.trigliceridos}
          onChange={(e) => setFormData({ ...formData, trigliceridos: e.target.value })}
          required
          type="number"
        />
      </div>
      <button
        className="btn btn-primary"
        type="submit"
      >
        Enviar
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
