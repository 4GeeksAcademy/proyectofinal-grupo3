import React from 'react';
import "../../styles/RolSelector.css";




const RolSelector = () => {
    return (

        <div className='container-rol'>

            <div className='tittle'>
                Que tipo de perfil quieres registrar?
            </div>

            <div className='Roles'>

                <div className="paciente">
                <div className='button'>
                <button type="button-doctor" class="doc btn btn-lg btn-light" onClick= "https://potential-space-engine-r446j4rj4j643xr7g-3000.app.github.dev/SignUp">Paciente</button>
                </div>

                </div>

                <div className='doctor'>
                <div class="d-grid gap-2 col-6 mx-auto">
  <button class="doc btn btn-light mb-10" type="button" id='botonDoc'>Doctor</button>
  
</div>
                </div>
            </div>





        </div>

    )
}



export default RolSelector