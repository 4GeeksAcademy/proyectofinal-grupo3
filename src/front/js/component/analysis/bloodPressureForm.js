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
      const response = await fetch(process.env.BACKEND_URL + "/blood_pressure_form", { // `${process.env.BACKEND_URL}/profile` fetch(process.env.BACKEND_URL + "login",  Asegúrate de que la URL esté correcta
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
      <h1>Presión Arterial</h1>
      <div className="form-group">
        <label htmlFor="systolicPressure" className="form-label">
        Presión Sistólica (mmHg)
        </label>
        <input
          type="number" // Input type for numerical values
          className="form-control"
          id="systolicPressure"
          value={systolicPressure}
          placeholder="Sistólica"
          onChange={(e) => setSystolicPressure(e.target.value)}
          required // Mark as required
        />
      </div>
      <div className="form-group">
        <label htmlFor="diastolicPressure" className="form-label">
        Presión Diastólica (mmHg)
        </label>
        <input
          type="number"
          className="form-control"
          id="diastolicPressure"
          value={diastolicPressure}
          onChange={(e) => setDiastolicPressure(e.target.value)}
          placeholder="Distólica"
          required

        />
      </div>
      <div className="form-group">
        <label htmlFor="heartRate" className="form-label">
          Frecuencia Cardíaca (bpm)
        </label>
        <input
          type="number"
          className="form-control"
          id="heartRate"
          placeholder="Ingrese su frecuencia cardíaca"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          required
        
      />
    </div>
    <button className="btn btn-primary" type="submit">
      Enviar Resultados
    </button>

    {recommendation && (
        <div className="recommendation">
          <h2 className='mb-2'> <strong>  Recomendaciones: </strong> </h2>
          <p>  {recommendation.text}  </p>
        </div>
      )}


  </form>
  );
};

export default BloodPressureForm;

// import React, { useState } from 'react';




// import { Link } from 'react-router-dom';
// import "../../../styles/bloodPressureForm.css"

// const BloodPressureForm = () => {
//   const [systolicPressure, setSystolicPressure] = useState('');
//   const [diastolicPressure, setDiastolicPressure] = useState('');
//   const [heartRate, setHeartRate] = useState('');
//   const [recommendation, setRecommendation] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = {
//       systolic: systolicPressure,
//       diastolic: diastolicPressure,
//       heart_rate: heartRate
//     };

//     try {
//       const response = await fetch(process.env.BACKEND_URL + "/blood_pressure_form", { // `${process.env.BACKEND_URL}/profile` fetch(process.env.BACKEND_URL + "login",  Asegúrate de que la URL esté correcta
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();
//       setRecommendation(result.recommendation);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <form className="blood-pressure-form">
//       <h1>Presion arterial</h1> {/* Clearer title */}
//       <div className="form-group">
//         <label htmlFor="systolicPressure" className="form-label">
//           Presion sistolica (mmHg)
//         </label>
//         <input
//           type="number" // Input type for numerical values
//           className="form-control"
//           id="systolicPressure"
//           value={systolicPressure}
//           placeholder="Enter Systolic Pressure"
//           onChange={(e) => setSystolicPressure(e.target.value)}
//           required // Mark as required
//         />
//       </div>
//       <div className="form-group">
//         <label htmlFor="diastolicPressure" className="form-label">
//           Presion diastolica (mmHg)
//         </label>
//         <input
//           type="number"
//           className="form-control"
//           id="diastolicPressure"
//           value={diastolicPressure}
//           onChange={(e) => setDiastolicPressure(e.target.value)}
//           placeholder="Enter Diastolic Pressure"
//           required

//         />
//       </div>
//       <div className="form-group">
//         <label htmlFor="heartRate" className="form-label">
//           Frecuencia cardiaca (bpm)
//         </label>
//         <input
//           type="number"
//           className="form-control"
//           id="heartRate"
//           placeholder="Enter Heart Rate"
//           value={heartRate}
//           onChange={(e) => setHeartRate(e.target.value)}
//           required

//         />
//       </div>
//       <div className='consulta'>
//         <button className="botonConsulta btn btn-primary" type="submit">
//           Ingresar datos
//         </button>

//         {recommendation && (
//           <div className="recommendation">
//             <h2>Recommendation</h2>
//             <p>{recommendation.text}</p>
//           </div>
//         )}
//       </div>

//     </form>
//   );
// };

// export default BloodPressureForm;