import React, { useState, useEffect } from 'react';
import agendaImage from '../../img/agenda.png'

const AppointmentForm = ({ doctor, onClose }) => {

    const today = new Date();
    const currentDayOfWeek = today.getDay();

    const [formData, setFormData] = useState({
        paciente: {},
        doctor: {},
        availabilities: [],
        message: '',
        appointmentDate: '',
    });

    const [selectedOption, setSelectedOption] = useState('')

    const checkAvailabilities = (availabilities) => {
        console.log(availabilities)

        const filteredAvailabilities = availabilities.filter(availability => {
            console.log(availability)
            console.log(currentDayOfWeek)
            const isFutureDay = availability.day_of_week > currentDayOfWeek && availability.day_of_week <= 5;
            const isTodayOrFuture = availability.day_of_week === currentDayOfWeek || isFutureDay;
            return !availability.is_booked && isTodayOrFuture;
        });

        if (filteredAvailabilities.length === 1) {
            setSelectedOption(filteredAvailabilities[0].id.toString())

        }
        return filteredAvailabilities
    };

    useEffect(() => {
        console.log(doctor);

        const fetchData = async () => {
            const token = localStorage.getItem("token")
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/appointments`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                console.log(doctor.availabilities)
                const filteredAvilabilities = checkAvailabilities(doctor.availabilities);


                console.log(filteredAvilabilities)
                setFormData(prevFormData => ({
                    ...prevFormData,
                    paciente: data.paciente,
                    doctor: doctor,
                    availabilities: filteredAvilabilities
                }));

            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };
        fetchData();


        /*setFormData(prevFormData => ({
            ...prevFormData,
            doctor: doctor,
            availabilities: filteredAvailabilities
        }));*/
    }, []);

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value)
    }


    const getDayName = (dayNumber) => {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];
        return days[dayNumber];
    };





    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedAppoinment = formData.availabilities.find(availability => availability.id === parseInt(selectedOption))
        console.log(selectedAppoinment)

        const today = new Date();

        const dayDifference = selectedAppoinment.day_of_week - currentDayOfWeek;
        const appointmentDate = new Date(today);
        appointmentDate.setDate(today.getDate() + dayDifference);
        const [hours, minutes, seconds] = selectedAppoinment.start_time.split(':');
        appointmentDate.setHours(hours, minutes, seconds);

        const timeZoneOffset = appointmentDate.getTimezoneOffset() * 60000;
        const caracasOffset = -4 * 60 * 60 * 1000;
        const adjustedDate = new Date(appointmentDate.getTime() + timeZoneOffset + caracasOffset);
        const formattedDate = adjustedDate.toISOString().replace('T', ' ').split('.')[0];
        console.log(formattedDate)

        const token = localStorage.getItem("token")

        const appointmentDetails = {
            doctor_id: formData.doctor.id,
            availability_id: selectedAppoinment.id,
            message: formData.message,
            appointment_date: formattedDate, // Aquí debería ser la fecha y hora seleccionada. 
            is_booked: true,
        };
        console.log(appointmentDetails)
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(appointmentDetails),
            });

            if (response.ok) {
                alert('Cita agendada con exito')
                const data = await response.json();
                console.log('Cita creada exitosamente:', data);
                onClose();
            } else {
                const errorData = await response.json();
                console.error('Error al crear la cita:', errorData);
            }
        } catch (error) {
            console.error('Error al crear la cita:', error);
        }
    };



    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-50" style={{ zIndex: 3 }}>
            <div className="bg-white p-4 rounded-element box-shadow-blue d-flex flex-column flex-md-row align-items-center w-90 w-md-100">
                <img
                    src={agendaImage}
                    alt="DoctorAgenda"
                    className="rounded-element w-50 w-md-50 mb-4 mb-md-0 me-md-4"
                />
                <div className="w-50">
                    <h2 className="h4 fw-bold mb-3 text-center gradient-text">Agendar cita con {formData.doctor?.nombre}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-muted d-block text-start">Disponibilidad</label>
                            <select onChange={handleSelectChange} value={selectedOption} className="form-select" aria-label="Default select example">

                                {formData.availabilities && formData.availabilities.map((availability, index) => {
                                    return <option key={availability.id} value={availability.id} disabled={availability.day_of_week < currentDayOfWeek || availability.day_of_week > 5}>
                                        {`${getDayName(availability.day_of_week)}: ${availability.start_time} - ${availability.end_time}`}
                                    </option>
                                })}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted d-block text-start">Paciente</label>
                            <input
                                type="text"
                                value={`${formData.paciente.nombre} ${formData.paciente.apellido}`}
                                className="form-control"
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted d-block text-start">Mensaje</label>
                            <input
                                type="text"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="button" onClick={onClose} className="btn btn-cancelar box-shadow-blue me-5 px-4">
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
};

export default AppointmentForm;

