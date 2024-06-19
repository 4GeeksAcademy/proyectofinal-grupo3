import React from "react";

export const ScientificArticleCard = () => {

    return (
        <div className="card px-4">
            <div className="card-header">
            <div className="col-12 col-lg-5">
                        <img
                            className="img-fluid"
                            loading="lazy"
                            src="https://cdn.pixabay.com/photo/2022/01/15/13/21/digitization-6939537_1280.jpg"
                            alt="Art of Design"
                        />
                    </div>

            </div>
            <div className="card-body">
                <h5 className="card-title">Conoce un poco más sobre nosotros</h5>
                <p className="card-text">
                Explora nuestra biblioteca de temas médicos Descubre consejos prácticos para cuidar tu salud y la de tu familia. Mantente a la vanguardia de las últimas tendencias en el cuidado de la salud. Nuestro blog es una herramienta valiosa para pacientes, profesionales de la salud y cualquier persona interesada en ampliar sus conocimientos sobre la salud.
                </p>
                <a href="#" className="btn btn-primary">
                    Go somewhere
                </a>
            </div>
        </div>

    );
};