import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SpecialtyModal from './SpecialtyModal.jsx';
import AppointmentForm from './AppointmentForm.jsx';
import ReviewComments from './ReviewComments.jsx';

const DoctorsDirectoryDetail = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [appointmentOpen, setAppointmentOpen] = useState(false);

    const doctorsList = require("../../../../public/doctors.json");

    useEffect(() => {
        const foundDoctor = doctorsList.find(doc => doc.id === parseInt(id));
        if (!foundDoctor) {
            alert(`No doctor found with ID ${id}`);
        }
        setDoctor(foundDoctor);
    }, [id]);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleOpenAppointment = () => {
        setAppointmentOpen(true);
    };

    const handleCloseAppointment = () => {
        setAppointmentOpen(false);
    };

    if (!doctor) {
        return <div>Cargando...</div>;
    }

    const overlayActive = modalOpen || appointmentOpen;

    return (
        <div className={`position-relative ${overlayActive ? 'overlay-active' : ''}`}>
            <div className="p-4 d-flex justify-content-center">
                <div className="card-custom card-body p-4 text-center">
                    <div className="d-flex justify-content-center mb-3">
                        <img src={doctor.image} alt={doctor.name} className="w-25 h-25 object-cover rounded-circle shadow-sm" />
                    </div>
                    <h1 className="h2 fw-bold">{doctor.name}</h1>
                    <p className="d-flex align-items-center justify-content-center text-muted" style={{ lineHeight: '1.5' }}>
                        {doctor.specialty}
                        <button
                            className="text-primary ms-2 btn btn-link p-0"
                            onClick={handleOpenModal}
                        >
                            Ver más
                        </button>
                    </p>
                    <p className="text-muted" style={{ lineHeight: '1.5' }}>{doctor.address}</p>
                    <p className="text-muted" style={{ lineHeight: '1.5' }}>Cédula: {doctor.licenseNumber}</p>
                    <div className="text-muted mt-2" style={{ lineHeight: '1.5' }}>
                        <span className="text-warning">★★★★★</span> ({doctor.reviews} opiniones)
                    </div>
                    <div className="mt-4">
                        <button
                            type="submit"
                            className="btn btn-search box-shadow-blue px-5 ms-2"
                            onClick={handleOpenAppointment}
                        >
                            <div className='d-flex flex-row align-items-center'>
                                <span>Agendar cita</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-arrow-right-circle ms-2" viewBox="0 0 16 16">
                                    <circle cx="8" cy="8" r="8" fill="white" />
                                    <path fillRule="evenodd" d="M4.5 8a.5.5 0 0 1 .5-.5h4.793L8.146 5.854a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L9.793 8.5H5a.5.5 0 0 1-.5-.5z" fill="#00a4f4" />
                                </svg>
                            </div>
                        </button>
                    </div>
                    {modalOpen && <SpecialtyModal doctor={doctor} onClose={handleCloseModal} />}
                    {appointmentOpen && <AppointmentForm doctor={doctor} onClose={handleCloseAppointment} />}
                </div>
            </div>
            <div className='container position-relative' style={{ zIndex: overlayActive ? 0 : 2 }}>
                <ReviewComments reviews_comments={doctor.reviews_comments} />
            </div>
            {(modalOpen || appointmentOpen) && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50" style={{ zIndex: 1 }}></div>
            )}
        </div>
    );
};

export default DoctorsDirectoryDetail;
