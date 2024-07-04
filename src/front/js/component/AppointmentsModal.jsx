import React, { useState, useEffect } from 'react';

const AppointmentsModal = ({ doctorId, onClose }) => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/doctor/${doctorId}/appointments`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setAppointments(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();

    }, [doctorId]);



    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-50" style={{ zIndex: 3 }}>
            <div className="bg-white p-4 rounded-element box-shadow-blue w-50">
                <h2 className="h4 fw-bold mb-3 text-center gradient-text">Citas Agendadas</h2>
                <div>
                    {appointments.length === 0 ? (
                        <p>No hay citas agendadas.</p>
                    ) : (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Nombre del Paciente</th>
                                    <th>Día de la Semana</th>
                                    <th>Hora de Inicio</th>
                                    <th>Hora de Finalización</th>
                                    <th>Comentarios y/o Observaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(appointment => (
                                    <tr key={appointment.id}>
                                        <td>{appointment.pacient_name} {appointment.pacient_last_name}</td>
                                        <td>{appointment.availability.day_of_week}</td>
                                        <td>{appointment.availability.start_time}</td>
                                        <td>{appointment.availability.end_time}</td>
                                        <td>{appointment.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className='d-flex justify-content-center'>
                    <button type="button" className="btn btn-danger" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentsModal;
