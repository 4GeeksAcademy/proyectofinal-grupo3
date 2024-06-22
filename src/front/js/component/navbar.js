import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css"

export const Navbar = () => {
	return (
		<nav class="navbar navbar-expand-lg navbar-light bg-transparent">
  <div class="container-fluid">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
      <a class="navbar-brand" href="#">Dr.Now</a>
      <ul class="navbar-nav me-auto mb-2 mb-lg-0 mt-2">
        <li class="nav-item">
          <a class="nav-link" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" href="#">Directorio</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Ingresa tus valores</a>
        </li>
		<li class="nav-item">
          <a class="nav-link" href="#">Blog</a>
        </li>
		<li class="nav-item">
          <a class="nav-link" href="#">Contactenos</a>
        </li>
      </ul>
      <form class="d-flex">
        
        <button class="signup btn btn-outline-light" type="submit">Registrarse gratis</button>
      </form>
    </div>
  </div>
</nav>
	);
};
