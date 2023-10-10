import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import Body from "../Body";
import ProfilePage from "./ProfilePage";

const HomePage = () => {
    return (
        <div>
                <Header />
                <Routes>
                    <Route path="/" element={<Body />} />
                    {/*<Route path="/profile" element={<ProfilePage />} />*/}
                </Routes>
            {/*<Footer />*/}
        </div>
    );
};

export default HomePage;
