import React, {useState} from 'react';
import {Link} from "react-router-dom";

const LeftSideBarAbout = () => {

    localStorage.setItem("checkEdit","true");
    const setCheckEditPassWord = () => {
        localStorage.setItem("checkEdit", "false");
    }

    const setCheckEditInfor = () => {
        localStorage.setItem("checkEdit", "true");
    }

    return (
        <>
            <div className="widget">
                <h4 className="widget-title">Edit info</h4>
                <ul className="naves">
                    <li>
                        <i className="ti-info-alt"></i>
                        <Link to={"#"} onClick={() => setCheckEditInfor()}>Basic info</Link>
                    </li>
                    <li>
                        <i className="ti-lock"></i>
                        <Link to={"#"} onClick={() => setCheckEditPassWord()}>change password</Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default LeftSideBarAbout;