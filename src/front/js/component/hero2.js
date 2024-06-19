import React from "react";
import "../../styles/hero2.css"


export const HeroSection_2 = () => {
    return (
        <section className="bsb-hero-2 px-3  mb-5  mt-5">
            <div className="MedicalDirectory">
            <h3 className="display-6 fw-bold mb-3" >Directorio médico y agenda medica en un solo lugar. </h3>
            <p className="fs6 mb-5">
                Accede a un directorio médico completo y actualizado donde puedes encontrar al especialista que necesitas en cuestión de segundos. Organiza tu salud con eficiencia gracias a nuestro sistema de recordatorios y seguimiento.
            </p>
            </div>
            <div className="d-grid gap-2 d-sm-flex">
                            <button type="button" className="btn-hero-2 btn btn-primary bsb-btn-xl rounded-pill">
                                Agenda tu cita
                            </button>
                        </div>
            <div className="container-text-2 container overflow-hidden">
                <div className="row gy-3 gy-lg-0 align-items-lg-center justify-content-lg-between">
                    <div className="container-img-2 col-12 col-lg-5 text-center">
                        <img 
                            className=" img-fluid"
                            loading="lazy"
                            src="https://cdn.pixabay.com/photo/2022/01/15/13/21/digitization-6939537_1280.jpg"
                            alt="Art of Design"
                        />
                    </div>
                    <div className="container-list-group col-12 col-lg-6 order-1 order-lg-0">
                        <ul className="list-group list-group-flush">
                            <li className="list-group">
                            
                                <h4><i class="fa-solid fa-user"/> Crea tu Perfil </h4>
                                <p> Regístrate y completa tu historial médico de forma segura. Configurar su perfil de esta manera garantizará que se mantenga actualizado con sus procesos médicos. </p>
                            </li>
                            <li className="list-group">
                            
                                <h4><i className="fa-solid fa-droplet" /> Interpreta examen de sangre</h4>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group">Analice sus resultados de laboratorio en línea.</li>
                                    <li className="list-group">Encontrar al especialista adecuado.</li>
                                    <li className="list-group">Agendar citas con facilidad.</li>
                                </ul>
                            </li>
                            <li className="list-group">
                                <h4> <i className="fa-solid fa-user-doctor" /> Conoce a tu Dr.</h4>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group">Encontrar al especialista adecuado.</li>
                                    <li className="list-group">Agendar citas con facilidad.</li>
                                    <li className="list-group">Recibir recordatorios de citas.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
        </section>
    );
}