import React from 'react';
import Header from "../home/Header";
import {Route, Routes} from "react-router-dom";
import SeeProfile from "../profile/SeeProfile";

const SeeProfilePage = () => {
    return (
        <div>
            <Header/>
            <Routes>
                <Route path={"/:id"} element={<SeeProfile/>}/>
            </Routes>
        </div>
    );
};

export default SeeProfilePage;