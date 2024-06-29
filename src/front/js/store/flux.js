const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            doctors: [],
            doctorDetail: null,
            message: null,
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                }
            ]
        },
        actions: {
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            fetchDoctors: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/doctors`, {
                        headers:{
                            'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        }
                        
                    } );
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log("Se ejecuto fetch doctors")
                    setStore({ doctors: data });
                    
                } catch (error) {
                    console.error("Error fetching doctors:", error);
                }
            },

            fetchDoctorDetail: async (id) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/doctors/${id}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setStore({ doctorDetail: data });
                } catch (error) {
                    console.error(`Error fetching doctor with ID ${id}:`, error);
                }
            },

            getMessage: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/hello");
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },

            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo: demo });
            }
        }
    };
};

export default getState;
