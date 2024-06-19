import React from "react";
import "../../styles/benefitsOverview.css"; 

export const BenefitsOverview = () => {
    return (
        <div className="row row-cols-1 row-cols-md-4 g-3 px-5">
            <div className="col">
                <div className="card">
                <div className="card-header">
                <i className="fa-solid fa-user-doctor" />
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Encuentra tu 
                        especialista</h5>
                        <p className="card-text">Las opiniones reales de miles de pacientes te ayudarán a tomar siempre la mejor decisión.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card">
                <div className="card-header">
                <i className="fa-solid fa-hospital" />
                </div>
                    <div className="card-body">
                        <h5 className="card-title">Pide cita de 
                        forma fácil</h5>
                        <p className="card-text">Elige la hora que prefieras y pide cita sin necesidad de llamar. Es fácil, cómodo y muy rápido.</p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card">
                <div className="card-header">
                <i className="fa-solid fa-file-waveform" />
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Analiza tus exámenes  de lab</h5>
                        <p className="card-text">podemos ayudarte a interpretar tu presion arterial y tus examenes de sangre</p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card">
                <div className="card-header">
                <i className="fa-solid fa-comment-sms" />
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Recordatorios por SMS</h5>
                        <p className="card-text">Te confirmamos la cita al instante y te enviamos un recordatorio a tu celular antes de la cita.</p> 
                    </div>
                </div>
            </div>
        </div>
    );
}; 