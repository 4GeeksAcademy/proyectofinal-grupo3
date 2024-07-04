import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/SignUp.css";
import { Link } from 'react-router-dom';

export const FormLogIn = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    type: props.role, // Usa props.role para el tipo de usuario
  });

  const [error, setError] = useState(null);
  const isMounted = useRef(true); // Referencia para el estado de montaje
  const navigate = useNavigate();

  useEffect(() => {
    // Limpieza al desmontar
    return () => {
      isMounted.current = false; 
    };
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Datos enviados:", formData); // Agrega esta línea
    try {
      const response = await fetch(process.env.BACKEND_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: props.role }),
      });

      if (!isMounted.current) return; // Salir si el componente está desmontado

      if (response.ok) {
        const data = await response.json();
        console.log("Inicio de sesión exitoso:", data);
        
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("type", props.role)
        localStorage.setItem("id",props.id)
        
        if (props.role === "paciente") {
          navigate("/profile_patient");
        } else if (props.role === "doctors") {
          navigate("/profile_doctor");
        } else {
          navigate("/default-page");
        }
      } else {
        const errorData = await response.json();
        if (isMounted.current) {
          setError(errorData.msg);
        }
        setError(errorData.msg);
      }
    } catch (error) {
      if (isMounted.current) {
        // console.error("Error de red:", error);
        setError("Error en la conexión. Inténtalo de nuevo.");
      }
    }
  };
  

  return (
    <div className="contenedor">
      <div className="login">
        <h2>Iniciar sesión</h2>
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Email
            </label>
            <input
              type="email"
              id="email"
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
              id="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            Inicia sesión <i className="fas fa-check"></i>
          </button>
        </form>

       
        {error && <div className="alert alert-danger">{error}</div>}

       
        <Link to="/forgot_password" className="forgot-password">
  ¿Olvidaste tu contraseña?
</Link>

        {/* <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* <div className="modal-header">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div> */}
              {/* <div className="modal-body">
                <div className="formulario">
                  <div className="input-group">
                    <label htmlFor="email">
                      <i className="fas fa-envelope"></i> Ingresa el código enviado a tu correo
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
              </div> */}
              {/* <div className="modal-footer">
                <button type="button" className="btn btn-primary">Recuperar</button>
              </div> */}
            {/* </div> */}
          {/* </div>
        </div> */} 
      </div>
    </div>
  );
};








// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/SignUp.css";

// export const FormLogIn = (props) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     type: "",
//   });

//   const [error, setError] = useState(null);
  

//   const navigate = useNavigate();

//   const handleChange = (event) => {
//     setFormData({ ...formData, [event.target.name]: event.target.value });
//     setError(null);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await fetch(`${process.env.BACKEND_URL}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json",  },
//         body: JSON.stringify(({ ...formData, type: props.role }),),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Inicio de sesión exitoso:", data);
//         localStorage.setItem("token", data.access_token);
//         if (props.role === "paciente") {
//           navigate("/admin-dashboard"); 
//         } else if (props.role === "doctors") {
//           navigate("/profile_doctor");
//         } else {
//           navigate("/default-page"); 
//         } 
//       } else {
//         const errorData = await response.json();
//         setError(errorData.msg); 
//       }
//     } catch (error) {
//       console.error("Error de red:", error);
//       setError("Error en la conexión. Inténtalo de nuevo.");
//     }
//   };

//   return (
//     <div className="contenedor">
//       <div className="login">
//         <h2>Iniciar sesión</h2>
//         <form id="loginForm" onSubmit={handleSubmit}>
//           <div className="input-group">
//             <label htmlFor="email">
//               <i className="fas fa-envelope"></i> Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email" 
//               placeholder="Correo electrónico"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="input-group">
//             <label htmlFor="password">
//               <i className="fas fa-lock"></i> Contraseña
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="Contraseña"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit">
//             Inicia sesión <i className="fas fa-check"></i>
//           </button>
//         </form>

//         {/* Mensaje de error */}
//         {error && <div className="alert alert-danger">{error}</div>}

//         {/* Enlace para abrir el modal de recuperación de contraseña */}
//         <a type="forgot" href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" className="forgot-password">¿Olvidaste tu contraseña?</a>

//         {/* Modal de recuperación de contraseña */}
//         <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//               </div>
//               <div className="modal-body">
//                 <div className="formulario">
//                   <div className="input-group">
//                     <label htmlFor="email">
//                       <i className="fas fa-envelope"></i> Ingresa el código enviado a tu correo
//                     </label>
//                     <input type="email" id="email" placeholder="Enter Your Email Address" required />
//                   </div>
//                   <div className="input-group">
//                     <label htmlFor="password">
//                       <i className="fas fa-lock"></i> Nueva contraseña
//                     </label>
//                     <input type="password" id="password" placeholder="Enter Your Contact Number" required />
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-primary">Recuperar</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };