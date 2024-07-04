import React from "react";
import { Link } from "react-router-dom";
import "../../styles/footer.css";

export const Footer = () => (
      <div className="container-fluid frame mt-5">
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
                              Analiza tu exámen médico.
                        </p>

                        <div className="d-flex justify-content-between w-100">
                              <div className="group-2">
                                    <ul className="specialty-list">
                                          <li><Link to='/doctors'>Directorio</Link></li>
                                          <li><Link to='/doctors'>Cardiólogos</Link></li>
                                          <li><Link to='/doctors'>Cirujanos</Link></li>
                                          <li><Link to='/doctors'>Dermatólogos</Link></li>
                                          <li><Link to='/doctors'>Nutricionistas</Link></li>
                                          <li><Link to='/doctors'>Oftalmólogos</Link></li>
                                    </ul>
                              </div>
                              <div className="group-3">
                                    <ul className="specialty-list">
                                          <li><Link to='/analysis'>Ingresa tus valores</Link></li>
                                          <li><Link to='/analysis'>Presión arterial</Link></li>
                                          <li><Link to='/analysis'>Hematocrito</Link></li>
                                          <li><Link to='/analysis'>Glicemia</Link></li>
                                          <li><Link to='/analysis'>Colesterol</Link></li>
                                          <li><Link to='/analysis'>Trigliceridos</Link></li>
                                    </ul>
                              </div>
                              <div className="group-4">
                                    <ul className="specialty-list">
                                          <li>Nosotros</li>
                                          <li><Link to='/RolSelector/login'>Iniciar sesión</Link></li>
                                          <li><Link to='/RolSelector/signup'>Registro</Link></li>
                                          <li><Link to='/contact'>Contacto</Link></li>
                                          <li>Términos y condiciones</li>
                                    </ul>
                              </div>
                        </div>
                  </div>
                  <img className="line" alt="Line" src="https://c.animaapp.com/EgL9H0Rr/img/line-1.svg" />
                  <p className="p">Dr.Now 2024 © All Rights Reserved</p>
            </div>
      </div>
);
