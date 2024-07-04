import React from "react";
import { Link } from "react-router-dom";
import "../../styles/hero2.css"


export const HeroSection_2 = () => {
    return (
        <section className="HeroSection-2 bsb-hero-2 px-3  mb-5  mt-5">
            <div className="MedicalDirectory">
                <h3 className="display-6 fw-bold mb-3" >Directorio médico y agenda médica en
                    <br />
                    <span>un solo lugar.</span> </h3>
                <p className="fs6 mb-5">
                    Accede a un directorio médico completo y actualizado donde puedes encontrar al especialista que necesitas en cuestión de segundos. Organiza tu salud con eficiencia gracias a nuestro sistema de recordatorios y seguimiento.
                </p>
            </div>
            <div className="container-img-text">
                <div className="row gy-3 gy-lg-0 align-items-lg-center justify-content-lg-between"> <div className="container-img-2 col-12 col-lg-5 text-center">
                    <img
                        className=" img-fluid"
                        loading="lazy"
                        src="https://cdn.pixabay.com/photo/2022/01/15/13/21/digitization-6939537_1280.jpg"
                        alt="Art of Design"
                    />
                </div>
                </div>
                <div className="container-text-2">
                    <div className="container-list-group container-list-group-beneficios col-12 col-lg-6 order-1 order-lg-0">
                        <ul className="list-group list-group-flush">
                            <li className="list-group">
                                <h4><img className="container-img-list-group" src="https://as2.ftcdn.net/v2/jpg/00/32/83/99/1000_F_32839903_xMihhvYEOaor5oYHh9qbUNepDzae2Nyq.jpg" /> Crea tu Perfil </h4>
                                <p className="container-text-list-group"> Regístrate y completa tu historial médico de forma segura. Configurar su perfil de esta manera garantizará que se mantenga actualizado con sus procesos médicos. </p>
                            </li>
                            <li className="list-group">
                                <h4> <img className="container-img-list-group" src="https://as2.ftcdn.net/v2/jpg/00/32/83/99/1000_F_32839911_5OEH18hPOulQnjxNARaEGZCe94ahX5cS.jpg" /> Análisis de sangre</h4>
                                <ul className="list-group list-group-flush">
                                    <p className="container-text-list-group">
                                        Analice sus resultados de Lab online.
                                        <br />
                                        Encontrar al especialista adecuado.
                                        <br />
                                        Agendar citas con facilidad.
                                    </p>
                                </ul>
                            </li>
                            <li className="list-group">
                                <h4> <img className="container-img-list-group" src="https://as2.ftcdn.net/v2/jpg/00/32/83/99/500_F_32839913_JhaBg7Qur1AUbxibF8gMXjrWdH40DXJM.jpg" /> Conoce a tu Dr.</h4>
                                <ul className="list-group list-group-flush">
                                    <p className="container-text-list-group">
                                        Ten una consulta virtual con uno de nuestros especialistas certificados, o acude a una visita física al médico en caso de que hayas optado por un chequeo físico.
                                    </p>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Link to="/analysis">
                <button type="button" className="btn btn-hero-2 bsb-btn-xl ">
                    Analiza tus valores
                </button>
            </Link>
        </section>
    );
}