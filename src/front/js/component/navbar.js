import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";
import { jwtDecode } from 'jwt-decode';

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('type');
    console.log({type})
    setIsLoggedIn(!!token);
    
    if (token) {
      try {
       
        setUserType(type);
        

        // if (userType === 'doctors') {
        //   navigate('/profile_doctors');
        // } else if (userType === 'paciente') {
        //   navigate('/profile_patient');
        // }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
      }
    }
    
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };
  
  

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
      <div className="container-fluid">
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
          <Link className="navbar-brand" to="/">
            Dr.Now
          </Link>

          <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-2">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/doctors">
                Agenda tu cita
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/analysis">
                Ingresa tus valores
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blog">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contáctenos
              </Link>
            </li> 
          </ul>

          <div className="d-flex">
            {!isLoggedIn && (
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

            {isLoggedIn && (
              <div className="dropdown me-3">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Mi cuenta
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <Link to={userType === 'doctors' ? '/profile_doctor' : '/profile_patient'} className="dropdown-item p-3">
                      Mi perfil
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/appointments" className="dropdown-item p-3">
                      Mis citas
                    </Link>
                  </li> */}
                  <li>
                    <button
                      className="close dropdown-item btn btn-outline-light ms-1"
                      type="button"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};