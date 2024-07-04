import React from "react";
import "../../styles/hero.css";
import { Link } from "react-router-dom";



export const HeroSection = () => {
    return (
        <section className="HeroSection bsb-hero-2 px-3 mb-5">
            <div className="container overflow-hidden">
                <div className="container-text row gy-3 gy-lg-0 align-items-lg-center justify-content-lg-between">
                    <div className="col-12 col-lg-6 order-1 order-lg-0">
                        <h4 className="display-3 fw-bold mb-3">Interpreta tu <span>exámen</span> médico, detecta a tiempo y vive sin preocupaciones.
                        </h4>
                        <p className="fs-4 mb-5 container-text-paragraph">
                            Mantenga su salud bajo control, revisando la dinámica de la misma interpretando sus exámanes de laboratorios. Prevenga posibles enfermedades al monitorizar su salud.
                        </p>
                        <div className="d-grid gap-2 d-sm-flex">
                            <Link to="/analysis">
                                <button type="button" className="btn btn-primary btn-hero1-container bsb-btn-xl ">
                                    Analiza tus valores
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="container-img col-12 col-lg-5 text-center">
                        <img
                            src="https://png.pngtree.com/thumb_back/fw800/background/20230222/pngtree-a-young-and-attractive-doctor-easily-accessing-patient-records-with-a-tablet-swipe-photo-image_49836792.jpg"
                            alt="Dr."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};


