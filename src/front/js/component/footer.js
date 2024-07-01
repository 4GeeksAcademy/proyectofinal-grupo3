import React from "react";
import "../../styles/footer.css";

export const Footer = () => (
      <div className="container-fluid frame">
            <div className="d-flex flex-column align-items-center">
                  <div className="d-flex justify-content-start align-items-center w-100 mb-3 ms-5">
                        <div className="group d-flex flex-column align-items-center">
                              <img
                                    className="img-footer"
                                    alt="logo"
                                    src="https://www.shutterstock.com/image-vector/medical-pharmacy-logo-design-template-260nw-287587964.jpg"
                              />
                              <div className="text-wrapper">Dr.Now</div>
                        </div>
                        <p className="div">
                              Detecta a tiempo, vive
                              <br /> sin preocupaciones
                              <br />
                              Analiza tu examen médico.
                        </p>

                        <div className="d-flex justify-content-between w-100">
                              <div className="group-2">
                                    <ul className="specialty-list">
                                          <li><a className="title" href="http://www.4geeksacademy.com">Directorio</a></li>
                                          <li><a href="http://www.4geeksacademy.com">Cardiologos</a></li>
                                          <li><a href="http://www.4geeksacademy.com">Cirujanos</a></li>
                                          <li><a href="http://www.4geeksacademy.com">Dermatologos</a></li>
                                          <li><a href="http://www.4geeksacademy.com">Nutricionistas</a></li>
                                          <li><a href="http://www.4geeksacademy.com">Oftalmologos</a></li>
                                    </ul>
                              </div>
                              <div className="group-3">
                                    <ul className="specialty-list">
                                          <li><a className="title" href="http://www.4geeksacademy.com">Ingresa tus valores</a></li>
                                          <li><a href="http://www.4geeksacademy.com">Presion arterial</a></li>
                                          <li><a href="http://www.4geeksacademy.com">Hematocrito</a></li>
                                          <li><a href="http://www.4geeksacademy.com">Glicemia</a></li>
                                          <li><a href="http://www.4geeksacademy.com">Colesterol</a></li>
                                          <li><a href="http://www.4geeksacademy.com">Triglicedios</a></li>
                                    </ul>
                              </div>
                              <div className="group-4">
                                    <ul className="specialty-list">
                                          <li><a className="title" href="http://www.4geeksacademy.com">Nosotros</a></li>
                                          <li><a href="http://www.4geeksacademy.com">iniciar sesion</a></li>
                                          <li><a href="http://www.4geeksacademy.com">Registro</a></li>
                                          <li><a href="http://www.4geeksacademy.com">Contacto</a></li>
                                          <li><a href="http://www.4geeksacademy.com">Terminos y condiciones</a></li>
                                    </ul>
                              </div>
                        </div>
                  </div>
                  <img className="line" alt="Line" src="https://c.animaapp.com/EgL9H0Rr/img/line-1.svg" />
                  <p className="p">Dr.Now 2024 © All Rights Reserved</p>
            </div>
      </div>
);
