import React from 'react';
import BloodPressureForm from '../component/analysis/bloodPressureForm';
import BloodTestForm from '../component/analysis/bloodTestForm';

const Analysis = () => {
  return (
    <div>
      
      <BloodPressureForm />
      <p> Luego de completar los datos de tu perfil, Introduce los resultados de tu presión arterial y en base a eso obten un diagnostigo de referencia y recomendaciones sobre que tipo de especialista debes visitar, </p>
      <BloodTestForm />
    </div>
  );
};

export default Analysis;