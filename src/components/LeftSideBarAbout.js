import React from 'react';
import {Link} from "react-router-dom";

const LeftSideBarAbout = () => {
    return (
        <>
            <div className="widget">
                <h4 className="widget-title">Edit info</h4>
                <ul className="naves">
                    <li>
                        <i className="ti-info-alt"></i>
                        <Link to={"/profile/editInfo"}>Basic info</Link>
                    </li>
                    <li>
                        <i className="ti-lock"></i>
                        <a title="" href="edit-password.html">change password</a>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default LeftSideBarAbout;