import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState(''); // New state for new password
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirmation
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // Send password reset request to your backend here
      // ...

      setMessage('Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña.');
      setError(''); // Clear any previous errors
      // You can use the navigate function here to redirect after successful password reset
    } catch (err) {
      setError('Error al procesar la solicitud. Por favor, inténtalo de nuevo.');
      setMessage(''); // Clear any previous messages
    }
  };

  return (
    <div>
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        {/* ... (email input remains the same) ... */}
        <div>
          <label htmlFor="newPassword">ingrese el codigo</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword">Nueva Contraseña:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Restablecer Contraseña</button>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default NewPassword;