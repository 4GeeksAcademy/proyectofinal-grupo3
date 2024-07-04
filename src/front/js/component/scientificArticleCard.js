import React from "react";
import { Link } from "react-router-dom";
import "../../styles/scientificArticleCard.css"

export const ScientificArticleCard = () => {

    return (
        <div className="card-blog">
            <h1> <span> Recomendaciones para vivir en bienestar</span> </h1>
            <div className="card-blog-body">
                <div className="card-blog-img">
                    <img
                        src="https://images.pexels.com/photos/7195380/pexels-photo-7195380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="Dr." />
                </div>
                <div className="card-blog-text">
                    <p>
                        ¿Te interesa alcanzar un estado de bienestar integral? En nuestro blog de
                        "Vivir en bienestar" encontrarás información valiosa y actualizada.
                    </p>
                    <p>
                        Explora artículos escritos por expertos médicos para descubrir:
                    </p>
                    <ul>
                        <li>Hábitos saludables para una vida plena.</li>
                        <li>Prevención de enfermedades.</li>
                        <li>Gestión de condiciones crónicas.</li>
                        <li>Salud mental y emocional.</li>
                        <li>Consejos para una familia saludable.</li>
                    </ul>
                    <p>
                        Únete a nuestra comunidad de lectores y descubre cómo vivir una vida más saludable y feliz.
                    </p>
                    
                    <Link to="/blog">
                        <button type="button" className="btn btn-article-card-2 bsb-btn-xl ">
                            ¡Se miembro nuestro blog hoy mismo!                          
                        </button>
                    </Link>
                </div>
            </div>
        </div >
    )
};