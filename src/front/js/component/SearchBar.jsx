import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';


const SearchBar = () => {
    //const doctors = require("../../../../public/doctors.json");
    const { store, actions } = useContext(Context);
    const [specialty, setSpecialty] = useState('');
    const [city, setCity] = useState('');
    const [specialties, setSpecialties] = useState([]);
    const [cities, setCities] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        if (store.doctors.length === 0) {
            actions.fetchDoctors();
        }
    }, []);

    useEffect(() => {
        if (store.doctors.length > 0) {
            //crea un arreglo con todas las especialidades de los doctores.
            //elimina duplicados, dejando solo especialidades únicas.
            //convierte el Set de nuevo a un arreglo.
            const uniqueSpecialties = [...new Set(store.doctors.map(doctor => doctor.especialidad))];
            const uniqueCities = [...new Set(store.doctors.map(doctor => doctor.ciudad))];
            //Estas funciones actualizan el estado local del componente con las especialidades y ciudades únicas.
            setSpecialties(uniqueSpecialties);
            setCities(uniqueCities);
        }
    }, [store.doctors]);


    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/doctors?specialty=${specialty}&city=${city}`);
    };

    return (
        <div className="container-fluid">
            <form className="d-flex" onSubmit={handleSearch}>
                <select
                    value={specialty}
                    onChange={e => setSpecialty(e.target.value)}
                    className="form-select border p-2 rounded-md me-3"
                >
                    <option value="">Selecciona una especialidad</option>
                    {specialties.map((spec, index) => (
                        <option key={index} value={spec}>{spec}</option>
                    ))}
                </select>
                <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="form-select border p-2 rounded-md"
                >
                    <option value="">Selecciona una ciudad</option>
                    {cities.map((city, index) => (
                        <option key={index} value={city}>{city}</option>
                    ))}
                </select>
                <button type="submit" className="btn btn-search px-5 ms-2">
                    <div className='d-flex flex-row align-items-center'>
                        <span>Buscar</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-arrow-right-circle ms-2" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="8" fill="white" />
                            <path fillRule="evenodd" d="M4.5 8a.5.5 0 0 1 .5-.5h4.793L8.146 5.854a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L9.793 8.5H5a.5.5 0 0 1-.5-.5z" fill="#00a4f4" />
                        </svg>
                    </div>
                </button>
            </form>
        </div>
    );
}

export default SearchBar;
