import React from "react";
import "../../styles/benefitsOverview.css";

export const BenefitsOverview = () => {
    return (
        <div className="row row-cols-1 row-cols-md-4 g-3 px-5">
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <i className="card-body-icono fa-solid fa-user-doctor" />
                        <h5 className="card-title card-body-title">Encuentra tu
                            especialista</h5>
                        <p className="card-text">Las opiniones reales de miles de pacientes te ayudarán a tomar siempre la mejor decisión.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <i className="card-body-icono fa-solid fa-hospital" />
                        <h5 className="card-title card-body-title">Pide cita de
                            forma fácil</h5>
                        <p className="card-text">Elige la hora que prefieras y pide cita sin necesidad de llamar. Es fácil, cómodo y muy rápido.</p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <i className="fa-solid card-body-icono fa-file-waveform" />
                        <h5 className="card-title card-body-title">Analiza tus exámenes  de lab</h5>
                        <p className="card-text">podemos ayudarte a interpretar tu presion arterial y tus examenes de sangre</p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card">
               
                    <div className="card-body">
     <i className="fa-solid card-body-icono fa-comment-sms" />                        
                        <h5 className="card-title card-body-title">Recordatorios por SMS</h5>
                        <p className="card-text">Te confirmamos la cita al instante y te enviamos un recordatorio a tu celular antes de la cita.</p>
                    </div>
                </div>
            </div>
        </div >
    );
}; 