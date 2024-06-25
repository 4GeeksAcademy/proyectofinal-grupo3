import React from 'react';

const SpecialtyModal = ({ doctor, onClose }) => {
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 3 }}>
            <div className="bg-white box-shadow-blue p-4 rounded-element w-25">
                <h2 className="h4 fw-bold mb-3">Más detalles</h2>
                <p className="text-muted mb-2"><strong>Trabajo como:</strong> {doctor.especialidad}</p>
                <p className="text-muted mb-2"><strong>Especialista en:</strong></p>
                <ul className="list-styled d-flex flex-column align-items-start ps-3">
                    {doctor.especialidades_adicionales.map((especialidad, index) => (
                        <li key={index} className="text-muted">{especialidad.especialidades}</li>
                    ))}
                </ul>
                <div className="text-end mt-4">
                    <button
                        className="btn btn-search"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpecialtyModal;
