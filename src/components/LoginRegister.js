import React, {useEffect, useState} from 'react';
import {Link, Navigate} from "react-router-dom";

import {toast} from "react-toastify";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {useDispatch} from 'react-redux';
import {updateUserToken} from '../redux/actions/userActions';
import LoginRegisterService from "../services/LoginRegisterService";
import Service from "../services/Service";

const LoginRegister = () => {
    const dispatch = useDispatch();

    const [user, setUser] = useState({});
    const [isLogin, setIsLogin] = useState(false);
    const [newUser, setNewUser] = useState({});
    const [isRegister, setIsRegister] = useState(false);

    const changeInputLogin = (event) => {
        const {name, value} = event.target;
        setUser({...user, [name]: value});
    }

    const changeInputRegister = (event) => {
        const {name, value} = event.target;
        setNewUser({...newUser, [name]: value});
    }

    /*const login = () => {

        LoginRegisterService.login(user)
            .then((response) => {
                localStorage.setItem("userToken", JSON.stringify(response.data))
                toast.success("Login successfully !");
                dispatch(updateUserToken(response.data));
                setIsLogin(true)
            })
            .catch((error) => {
                console.log(error);
                checkLogin(user);
            })
    }*/
    const login = async () => {
        try {
            const response = await LoginRegisterService.login(user);
            localStorage.setItem("userToken", JSON.stringify(response.data));
            console.log(response)
            localStorage.setItem("token" , response.data.token);
            localStorage.setItem("idAccount",response.data.id);
            toast.success("Login successfully!");
            dispatch(updateUserToken(response.data));
            setIsLogin(true);
        } catch (error) {
            console.error("Error:", error);
            await checkLogin(user);
        }
    }
    useEffect(() => {
        Service.profile().then((response)=>{
            localStorage.setItem("account",response.data)
            console.log(response.data)
        }).catch((error)=>{
        })
    }, [isLogin]);
    /*const register = () => {

        LoginRegisterService.register(newUser)
            .then((response) => {
                console.log(response.data)
                toast.success("Sign Up Success !")
                setIsRegister(true)
            })
            .catch((error) => {
                console.log(error)
                toast.error("Username/Email Already Used !")
            })
    }*/
    const register = async () => {
        try {
            const response = await LoginRegisterService.register(newUser);
            console.log(response.data);
            toast.success("Sign Up Success !");
            setIsRegister(true);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Username/Email Already Used !");
        }
    }

    /*const checkLogin = (user) => {
        LoginRegisterService.checkLogin(user)
            .then((response) => {
                if (response.data.includes("username")) {
                    toast.error("Wrong Username")
                }
                if (response.data.includes("password")) {
                    toast.error("Wrong Password")
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }*/
    const checkLogin = async (user) => {
        try {
            const response = await LoginRegisterService.checkLogin(user);
            if (response.data.includes("username")) {
                toast.error("Wrong Username");
            }
            if (response.data.includes("password")) {
                toast.error("Wrong Password");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    const findRegister = () => {
        document.getElementById("loginForm").style.display = 'none';
      document.getElementById("registerForm").style.display = 'block';
    }

    const validateSchemaLogin = Yup.object().shape({
        username: Yup.string()
            .matches(/^[a-zA-Z0-9]*$/, 'Username cannot contain special characters')
            .required("Username cannot be blank"),
        password: Yup.string()
            .required("Password cannot be blank")
            .notOneOf([' '], 'Password must not contain spaces'),
    })

    const validateSchemaRegister = Yup.object().shape({
        username: Yup.string()
            .required('Username cannot be blank')
            .matches(/^[a-zA-Z0-9]+$/, 'Username cannot contain special characters'),
        password: Yup.string()
            .required('Password cannot be blank')
            .min(6, 'Password must contain at least 6 characters')
            .max(32, 'Password must contain a maximum of 32 characters')
            .notOneOf([' '], 'Password must not contain spaces'),
        confirm: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Confirmation password must be the same as the password')
            .required('Password cannot be blank')
            .notOneOf([' '], 'Password must not contain spaces'),
        email: Yup.string()
            .required('Email cannot be blank')
            .email('Invalid email'),
        phone: Yup.string()
            .required('Phone number can not be left blank')
            .matches(/^[0-9]+$/, 'Phone numbers must contain only numbers'),
        birthday: Yup.string()
            .required('Date of birth cannot be left blank'),
        firstName: Yup.string()
            .required('FirstName cannot be blank')
            .matches(/^[a-zA-Z0-9\s]+$/, 'FirstName cannot contain special characters'),
        lastName: Yup.string()
            .required('LastName cannot be blank')
            .matches(/^[a-zA-Z0-9\s]+$/, 'LastName cannot contain special characters'),
    })

    return (
        <>
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
                                <div id="loginForm" className="log-reg-area sign">
                                    <h2 className="log-title">Login</h2>
                                    <Formik initialValues={
                                        {
                                            username: '',
                                            password: ''
                                        }
                                    }
                                            validationSchema={validateSchemaLogin}
                                            onSubmit={(values) => {
                                                login();
                                                console.log(values);
                                            }}>
                                        <Form>
                                            <div className="form-group">
                                                <Field type="text" id="input" name="username" required="required"
                                                       onInput={changeInputLogin}
                                                />
                                                <ErrorMessage name="username" component="div" className="text-danger"/>
                                                <label className="control-label" htmlFor="input">Username</label><i
                                                className="mtrl-select"></i>
                                            </div>
                                            <div className="form-group">
                                                <Field type="password" name="password" required="required"
                                                       onInput={changeInputLogin}
                                                />
                                                <ErrorMessage name="password" component="div" className="text-danger"/>
                                                <label className="control-label" htmlFor="input">Password</label><i
                                                className="mtrl-select"></i>
                                            </div>
                                            <Link to={"/"} className="forgot-pwd">
                                                Forgot Password?
                                            </Link>
                                            <div className="submit-btns">
                                                <button className="mtr-btn signin" type="submit">
                                                    <span>Login</span>
                                                </button>
                                                <span> </span>
                                                <button className="mtr-btn signup" onClick={()=> findRegister()} type="button"><span>Register</span>
                                                </button>
                                            </div>
                                        </Form>
                                    </Formik>
                                </div>
                                <div id="registerForm" className="log-reg-area reg">
                                    <h2 className="log-title" onClick={()=>findRegister()}>Register</h2>
                                    <Formik initialValues={
                                        // "firstName":"son",
                                        // "lastName":"ba",
                                        // "username":"nguyenbason",
                                        // "password":"Az123456",
                                        // "email":"vndcdsjcsd@gmail.com",
                                        // "phone":"0379951196",
                                        // "birthday":"2023-10-16"
                                        {
                                            username: '',
                                            password: '',
                                            confirm: '',
                                            email: '',
                                            phone: '',
                                            birthday: '',
                                            firstName: '',
                                            lastName: ''
                                        }
                                    }
                                            validationSchema={validateSchemaRegister}
                                            onSubmit={(values) => {
                                                register();
                                                console.log(values);
                                            }}
                                    >
                                        <Form>
                                            <div className="form-group">
                                                <Field name="firstName" type="text" required="required"
                                                       onInput={changeInputRegister}
                                                />
                                                <ErrorMessage name="firstName" component="div" className="text-danger"/>
                                                <label className="control-label" htmlFor="input">First Name</label><i
                                                className="mtrl-select"></i>
                                            </div>
                                            <div className="form-group">
                                                <Field name="lastName" type="text" required="required"
                                                       onInput={changeInputRegister}
                                                />
                                                <ErrorMessage name="lastName" component="div" className="text-danger"/>
                                                <label className="control-label" htmlFor="input">Last Name</label><i
                                                className="mtrl-select"></i>
                                            </div>
                                            <div className="form-group">
                                                <Field type="text" name="username" required="required"
                                                       onInput={changeInputRegister}
                                                />
                                                <ErrorMessage name="username" component="div" className="text-danger"/>
                                                <label className="control-label" htmlFor="input">Username</label><i
                                                className="mtrl-select"></i>
                                            </div>
                                            <div className="form-group">
                                                <Field type="password" name="password" required="required"
                                                       onInput={changeInputRegister}
                                                />
                                                <ErrorMessage name="password" component="div" className="text-danger"/>
                                                <label className="control-label" htmlFor="input">Password</label><i
                                                className="mtrl-select"></i>
                                            </div>
                                            <div className="form-group">
                                                <Field type="password" name="confirm" required="required"
                                                       onInput={changeInputRegister}
                                                />
                                                <ErrorMessage name="confirm" component="div" className="text-danger"/>
                                                <label className="control-label" htmlFor="input">Confirm
                                                    Password</label><i
                                                className="mtrl-select"></i>
                                            </div>
                                            <div className="form-group">
                                                <Field type="text" name="email" required="required"
                                                       onInput={changeInputRegister}
                                                />
                                                <ErrorMessage name="email" component="div" className="text-danger"/>
                                                <label className="control-label" htmlFor="input">Email</label><i
                                                className="mtrl-select"></i>
                                            </div>
                                            <div className="form-group">
                                                <Field type="text" name="phone" required="required"
                                                       onInput={changeInputRegister}
                                                />
                                                <ErrorMessage name="phone" component="div" className="text-danger"/>
                                                <label className="control-label" htmlFor="input">Phone</label><i
                                                className="mtrl-select"></i>
                                            </div>
                                            <div className="form-group">
                                                <Field type="date" name="birthday" required="required"
                                                       onInput={changeInputRegister}
                                                />
                                                <ErrorMessage name="birthday" component="div" className="text-danger"/>
                                                <label className="control-label" htmlFor="input">Birthday</label><i
                                                className="mtrl-select"></i>
                                            </div>
                                            <div className="checkbox">

                                            </div>
                                            <Link to={"/"} title="" className="already-have">
                                                Already have an account
                                            </Link>
                                            <div className="submit-btns">
                                                <button className="mtr-btn" type="submit">
                                                    <span>Register</span>
                                                </button>
                                            </div>
                                        </Form>
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLogin && <Navigate to="/home"/>}
            {isRegister && <Navigate to={"/"}/>}
        </>
    );
};

export default LoginRegister;