
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/SignUp.css";

export const FormSignUp = (props) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirm_password: "",  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { role } = useParams();

  

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    
    if (formData.password !== formData.confirm_password) {
      setError("Las contraseñas no coinciden");
      console.log(formData)
      return;
    }

    try {
      const response = await fetch(process.env.BACKEND_URL + "/signup", {
        
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: role }), // Agrega el rol
      });

      if (response.ok) {
        console.log("Registro exitoso");
        navigate("/RolSelector/login"); // Redirige a la página principal 
        const errorData = await response.json();
        setError(errorData.msg);
      }
    } catch (error) {
      // console.error("Error de red:", error);
      setError("Error en la conexión. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="contenedor">
      <div className="login2">
        <h2>Registrarse gratis</h2>
        <form id="signupForm" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="nombre">
              <i className="fas fa-user"></i> Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="apellido">
              <i className="fas fa-user"></i> Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Email
            </label>
            <input
              type="email"
              id="email1"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Contraseña
            </label>
            <input
              type="password"
              id="password1"
              name="password"
              placeholder="Contraseña"
              value= {formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password">
              <i className="fas fa-lock"></i> Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm_password"
              placeholder="Confirmar contraseña"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit">
            Registrarse <i className="fas fa-check"></i>
          </button>
        </form>
      </div>
    </div>
  );
};