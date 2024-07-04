import React, { useState } from 'react';

const ContactSection = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que se recargue la página al enviar el formulario

        const response = await fetch(`${process.env.BACKEND_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName: fullName,
                email: email,
                comments: comments,
            }),
        });

        // Aquí puedes agregar la lógica para enviar los datos a un servidor, por ejemplo:
        //console.log(`Nombre: ${fullName}, Correo electrónico: ${email}, Comentarios: ${comments}`);

        // Limpia los campos después del envío (opcional)
        if (response.ok) {
            alert('Formulario enviado correctamente!');
            setFullName('');
            setEmail('');
            setComments('');
        } else {
            alert('Hubo un error al enviar el formulario');
        }
    };

    return (
        <div className="mt-5 mb-5">
            <h2 className="text-center">Contáctanos</h2>
            <p className="text-center text-muted mb-4">¿Preguntas? ¿Necesitas asistencia? Nuestro equipo está aquí para ayudarte.</p>
            <div className="container-fluid d-flex justify-content-center">
                <form className="d-flex align-items-center" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-control me-3"
                        placeholder="Ingresa tu nombre completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <input
                        type="email"
                        className="form-control me-3"
                        placeholder="Ingresa tu correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        className="form-control me-3"
                        placeholder="Ingresa tus comentarios"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                    <button type="submit" className="btn btn-search">
                        <div className='d-flex flex-row align-items-center'>
                            <span>Contáctanos!</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-arrow-right-circle ms-2" viewBox="0 0 16 16">
                                <circle cx="8" cy="8" r="8" fill="white" />
                                <path fillRule="evenodd" d="M4.5 8a.5.5 0 0 1 .5-.5h4.793L8.146 5.854a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L9.793 8.5H5a.5.5 0 0 1-.5-.5z" fill="#00a4f4" />
                            </svg>
                        </div>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactSection;
