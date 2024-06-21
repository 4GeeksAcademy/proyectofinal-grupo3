import React, { useState, useEffect } from "react";
import "../../styles/SignUp.css";

const SignUp = () => {
    useEffect(() => {
      const signupForm = document.getElementById("signupForm");
      
      signupForm.addEventListener("submit", (event) => {
        event.preventDefault();
  
        
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const email = document.getElementById("email1").value;
        const password = document.getElementById("password1").value;
        const confirmPassword = document.getElementById("confirm-password").value;
  
        
        if (!email || !password || !confirmPassword || !nombre || !apellido) {
          alert("Todos los campos son obligatorios.");
          return;
        }
  
        if (password !== confirmPassword) {
          alert("Las contraseñas no coinciden.");
          return;
        }
    
  
        
        const pacienteData = {
          email: email,
          password: password,
          nombre: nombre,
          apellido: apellido,
          confirm_password: confirmPassword

        };
  
        
        fetch(
          "https://studious-space-potato-9775p7qp7vvq27469-3001.app.github.dev/signup_paciente",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pacienteData),
          }
        )
          .then((response) => {
            if (!response.ok) {
              return response.json().then((errorData) => {
                throw new Error(errorData.msg || "Error en el registro"); 
              });
            }
            return response.json();
          })
          .then((data) => {
            alert(data.msg || "Registro exitoso"); 
            
          })
          .catch((error) => {
            alert(error.message || "Hubo un error desconocido en el registro"); 
            console.error("Error durante el registro:", error);
          });
      });
    }, []);
    
    useEffect(() => {
        const loginForm = document.getElementById("loginForm");
      
        loginForm.addEventListener("submit", async (event) => {
          event.preventDefault();
      
          const email = document.getElementById("email2").value;
          const password = document.getElementById("password3").value;
          const type = document.getElementById("type").value; 
      
          if (!email || !password || !type) {
            alert("Todos los campos son obligatorios.");
            return;
          }
      
          try {
            const response = await fetch(
              "https://studious-space-potato-9775p7qp7vvq27469-3000.app.github.dev/login", 
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, type }), // Envía el tipo de usuario
              }
            );
      
            if (response.ok) {
              const data = await response.json();
              // Inicio de sesión exitoso, maneja el token de acceso (data.access_token)
              localStorage.setItem('access_token', data.access_token);
              alert("Inicio de sesión exitoso");
              // Redirige a la página correspondiente al tipo de usuario
              window.location.href = type === 'paciente' ? '/paciente' : '/doctor';
            } else {
              const errorData = await response.json();
              throw new Error(errorData.msg || "Error en el inicio de sesión");
            }
          } catch (error) {
            alert(error.message || "Hubo un error desconocido en el inicio de sesión");
            console.error("Error durante el inicio de sesión:", error);
          }
        });
      }, []);
    
    return (
        <div className="container">

            <div className="login">
                <h2>Iniciar sesión</h2>
                <form id="loginForm">
                    <div className="input-group">
                        <label htmlFor="email">
                            <i className="fas fa-envelope"></i> Email
                        </label>
                        <input type="text" id="email2" placeholder="Enter Your Email Address" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="tipo">
                            <i className="fas fa-envelope"></i> tipo
                        </label>
                        <input type="text" id="type" placeholder="Enter Your Email Address" required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">
                            <i className="fas fa-lock"></i> Contraseña
                        </label>
                        <input type="password" id="password3" placeholder="Enter Your Contact Number" required />
                    </div>

                    <button type="submit">Inicia sesión <i className="fas fa-check"></i></button>
                </form>

                <a type="forgot" href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" className="forgot-password">¿Olvidaste tu contraseña?</a>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <div className='formulario'>

                                    <div className="input-group">
                                        <label htmlFor="email">
                                            <i className="fas fa-envelope"></i> Ingresa el codigo enviado a tu correo
                                        </label>
                                        <input type="email" id="email" placeholder="Enter Your Email Address" required />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="password">
                                            <i className="fas fa-lock"></i> Nueva contraseña
                                        </label>
                                        <input type="password" id="password" placeholder="Enter Your Contact Number" required />
                                    </div>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary">Recuperar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





            <div className="login2">
                <h2>Registrese gratis</h2>
                <form id="signupForm">
                    <div className="input-group">
                        <label htmlFor="nombre">
                            <i className="fas fa-user"></i> Nombre
                        </label>
                        <input type="text" id="nombre" placeholder="Enter Your Contact Number" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="apellido">
                            <i className="fas fa-user"></i> Apellido
                        </label>
                        <input type="text" id="apellido" placeholder="Enter Your Contact Number" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">
                            <i className="fas fa-envelope"></i> Email
                        </label>
                        <input type="email" id="email1" placeholder="Enter Your Email Address" required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">
                            <i className="fas fa-lock"></i> Contraseña
                        </label>
                        <input type="password" id="password1" placeholder="Enter Your Contact Number" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirm-password">
                            <i className="fas fa-lock"></i> Confirmar contraseña
                        </label>
                        <input type="password" id="confirm-password" placeholder="Enter Your Contact Number" required />
                    </div>

                    <button type="submit">Registrarse <i className="fas fa-check"></i></button>
                </form>

            </div>
        </div>

    )
}
export default SignUp

