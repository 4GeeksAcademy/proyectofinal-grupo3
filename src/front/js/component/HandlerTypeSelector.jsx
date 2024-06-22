import React from "react";
import { useParams } from "react-router-dom";
import {FormSignUp} from "./FormSignUp";
import {FormLogIn} from "./FormLogIn"; 

export const HandlerTypeSelector = () => {
  const params = useParams(); 
  console.log (params)

  return (
    <>
      
      {params.type == "signup" ? ( 
        <FormSignUp role={params.role} />
      ) : (
        <FormLogIn role={params.role} /> 
      )}
    </>
  );
};
