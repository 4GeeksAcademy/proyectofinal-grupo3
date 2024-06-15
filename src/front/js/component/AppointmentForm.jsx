import React, { useState } from 'react';

const AppointmentForm = ({ doctor, onClose }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes manejar la lógica de envío del formulario, como hacer una solicitud POST a un servidor
        console.log('Appointment details:', { name, date, time, doctor: doctor.name, reason });
        onClose();
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-50" style={{ zIndex: 3 }}>
            <div className="bg-white p-4 rounded-element box-shadow-blue d-flex flex-column flex-md-row align-items-center w-90 w-md-100">
                <img
                    src="https://s3-alpha-sig.figma.com/img/d644/d085/17d322a1229d3f38b1cd1c71f7fbd812?Expires=1719187200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=R7Mk9HXigfYjBoOOgy8CzjScZAH7vCpaRvwtagrHbjZqzqnfg3ORFE-7XlKikVGUQIASvEdfDnJNQLR8w~Nujdq1f2YerI6psS3y13q~zjzoiXNVip2GwMgiZPE0eVr8d~L~6xSTROgBbZ2MUnCILr2XfLGkYwaSsksKuwCPGA8FCw5IlT5AA6bC0LA-Ee2n4Eb0tophbZXtD6NmuPQ0owx~ujB52UcNSvdctw1U9hQcbxXRjOuzVcE6ZKZbeR08sADr7ghHMZqLjGH4lcTmgkaT2h5CVU42DQr6jvuy3tzQSzyuZdYRtZkmW5MVf1YPA8O7cMZEWtExbyozpenSZw__"
                    alt="DoctorAgenda"
                    className="rounded-element w-50 w-md-50 mb-4 mb-md-0 me-md-4"
                />
                <div className="w-50">
                    <h2 className="h4 fw-bold mb-3 text-center gradient-text">Agendar cita con {doctor.name}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-muted d-block text-start">Nombre</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted d-block text-start">Fecha</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted d-block text-start">Hora</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted d-block text-start">Motivo de la consulta</label>
                            <input
                                type="text"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-cancelar box-shadow-blue me-5 px-4"
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-search box-shadow-blue px-4">
                                Agendar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default AppointmentForm;
