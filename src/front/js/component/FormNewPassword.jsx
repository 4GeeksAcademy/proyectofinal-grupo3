import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import "../../styles/FormForgotPassword.css";

function NewPassword() {
  // Capturar el token de la URL
  const location = new URLSearchParams(useLocation().search)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estado para mostrar mensajes de éxito/error
  
  const token = location.get('token')
  const navigate = useNavigate();

  // const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {

      // Hacer una solicitud al backend para actualizar la contraseña
      const response = await fetch(process.env.BACKEND_URL + `/reset_password/${token}`, { // - `/reset_password/${token}`

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'

        },
        body: JSON.stringify({ password: newPassword, confirm_password: confirmPassword }) // <- { token, newPassword }
      });

      if (response.ok) {
        alert('Password has been successfully reset');
        navigate("/RolSelector/login");



      } else {

        alert('Failed to reset password');
      }
    } catch (error) {
      console.error('Error', error);
      alert('An error occurred while resetting the password');
    }
  };

  return (
    <div className='contenedor'>
      <h2>Recuperar Contraseña</h2>
      
      <form onSubmit={handleSubmit}>
        {/* ... (email input remains the same) ... */}
        <div className='mb-3 mt-3'>
          <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="form-label">Nueva Contraseña:</label>
          <input
            type="password"
            className="form-control"
            id="cconfirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary mt-3" type="submit"> Restablecer Contraseña</button>


        {/* <div>
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
        {error && <p style={{ color: 'red' }}>{error}</p>} */}
      </form>
    </div>
  );
}

export default NewPassword;