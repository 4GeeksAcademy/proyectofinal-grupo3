import React from "react";
import { useParams } from "react-router-dom";
import "../../styles/RolSelector.css";
import { Link } from "react-router-dom";


export const RoleSelector = ()=> {
    const params = useParams();
    console.log(params);



    return (
        <div className='container-rol'>

            <div className='tittle'>
                Que tipo de perfil quieres registrar?
            </div>

            <div className='Roles'>

                <div className="paciente">
                <div className='button'>
                <Link to={`/paciente/${params.actionType}`}>
                <button type="button" className="doc btn btn-lg btn-light" >Paciente</button>
                </Link>
                </div>

                </div>

                <div className="doctor">
                <div className='button'>
                <Link to={`/doctors/${params.actionType}`}>
                <button type="button" className="doc btn btn-lg btn-light" >Doctor</button>
                </Link>
                </div>

                </div>
            </div>





        </div>

    )
}