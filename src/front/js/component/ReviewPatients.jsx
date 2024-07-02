import React, { useState, useEffect } from 'react';

const ReviewPatients = ({ onReviewSubmitted }) => {
    const [review, setReview] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [doctorOptions, setDoctorOptions] = useState([]);
    //const [patientName, setPatientName] = useState('');

    useEffect(() => {
        async function fetchDoctorOptions() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.BACKEND_URL}/doctors`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setDoctorOptions(data);
                } else {
                    console.error('Error al obtener la lista de doctores:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud GET:', error);
            }
        }

        fetchDoctorOptions();
    }, []);


    const handleChangeDoctor = (e) => {
        setDoctorId(e.target.value);
    };

    const handleChangeReview = (e) => {
        setReview(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.BACKEND_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                doctor_id: doctorId,
                comentario: review,
                puntuacion: 5, // Aquí podrías agregar una lógica para la puntuación si la tienes
            }),
        });

        if (response.ok) {
            alert('Reseña enviada correctamente!');
            setReview('');
            onReviewSubmitted();
        } else {
            alert('Hubo un error al enviar la reseña');
        }
    };

    return (
        <div className="d-flex justify-content-center p-4">
            <div className="box-shadow-blue rounded-element p-4 w-50">
                <h2 className="text-center gradient-text fw-bold">Dejar una Reseña para el doctor</h2>
                <form onSubmit={handleSubmit}>
                    <div className="col-md-12">
                        <label className="form-label">Doctor</label>
                        <select
                            name="doctor"
                            value={doctorId}
                            onChange={handleChangeDoctor}
                            className="form-select"
                            required
                        >
                            <option value="">Selecciona un doctor</option>
                            {doctorOptions.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.nombre} {doctor.apellido}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="col-md-12 mt-3">
                        <label className="form-label">Paciente</label>
                        <input
                            type="text"
                            name="patient"
                            value={patientName}
                            className="form-control"
                            readOnly
                        />
                    </div> */}
                    <div className="col-md-12 mt-3">
                        <label className="form-label">Reseña</label>
                        <textarea
                            name="review"
                            value={review}
                            onChange={handleChangeReview}
                            className="form-control"
                            rows="4"
                            placeholder="Ingresa una reseña"
                            required
                        ></textarea>
                    </div>
                    <div className="d-grid mt-3">
                        <button type="submit" className="btn btn-primary">Enviar Reseña</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewPatients;
