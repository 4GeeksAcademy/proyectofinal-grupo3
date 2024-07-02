// src/components/Blog.js
import React from 'react';
import { Link } from 'react-router-dom';

const articles = [
    {
        id: 1,
        title: "La Importancia de una Alimentación Saludable",
        author: "Dr. Juan Pérez",
        excerpt: "Una alimentación saludable es crucial para mantener el cuerpo en óptimas condiciones...",
        content: "Una alimentación saludable es crucial para mantener el cuerpo en óptimas condiciones. Los alimentos ricos en nutrientes como frutas, verduras, granos enteros y proteínas magras pueden ayudar a prevenir enfermedades crónicas y mejorar la salud general. Es importante equilibrar las porciones y elegir opciones saludables para llevar un estilo de vida activo y vigoroso."
    },
    {
        id: 2,
        title: "Beneficios del Ejercicio Regular",
        author: "Dra. María González",
        excerpt: "El ejercicio regular no solo mejora la condición física, sino que también tiene beneficios mentales...",
        content: "El ejercicio regular no solo mejora la condición física, sino que también tiene beneficios mentales. La actividad física puede reducir el estrés, mejorar el estado de ánimo y aumentar la energía. Incorporar actividades como caminar, correr, nadar o practicar deportes puede llevar a una vida más saludable y equilibrada."
    },
    {
        id: 3,
        title: "Cómo Manejar el Estrés en el Trabajo",
        author: "Dr. Carlos Rodríguez",
        excerpt: "Manejar el estrés en el trabajo es esencial para mantener la salud mental y física...",
        content: "Manejar el estrés en el trabajo es esencial para mantener la salud mental y física. Técnicas como la meditación, el yoga y las pausas regulares pueden ayudar a reducir la tensión y mejorar la productividad. Es crucial reconocer los signos de estrés y tomar medidas para controlar su impacto en la vida diaria."
    }
];

const Blog = () => {
    return (
        <div className="d-flex flex-column container mt-5">
            <h1 className="text-center gradient-text fw-bold">Blog de Salud</h1>
            <div className="row">
                {articles.map((article) => (
                    <div key={article.id} className="col-md-4 my-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{article.title}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">por {article.author}</h6>
                                <p className="card-text">{article.excerpt}</p>
                                <Link to={`/blog/${article.id}`} className="card-link">Leer más</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;
