import React, { useState, useEffect } from 'react';

const AppointmentsModalPaciente = ({ pacienteId, onClose }) => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/paciente/${pacienteId}/appointments`, {
                    headers: {
                        'Content-Type': 'application/json',
                        //Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setAppointments(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();

    }, [pacienteId]);

  return (
    <div className="modal-container"> 
      {isLoading && (
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )} 
      {error && <p className="alert alert-danger">{error}</p>} 
      {!isLoading && !error && appointments.length === 0 && (
        <p className="alert alert-info">No hay citas agendadas.</p>
      )}
      {!isLoading && !error && appointments.length > 0 && (
        <div className="modal-content">
          <h2 className="text-center mb-3">Citas Agendadas</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Día</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>{appointment.doctor_name} {appointment.doctor_last_name}</td> 
                  <td>{appointment.availability.day_of_week}</td>
                  <td>{appointment.availability.start_time}</td>
                  <td>{appointment.availability.end_time}</td>
                  <td>{appointment.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-danger mt-3" onClick={onClose}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsModalPaciente;