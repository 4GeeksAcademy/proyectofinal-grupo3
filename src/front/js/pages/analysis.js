import React from 'react';
import BloodPressureForm from '../component/analysis/bloodPressureForm';
import BloodTestForm from '../component/analysis/bloodTestForm';

const Analysis = () => {
  return (
    <div>
      
      <BloodPressureForm />
      
      <BloodTestForm />
    </div>
  );
};

export default Analysis;