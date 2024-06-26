import React, { useState, useEffect } from 'react';

const AppointmentForm = ({ onClose }) => {
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/appointments`);
                const data = await response.json();
                const filteredAvailabilities = data.doctor.availabilities.filter(availability => {
                    const isFutureDay = availability.day_of_week > currentDayOfWeek && availability.day_of_week <= 5;
                    const isTodayOrFuture = availability.day_of_week === currentDayOfWeek || isFutureDay;
                    return !availability.is_booked && isTodayOrFuture;
                });

                setFormData(prevFormData => ({
                    ...prevFormData,
                    paciente: data.paciente,
                    doctor: data.doctor,
                    availabilities: filteredAvailabilities
                }));
                if (filteredAvailabilities.length === 1) {
                    setSelectedOption(filteredAvailabilities[0].id.toString())
                    console.log(filteredAvailabilities[0].id.toString())
                    console.log(filteredAvailabilities)
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };
        fetchData();

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
                },
                body: JSON.stringify(appointmentDetails),
            });

            if (response.ok) {
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
                    src="https://s3-alpha-sig.figma.com/img/d644/d085/17d322a1229d3f38b1cd1c71f7fbd812?Expires=1719187200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=R7Mk9HXigfYjBoOOgy8CzjScZAH7vCpaRvwtagrHbjZqzqnfg3ORFE-7XlKikVGUQIASvEdfDnJNQLR8w~Nujdq1f2YerI6psS3y13q~zjzoiXNVip2GwMgiZPE0eVr8d~L~6xSTROgBbZ2MUnCILr2XfLGkYwaSsksKuwCPGA8FCw5IlT5AA6bC0LA-Ee2n4Eb0tophbZXtD6NmuPQ0owx~ujB52UcNSvdctw1U9hQcbxXRjOuzVcE6ZKZbeR08sADr7ghHMZqLjGH4lcTmgkaT2h5CVU42DQr6jvuy3tzQSzyuZdYRtZkmW5MVf1YPA8O7cMZEWtExbyozpenSZw__"
                    alt="DoctorAgenda"
                    className="rounded-element w-50 w-md-50 mb-4 mb-md-0 me-md-4"
                />
                <div className="w-50">
                    <h2 className="h4 fw-bold mb-3 text-center gradient-text">Agendar cita con {formData.doctor.nombre}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-muted d-block text-start">Disponibilidad</label>
                            <select onChange={handleSelectChange} value={selectedOption} className="form-select" aria-label="Default select example">
                                {formData.availabilities.map((availability, index) => {
                                    return <option key={availability.id} value={availability.id} disabled={availability.day_of_week < currentDayOfWeek || availability.day_of_week > 5}>
                                        {`${getDayName(availability.day_of_week)}: ${availability.start_time} - ${availability.end_time}`}
                                    </option>

                                })}

                            </select>
                            {/* <input
                                type="text"
                                value={`Doctor ${formData.doctor.nombre} para el día ${formData.availability.day_of_week} comienza: ${formData.availability.start_time} termina: ${formData.availability.end_time}`}
                                className="form-control"
                                disabled
                            /> */}
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
                        {/* <div className="mb-3">
                            <label className="form-label text-muted d-block text-start">Fecha de la Cita</label>
                            <input
                                type="datetime-local"
                                value={formData.appointmentDate}
                                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                                className="form-control"
                                required
                            />
                        </div> */}
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

























/*import React, { useState } from 'react';

const AppointmentForm = ({ doctor, onClose }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');*/

/*const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica de envío del formulario, como hacer una solicitud POST a un servidor
    console.log('Appointment details:', { name, date, time, doctor: doctor.name, reason });
    onClose();
};*/


/*const handleSubmit = async (e) => {
    e.preventDefault();

    // Convertir la fecha y hora a un formato adecuado para el backend
    const appointmentDate = new Date(`${date}T${time}`);

    // Crear el objeto con los detalles de la cita
    const appointmentDetails = {
        doctor_id: doctor.id,
        availability_id: 1, // Cambia este valor al id de disponibilidad adecuado
        message: reason,
        appointment_date: appointmentDate.toISOString()
    };

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentDetails)
        });

        if (response.ok) {
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

export default AppointmentForm;*/
