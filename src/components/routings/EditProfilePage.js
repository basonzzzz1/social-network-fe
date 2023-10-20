import React from 'react';
import Header from "../home/Header";
import {Route, Routes} from "react-router-dom";
import EditProfile from "../profile/EditProfile";

const EditProfilePage = () => {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<EditProfile />} />
            </Routes>
            {/*<Footer />*/}
        </div>
    );
};

export default EditProfilePage;