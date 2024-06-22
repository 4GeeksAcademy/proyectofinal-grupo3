import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
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
              <Link className="nav-link active" to="/directorio">
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

          <div className="d-flex">
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
          </div>
        </div>
      </div>
    </nav>
  );
};
