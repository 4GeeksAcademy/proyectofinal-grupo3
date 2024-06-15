import React, { useState } from 'react';

const ProfileDoctor = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        city: '',
        specialty: '',
        schedule: '',
        licenseNumber: '',
        address: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes manejar la lógica de envío del formulario, como hacer una solicitud POST a un servidor
        console.log('Doctor profile details:', formData);
        // Resetea el formulario después de enviar
        setFormData({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            city: '',
            specialty: '',
            schedule: '',
            licenseNumber: '',
            address: ''
        });
    };

    return (
        <div className="d-flex justify-content-center p-4">
            <div className="card box-shadow-blue rounded-element p-4 w-50">
                <h2 className="text-center gradient-text fw-bold">Completa tu perfil médico</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese su nombre"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Apellido</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese su apellido"
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Número de Teléfono</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
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
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Ciudad</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese su ciudad"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Especialidad</label>
                            <input
                                type="text"
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese su especialidad"
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Horarios de Atención</label>
                            <input
                                type="text"
                                name="schedule"
                                value={formData.schedule}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese sus horarios de atención"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Número de Licencia</label>
                            <input
                                type="text"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese su número de licencia"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Dirección de Consultorio</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Ingrese la dirección de su consultorio"
                            required
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-search box-shadow-blue px-5">Registrarse</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileDoctor;
