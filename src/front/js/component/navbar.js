import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css"

export const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-transparent">
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
      <a className="navbar-brand" href="#">Dr.Now</a>
      <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-2">
        <li className="nav-item">
          <a className="nav-link" aria-current="page" href="#">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link active" href="#">Directorio</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Ingresa tus valores</a>
        </li>
		<li className="nav-item">
          <a className="nav-link" href="#">Blog</a>
        </li>
		<li className="nav-item">
          <a className="nav-link" href="#">Contactenos</a>
        </li>
      </ul>
      <form className="d-flex">
        
        <button className="signup btn btn-outline-light" type="submit">Registrarse gratis</button>
      </form>
    </div>
  </div>
</nav>
	);
};
