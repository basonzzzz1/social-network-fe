import { Link, Navigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import Service from "../services/Service";

const Login = () => {
    const [account, setAccount] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const login = () => {
        const account = {
             username: document.getElementById("input").value,
            password: document.getElementById("passWork").value
        };
      Service.login(account).then((response)=>{
          localStorage.setItem("token", response.token);
          setIsLoggedIn(true);
      }).catch((error)=>{
          alert("tài khoản mật khẩu không chính xác !")
      })
    }
    useEffect(() => {
        Service.profile().then((response)=>{
            setAccount(response.data)
            localStorage.setItem("account",response.data)
            console.log(response.data)
        }).catch((error)=>{
        })
    }, [isLoggedIn]);
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
                                <div className="log-reg-area sign">
                                    <h2 className="log-title">Login</h2>
                                    <p>
                                        Don’t use Winku Yet? <a href="#" title="">Take the tour</a> or <a href="#" title="">Join now</a>
                                    </p>
                                    <form method="post">
                                        <div className="form-group">
                                            <input type="text" id="input" required="required"/>
                                            <label className="control-label" htmlFor="input">Username</label><i className="mtrl-select"></i>
                                        </div>
                                        <div className="form-group">
                                            <input type="password" required="required" id="passWork" />
                                            <label className="control-label" htmlFor="input">Password</label><i className="mtrl-select"></i>
                                        </div>
                                        <div className="checkbox">
                                            <label>
                                                <input type="checkbox" checked="checked"/><i className="check-box"></i>Always Remember Me.
                                            </label>
                                        </div>
                                        <a href="#" title="" className="forgot-pwd">Forgot Password?</a>
                                        <div className="submit-btns">
                                            <button className="mtr-btn signin" type="button" onClick={() => login()}><span>Login</span></button>
                                            <Link to={"/register"}>
                                                <button className="mtr-btn signup" type="button"><span>Register</span></button>
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoggedIn && <Navigate to="/home" />}
        </div>
    );
};

export default Login;