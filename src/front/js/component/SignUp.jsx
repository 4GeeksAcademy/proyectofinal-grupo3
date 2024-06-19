import React from 'react'
import "../../styles/SignUp.css";

const SignUp = () => {
    return (
        <div className="container">

            <div className="login">
                <h2>Iniciar sesión</h2>
                <form id="loginForm">
                    <div className="input-group">
                        <label for="email">
                            <i className="fas fa-envelope"></i> Email
                        </label>
                        <input type="email" id="email" placeholder="Enter Your Email Address" required />
                    </div>

                    <div className="input-group">
                        <label for="password">
                            <i className="fas fa-lock"></i> Contraseña
                        </label>
                        <input type="password" id="password" placeholder="Enter Your Contact Number" required />
                    </div>

                    <button type="submit">Inicia sesión <i className="fas fa-check"></i></button>
                </form>

                <a type="forgot" href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" className="forgot-password">¿Olvidaste tu contraseña?</a>
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">

                                <div className='formulario'>

                                    <div className="input-group">
                                        <label for="email">
                                            <i className="fas fa-envelope"></i> Ingresa el codigo enviado a tu correo
                                        </label>
                                        <input type="email" id="email" placeholder="Enter Your Email Address" required />
                                    </div>
                                    <div className="input-group">
                                        <label for="password">
                                            <i className="fas fa-lock"></i> Nueva contraseña
                                        </label>
                                        <input type="password" id="password" placeholder="Enter Your Contact Number" required />
                                    </div>
                                </div>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary">Recuperar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





            <div className="login2">
                <h2>Registrese gratis</h2>
                <form id="loginForm">
                    <div className="input-group">
                        <label for="password">
                            <i className="fas fa-user"></i> Nombre completo
                        </label>
                        <input type="password" id="password" placeholder="Enter Your Contact Number" required />
                    </div>
                    <div className="input-group">
                        <label for="email">
                            <i className="fas fa-envelope"></i> Email
                        </label>
                        <input type="email" id="email" placeholder="Enter Your Email Address" required />
                    </div>

                    <div className="input-group">
                        <label for="password">
                            <i className="fas fa-lock"></i> Contraseña
                        </label>
                        <input type="password" id="password" placeholder="Enter Your Contact Number" required />
                    </div>

                    <button type="submit">Registrarse <i className="fas fa-check"></i></button>
                </form>

            </div>
        </div>

    )
}
export default SignUp

