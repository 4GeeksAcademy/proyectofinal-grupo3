import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../store/appContext';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';
import ContactSection from './ContactSection.jsx';

const DoctorsDirectory = () => {
    //const doctorsList = require("../../../../public/doctors.json");

    const { actions, store } = useContext(Context);
    const doctorsList = store.doctors || []; // Asegúrate de tener un valor por defecto en caso de que store.doctors sea undefined

    const [doctors, setDoctors] = useState(doctorsList);
    //const [doctors, setDoctors] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const specialtyFilter = queryParams.get('specialty') || '';
    const cityFilter = queryParams.get('city') || '';
    const [showInitialMessage, setShowInitialMessage] = useState(true);


    useEffect(() => {
        actions.fetchDoctors();
    }, []);

    useEffect(() => {
        setDoctors(store.doctors);
    }, [store.doctors]);



    const filteredDoctors = doctors.filter(doctor => {
        return (
            (specialtyFilter === '' || doctor.especialidad?.toLowerCase().includes(specialtyFilter.toLowerCase())) &&
            (cityFilter === '' || doctor.ciudad?.toLowerCase().includes(cityFilter.toLowerCase()))
        );
    });

    useEffect(() => {
        // Mostrar el mensaje inicial solo si no hay filtros aplicados
        if (specialtyFilter === '' && cityFilter === '') {
            setShowInitialMessage(true);
        } else {
            setShowInitialMessage(false);
        }
    }, [specialtyFilter, cityFilter]);

    return (
        <div className="d-flex flex-column container mt-4">
            <h1 className="mb-4">Encuentra los mejores <span className="text-blue">médicos</span> de tu ciudad</h1>
            <SearchBar />
            {specialtyFilter !== '' && cityFilter !== '' && (
                <h5 className="my-4">{specialtyFilter}, {cityFilter}</h5>
            )}
            <div className="d-flex flex-column justify-content-center align-items-center">
                {showInitialMessage && (
                    <div className="col text-center mt-5">
                        <h5>*Selecciona una especialidad y una ciudad para ver los médicos disponibles.</h5>
                    </div>
                )}
                {!showInitialMessage && filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <div className="card-custom">
                                <div className="d-flex align-items-center pt-4">
                                    <div className="ps-3">
                                        <img src={doctor.foto_perfil} alt={doctor.nombre} className="rounded-circle shadow-sm me-3" style={{ width: '6rem', height: '6rem', objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                        {doctor.destacado && (
                                            <span className="badge bg-warning text-dark me-2">
                                                DESTACADO
                                            </span>
                                        )}
                                        <Link to={`/doctor/${doctor.id}`} className="text-decoration-none">
                                            <h2 className="h5 text-dark fw-bold">{doctor.nombre} {doctor.apellido}</h2>
                                        </Link>
                                        <p className="text-secondary mb-0">{doctor.especialidad}</p>
                                        <div className="d-flex align-items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#00a4f4" className="bi bi-star-fill" viewBox="0 0 16 16">
                                                    <path d="M3.612 15.443c-.396.207-.873-.149-.746-.592l.83-4.73L.173 6.765c-.329-.32-.158-.888.283-.95l4.898-.696 2.034-4.372a.513.513 0 0 1 .924 0l2.034 4.372 4.898.696c.441.062.612.63.282.95l-3.524 3.356.83 4.73c.127.443-.35.799-.746.592L8 13.187l-4.389 2.256z" />
                                                </svg>
                                            ))}
                                            <span className="ms-2 text-secondary">{doctor.numero_de_resenas} Opiniones</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-secondary mb-1">Ciudad: {doctor.ciudad}</p>
                                    <p className="text-secondary mb-1">Costo de la consulta: {doctor.costo}</p>
                                    <p className="text-secondary mb-0">Dirección: {doctor.direccion}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    !showInitialMessage && (
                        <div className="col text-center">
                            <p>No se encontraron médicos con los filtros seleccionados.</p>
                        </div>
                    )
                )}
            </div>
            <div className="my-5">
                <ContactSection />
            </div>
        </div>
    );
};

export default DoctorsDirectory;
