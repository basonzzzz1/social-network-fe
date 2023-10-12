import React from 'react';
import Header from "../Header";
import {Route, Routes} from "react-router-dom";
import SeeProfile from "../SeeProfile";

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