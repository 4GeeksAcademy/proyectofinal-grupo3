import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/forgot-password', { // Asegúrate de que la ruta sea correcta
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message); // Muestra el mensaje de éxito del backend
        setError(''); // Limpia cualquier error anterior
      } else {
        const errorData = await response.json();
        setError(errorData.error); // Muestra el mensaje de error del backend
        setMessage(''); // Limpia cualquier mensaje de éxito anterior
      }
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
      setError('Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
      setMessage(''); // Limpia cualquier mensaje anterior
    }
  };

  return (
    <div>
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
        <button type="submit">Enviar código</button>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;