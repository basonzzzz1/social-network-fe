import React from 'react';
import Header from "../Header";
import Profile from "../Profile";
import {Route, Routes} from "react-router-dom";

const ProfilePage = () => {
    return (
        <div>
            <Header/>
            <Routes>
                <Route path={"/"} element={<Profile/>}/>
            </Routes>
        </div>
    );
};

export default ProfilePage;