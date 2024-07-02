import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ContactSection from './ContactSection.jsx';
import AppointmentsModalPaciente from './AppointmentsModalPaciente.jsx';

const ProfilePatient = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        numero_de_telefono: '',
        fecha_de_nacimiento: '',
        email: '',
        sexo: '',
        password: '',
        foto_perfil: '',
        type: 'paciente',
    });
    const [respuestaServidor, setRespuestaServidor] = useState(null);
    const [ShowAppointmentsModalPaciente, setShowAppointmentsModalPaciente] = useState(false);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/profile?type=paciente`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                const data = await response.json();

                if (response.ok) {
                    // Initialize all fields to avoid null values
                    setFormData({
                        nombre: data.msg.nombre || '',
                        apellido: data.msg.apellido || '',
                        numero_de_telefono: data.msg.numero_de_telefono || '',
                        fecha_de_nacimiento: data.msg.fecha_de_nacimiento || '',
                        email: data.msg.email || '',
                        sexo: data.msg.sexo || '',
                        password: '', 
                        type: 'paciente',
                    });
                } else {
                    console.error('Error fetching patient data:', data.msg);
                }
            } catch (error) {
                console.error('Error fetching patient data:', error);
            }
        };

        fetchPatientData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        
        const formattedFechaNacimiento = formData.fecha_de_nacimiento
            ? new Date(formData.fecha_de_nacimiento).toISOString().split('T')[0]
            : null;

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: 'paciente',
                    numero_de_telefono: formData.numero_de_telefono,
                    fecha_de_nacimiento: formattedFechaNacimiento,
                    foto_perfil: formData.foto_perfil,
                    sexo: formData.sexo,
                }),
            });

            const data = await response.json();
            setRespuestaServidor(data);
            navigate("/"); 
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            
        }
        
    };

    return (
        <div>
            <div className="d-flex justify-content-center p-4">
                <div className="box-shadow-blue rounded-element p-4 w-50">
                    <h2 className="text-center gradient-text fw-bold">Completa tu perfil</h2>
                    <form onSubmit={handleSubmit}>
                        
                        {formData.foto_perfil && (
                            <div className="text-center mb-3">
                                <img src={formData.foto_perfil} alt="Foto de Perfil" className="img-fluid rounded-circle" style={{ maxWidth: '150px' }} />
                            </div>
                        )}
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese su nombre"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Apellido</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese su apellido"
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Número de Teléfono</label>
                                <input
                                    type="text"
                                    name="numero_de_telefono"
                                    value={formData.numero_de_telefono}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese su número de teléfono"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese su correo electrónico"
                                />
                            </div>
                        </div>
                        <div className="col-md-6 ">
                            <label className="form-label" htmlFor="fecha_de_nacimiento">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                id="fecha_de_nacimiento"
                                name="fecha_de_nacimiento"
                                value={formData.fecha_de_nacimiento} 
                                onChange={handleChange}
                                className="form-control"
                                placeholder="dd/mm/aaaa" 
                            />
                        </div>
                        <div className="col-md-6 mb-5">
                                <label className="form-label">sexo</label>
                                <input
                                    type="text"
                                    name="sexo"
                                    value={formData.sexo}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese su nombre"
                                />
                            </div>





                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Guardar Perfil</button>
                        </div>
                    </form>
                    {respuestaServidor && (
                        <div className={`alert ${respuestaServidor.status === 'success' ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
                            {respuestaServidor.msg}
                        </div>
                    )}
                </div>
            </div>
            <ContactSection />
            <div className="text-center mt-3">
                <button className="btn btn-info" onClick={() => setShowAppointmentsModalPaciente(true)}>Ver Citas Agendadas</button>
            </div>
            {ShowAppointmentsModalPaciente && (
                <AppointmentsModalPaciente pacienteId={id} onClose={() => setShowAppointmentsModalPaciente(false)} />
            )}
        </div>
    );
};

export default ProfilePatient;
