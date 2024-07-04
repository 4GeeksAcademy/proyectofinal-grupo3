import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/FormForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [ userType, setUserType] = useState(''); // Agregar el estado para el tipo de usuario
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(process.env.BACKEND_URL + "/forgot_password", { // Asegúrate de que la ruta sea correcta
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, user_type: userType}) // Asegúrate de enviar el tipo de usuario
      });

      if (response.ok) {
        const data = await response.json();
        alert('Correo enviado');
        setMessage(data.mesg); // Muestra el mensaje de éxito del backend
        setError(''); // Limpia cualquier error anterior
        
        

      } else {
        const errorData = await response.json();
        setError(errorData.msg); // Muestra el mensaje de error del backend
        setMessage(''); // Limpia cualquier mensaje de éxito anterior
      }
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
      setError('Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
      setMessage(''); // Limpia cualquier mensaje anterior
    }
  };

  return (
    <div className="contenedor">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="userType">Tipo de usuario:</label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="">Selecciona el tipo de usuario</option>
            <option value="paciente">Paciente</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        <button className="mt-5" type="submit">Enviar código</button>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

       
       
       
        {/* <button type="submit">Enviar código</button>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
} */}

export default ForgotPassword;