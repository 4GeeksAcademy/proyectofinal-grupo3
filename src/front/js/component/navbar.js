import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import "../../styles/navbar.css";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    // Verificar el estado de inicio de sesión al cargar el componente y al cambiar la ruta
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 
  }, [navigate]); // Agrega navigate a la lista de dependencias del useEffect

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
      <div className="container-fluid">
        {/* Botón para colapsar el menú en pantallas pequeñas */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          {/* Enlace a la página principal */}
          <Link className="navbar-brand" to="/">
            Dr.Now
          </Link>

          {/* Lista de elementos del menú */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-2">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/doctors">
                Directorio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ingresar-valores">
                Ingresa tus valores
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blog">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contactenos">
                Contáctenos
              </Link>
            </li>
          </ul>

          {/* Botones de inicio de sesión/registro/cierre de sesión */}
          <div className="d-flex">
            {isLoggedIn ? (
              <button 
                className="btn btn-outline-light" 
                type="button"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            ) : (
              <>
                <Link to="/RolSelector/login">
                  <button className="btn btn-outline-light" type="button">
                    Iniciar Sesión
                  </button>
                </Link>
                <Link to="/RolSelector/signup">
                  <button className="btn btn-outline-light" type="button">
                    Registrarse
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};