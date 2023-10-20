import React, {useState} from 'react';
import {Link, Navigate} from "react-router-dom";
import Service from "../../services/Service";
// import fs from "fs";
// import * as fs from "fs"
const Register = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedGender, setSelectedGender] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleGenderChange = (e) => {
        setSelectedGender(e.target.value);
    };
    const register = () => {
        let file = document.getElementById("file").files[0];
        console.log(document.getElementById("file").files);
        let data = new FormData();
        let firstName =  document.getElementById("firstName").value;
        let lastName = document.getElementById("lastName").value
        let username =  document.getElementById("username").value;
        let password = document.getElementById("password").value
        let email = document.getElementById("email").value;
        let gender = selectedGender;
        let phone =  document.getElementById("phoneNumber").value;
        data.append("file",file);
        data.append('firstName',firstName);
        data.append('lastName', lastName);
        data.append('username',username);
        data.append('password', password);
        data.append('email',email );
        data.append('gender', gender);
        const birthday = document.getElementById("dateOfBirth").value;
        data.append('birthday', birthday);
        data.append('phone',phone);
        Service.register(data).then((response)=>{
            alert("đăng ký thành công !")
            console.log(response)
            setIsLoggedIn(true);
        }).catch((error)=>{
            console.log(error)
            alert("đăng ký thất bại !")
        })
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
                document.getElementById("selectedImage").style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImage(null);
            document.getElementById("selectedImage").style.display = 'none';
        }
    };
    var popup = document.getElementById("popup");

    return (
        <div>
            <div className="theme-layout">
                <div className="container-fluid pdng0">
                    <div className="row merged">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div className="land-featurearea">
                                <div className="land-meta">
                                    <h1>Four Life</h1>
                                    <p>
                                        Four Life is team 3 dev =).
                                    </p>
                                    <div className="friend-logo">
                                        <span><img src="images/logo2.png" alt=""/></span>
                                    </div>
                                    <a href="#" title="" className="folow-me">Follow Us on Team 3 CodeGym</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div className="login-reg-bg">
                                <div className="log-reg-area ">
                                    <h2 className="log-title">Register</h2>
                                    <form method="post">
                                        <div className="merge">
                                            <div className="form-group">
                                                <input type="text" required="required" id="firstName"/>
                                                <label className="control-label" htmlFor="input">First Name</label><i className="mtrl-select"></i>
                                            </div>
                                            <div className="form-group">
                                                <input type="text" required="required" id="lastName"/>
                                                <label className="control-label" htmlFor="input">Last Name</label><i className="mtrl-select"></i>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" id="username" required="required"/>
                                            <label className="control-label" htmlFor="input">User Name</label><i className="mtrl-select"></i>
                                        </div>
                                        <div className="merge">
                                            <div className="form-group">
                                                <input type="password" id="password" required="required"/>
                                                <label className="control-label" htmlFor="input">Password</label><i className="mtrl-select"></i>
                                            </div>
                                            <div className="form-group">
                                                <input type="password" id="confirmPassword" required="required"/>
                                                <label className="control-label" htmlFor="input">Confirm Password</label><i className="mtrl-select"></i>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <input type="date" id="dateOfBirth" required="required"/>
                                            <label className="control-label" htmlFor="input">Date Of Birth</label><i className="mtrl-select"></i>
                                        </div>
                                        <div className="merge">
                                            <div className="form-group">
                                                <input type="text" id="phoneNumber" required="required"/>
                                                <label className="control-label" htmlFor="input">Phone Number</label><i className="mtrl-select"></i>
                                            </div>
                                            <div className="form-radio" id="gender">
                                                <div className="radio">
                                                    <label>
                                                        <input type="radio" name="radio" value={true}  checked={selectedGender === true} onChange={handleGenderChange}/><i className="check-box"></i>Male
                                                    </label>
                                                </div>
                                                <div className="radio" id="radio-2">
                                                    <label>
                                                        <input type="radio" name="radio" value={false} checked={selectedGender === false} onChange={handleGenderChange}/><i className="check-box"></i>Female
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" required="required" id="email"/>
                                            <label className="control-label" htmlFor="input"><a href="https://wpkixx.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="6c29010d05002c">[email&#160;protected]</a></label><i className="mtrl-select"></i>
                                        </div>
                                        <div className="form-group">
                                            <input type="file" id="file" accept="image/*" onChange={handleFileChange} />
                                            <label className="control-label" htmlFor="file">Upload Profile Picture</label><i className="mtrl-select"></i>
                                        </div>
                                        <img src={selectedImage} alt="Selected Image" id="selectedImage" style={{ display: 'none' }} />
                                        <div className="submit-btns">
                                            <button className="mtr-btn signup" type="button" onClick={() => register()}><span>Register</span></button>
                                            <Link to={"/login"}>
                                                <button className="mtr-btn signup" type="button"><span>Login</span></button>
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoggedIn && <Navigate to="/login" />}
        </div>
    );
};

export default Register;