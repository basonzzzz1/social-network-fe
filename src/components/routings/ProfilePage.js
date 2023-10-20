import React from 'react';
import Header from "../home/Header";
import Profile from "../profile/Profile";
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