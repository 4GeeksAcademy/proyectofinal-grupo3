import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { HeroSection } from "./component/hero"
import { Footer } from "./component/footer";
import Signup from "./component/SignUp.jsx";
import RolSelector from "./component/RolSelector.jsx";

import DoctorsDirectory  from "./component/DoctorsDirectory.jsx";
import DoctorsDirectoryDetail from "./component/DoctorsDirectoryDetail.jsx";
import ContactSection from "./component/ContactSection.jsx";
import ProfileDoctor from "./component/ProfileDoctor.jsx";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element= {<Signup />} path="/SignUp" />
                        <Route element= {<RolSelector/>} path="/RolSelector" />

                        <Route path="/doctors" element={<DoctorsDirectory />} />
                        <Route path="/doctor/:id" element={<DoctorsDirectoryDetail />} />
                        <Route path="/contact" element={<ContactSection />} /> {/* Agrega esta ruta para el contacto */}
                        <Route path="/profile_doctor/:id" element={<ProfileDoctor />} />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
