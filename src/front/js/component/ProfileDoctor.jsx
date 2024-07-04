import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ContactSection from './ContactSection.jsx';
import AppointmentsModal from './AppointmentsModal.jsx';
import { useNavigate } from "react-router-dom";

const ProfileDoctor = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el doctorId desde la URL
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        numero_de_telefono: '',
        email: '',
        ciudad: '',
        especialidad: '',
        especialidades_adicionales: [],
        numero_de_licencia: '',
        direccion: '',
        password: '',
        costo: '',
        estado: '',
        foto_perfil: '',
    });
    const [respuestaServidor, setRespuestaServidor] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);


    useEffect(() => {
        // Fetch initial doctor data
        console.log("useEffect del doctor")
        const fetchDoctorData = async () => {
            console.log("fetch del doctor")
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/profile?type=doctor`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log("resouesta del perfil doctor", response)
                const data = await response.json();
                if (response.ok) {
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        ...data.msg,
                        especialidades_adicionales: data.msg.especialidades_adicionales.map(e => e.especialidades)
                    }));
                } else {
                    console.error('Error fetching doctor data:', data.msg);
                }
            } catch (error) {
                console.error('Error fetching doctor data:', error);
            }
        }
        fetchDoctorData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value //computer propery  obtener en tiempo de ejecucion el name
        });
    };

    const handleAddEspecialidad = () => {
        setFormData({
            ...formData,
            especialidades_adicionales: [...formData.especialidades_adicionales, '']
        });
    };

    const handleEspecialidadChange = (index, value) => {
        const newEspecialidades = [...formData.especialidades_adicionales];
        newEspecialidades[index] = value;
        setFormData({
            ...formData,
            especialidades_adicionales: newEspecialidades
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')

        const method = isEdit ? 'PUT' : 'POST';
        const url = `${process.env.BACKEND_URL}/profile`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: 'doctor',
                    id: id, // Use the id from the URL if present
                    especialidad: formData.especialidad,
                    numero_de_telefono: formData.numero_de_telefono,
                    direccion: formData.direccion,
                    ciudad: formData.ciudad,
                    estado: formData.estado,
                    costo: formData.costo,
                    numero_de_licencia: formData.numero_de_licencia,
                    especialidades_adicionales: formData.especialidades_adicionales,
                    foto_perfil: formData.foto_perfil,
                }),
            });

            const data = await response.json();
            setRespuestaServidor(data);


            // Resetea el formulario después de enviar
            setFormData({
                nombre: '',
                apellido: '',
                numero_de_telefono: '',
                email: '',
                ciudad: '',
                especialidad: '',
                especialidades_adicionales: [],
                numero_de_licencia: '',
                direccion: '',
                password: '',
                costo: '',
                estado: '',
                foto_perfil: '',
            });
            navigate("/doctors");

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-center p-4">
                <div className="box-shadow-blue rounded-element p-4 w-50">
                    <h2 className="text-center gradient-text fw-bold">Completa tu perfil médico</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="text-center mb-3">
                            <label className="form-label">Foto de Perfil (URL)</label>
                            <input
                                type="text"
                                name="foto_perfil"
                                value={formData.foto_perfil}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese la URL de su foto de perfil"
                            />
                        </div>
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
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Ciudad</label>
                                <input
                                    type="text"
                                    name="ciudad"
                                    value={formData.ciudad}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese su ciudad"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Estado</label>
                                <input
                                    type="text"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese su estado"
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Especialidad</label>
                                <input
                                    type="text"
                                    name="especialidad"
                                    value={formData.especialidad}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese su especialidad principal"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Número de Licencia</label>
                                <input
                                    type="text"
                                    name="numero_de_licencia"
                                    value={formData.numero_de_licencia}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese su número de licencia"
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Dirección</label>
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese su dirección"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Costo por Consulta</label>
                            <input
                                type="text"
                                name="costo"
                                value={formData.costo}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese el costo por consulta"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Especialidades Adicionales</label>
                            {formData.especialidades_adicionales.map((especialidad, index) => (
                                <div key={index} className="input-group mb-2">
                                    <input
                                        type="text"
                                        value={especialidad}
                                        onChange={(e) => handleEspecialidadChange(index, e.target.value)}
                                        className="form-control"
                                        placeholder="Ingrese una especialidad adicional"
                                    />
                                </div>
                            ))}
                            <button type="button" className="btn btn-primary mt-2" onClick={handleAddEspecialidad}>Añadir Especialidad</button>
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">{isEdit ? 'Actualizar' : 'Guardar'}</button>
                        </div>
                    </form>
                    {respuestaServidor && (
                        <div className={`alert ${respuestaServidor.status === 'success' ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
                            {respuestaServidor.msg}
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-center p-4">
                <div className="box-shadow-blue rounded-element p-4 w-50">
                    <h2 className="text-center gradient-text fw-bold">Citas Agendadas del doctor</h2>
                    <div className="text-center mt-3">
                        <button className="btn btn-primary" onClick={() => setShowAppointmentsModal(true)}>Ver Citas Agendadas</button>
                    </div>
                    {showAppointmentsModal && (
                        <AppointmentsModal doctorId={formData.id} onClose={() => setShowAppointmentsModal(false)} />
                    )}
                </div>
            </div>

            <ContactSection />
        </div>
    );

};

export default ProfileDoctor;
