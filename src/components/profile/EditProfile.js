import React, { useEffect, useState, useRef } from 'react';
import Service from "../../services/Service";
import {Link, Navigate} from "react-router-dom";
import * as Yup from "yup";
import _ from 'lodash';
import {ErrorMessage, Field, Form, Formik} from "formik";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {updateUserToken} from "../../redux/actions/userActions";
import UserService from "../../services/UserService";
import LeftSideBarAbout from "../home/LeftSideBarAbout";
const EditProfile = () => {
    const [check, setCheck] = useState(true);
    const [account, setAccount] = useState({});
    const [load, setLoad] = useState(true);
    const [selectedGender, setSelectedGender] = useState(true);
    const userToken = useSelector((state) => state.userToken);
    const dispatch = useDispatch();

    const [user, setUser] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [isEditPW, setIsEditPW] = useState(false);

    // Create refs for input elements
    const inputRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const dateOfBirthRef = useRef();

    const handleGenderChange = (e) => {
        setSelectedGender(e.target.value);
    };

    useEffect(() => {
        Service.profile().then((response) => {
            setAccount(response.data);
            console.log(response.data);
        }).catch((error) => {
            setLoad(false);
        });
    }, [load]);
    const setCheckEditPassWord = () => {
        setCheck(false)
    }
    useEffect(() => {
        if(check === false){
            document.getElementById("oPassword").value = "";
            document.getElementById("nPassword").value = "";
            document.getElementById("confirm").value = "";
        }
    }, [check]);
    const setCheckEditInfor = () => {
        setCheck(true)
    }
    const editPassword = async () => {
        try {
            const response = await UserService.editPassword(user);
            console.log(response.data);
            const updatedUser = {...userToken, ...response.data};
            localStorage.setItem("userToken", JSON.stringify(updatedUser));
            dispatch(updateUserToken(response.data));
            toast.success("Edited Password successfully !");
            document.getElementById("oPassword").value = "";
            document.getElementById("nPassword").value = "";
            document.getElementById("confirm").value = "";
            setCheck(true)
        } catch (error) {
            console.error("Error:", error);
            toast.error("Editing Password failed !");
        }
    }

    const validateSchemaEditPassword = Yup.object().shape({
        oPassword: Yup.string()
            .required("Password cannot be blank")
            .notOneOf([' '], 'Password must not contain spaces'),
        nPassword: Yup.string()
            .required('Password cannot be blank')
            .min(6, 'Password must contain at least 6 characters')
            .max(32, 'Password must contain a maximum of 32 characters')
            .notOneOf([' '], 'Password must not contain spaces'),
        confirm: Yup.string()
            .oneOf([Yup.ref('nPassword'), null], 'Confirmation password must be the same as the password')
            .required('Password cannot be blank')
            .notOneOf([' '], 'Password must not contain spaces'),
    })
    const getUserById = async () => {
        try {
            const response = await UserService.getUserById(userToken.id);
            setUser(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const changeInputEdit = (event) => {
        const {name, value} = event.target;
        setUser({...user, [name]: value});
    }

    useEffect(() => {
        getUserById();
    }, []);
    const editUser = async () => {
        try {
            const response = await UserService.editUser(user);
            console.log(response.data);
            const updatedUser = {...userToken, ...response.data};
            localStorage.setItem("userToken", JSON.stringify(updatedUser));
            dispatch(updateUserToken(response.data));
            toast.success("Edited information successfully !");
            setIsEdit(true);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Editing information failed !");
        }
    }

    const validateSchemaEditInfo = Yup.object().shape({
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
        gender: Yup.string()
            .required('Gender cannot be blank'),
        address: Yup.string()
            .required('Address cannot be blank'),
    })

    return (
        <div>
            <section>
                <div className="feature-photo">
                    <figure><img src={userToken.thumbnail} alt="" style={{width: 1536, height: 449.783}}/></figure>
                    <div className="add-btn">
                        <span>1205 followers</span>
                        <a href="#" title="" data-ripple="">Add Friend</a>
                    </div>
                    <form className="edit-phto">
                        <i className="fa fa-camera-retro"></i>
                        <label className="fileContainer">
                            Edit Cover Photo
                            <input type="file"/>
                        </label>
                    </form>
                    <div className="container-fluid">
                        <div className="row merged">
                            <div className="col-lg-2 col-sm-3">
                                <div className="user-avatar">
                                    <figure>
                                        <img src={userToken.avatar} alt="" style={{width: 225.667, height: 220.817}}/>
                                            <form className="edit-phto">
                                                <i className="fa fa-camera-retro"></i>
                                                <label className="fileContainer">
                                                    Edit Display Photo
                                                    <input type="file"/>
                                                </label>
                                            </form>
                                    </figure>
                                </div>
                            </div>
                            <div className="col-lg-10 col-sm-9">
                                <div className="timeline-info">
                                    <ul>
                                        <li className="admin-name">
                                            <h5>{account.firstName} {account.lastName}</h5>
                                            <span>{account.email}</span>
                                        </li>
                                        <li>
                                            <a className="" href="time-line.html" title="" data-ripple="">time line</a>
                                            <a className="" href="timeline-photos.html" title="" data-ripple="">Photos</a>
                                            <a className="" href="timeline-videos.html" title="" data-ripple="">Videos</a>
                                            <a className="" href="timeline-friends.html" title="" data-ripple="">Friends</a>
                                            <a className="" href="groups.html" title="" data-ripple="">Groups</a>
                                            <a className="" href="about.html" title="" data-ripple="">about</a>
                                            <a className="active" href="#" title="" data-ripple="">more</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*// <!-- top area -->*/}
            {check ? (
            <section>
                <div className="gap gray-bg">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row" id="page-contents">
                                    <div className="col-lg-3">
                                        <aside className="sidebar static">
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
                                        </aside>
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="central-meta">
                                            <div className="editing-info">
                                                <h5 className="f-title"><i className="ti-info-alt"></i> Edit Basic
                                                    Information</h5>
                                                {!_.isEmpty(user) &&
                                                    <Formik initialValues={
                                                        {
                                                            firstName: user.firstName,
                                                            lastName: user.lastName,
                                                            email: user.email,
                                                            phone: user.phone,
                                                            birthday: user.birthday,
                                                            gender: user.gender,
                                                            address: user.address
                                                        }
                                                    }
                                                            validationSchema={validateSchemaEditInfo}
                                                            onSubmit={(values) => {
                                                                editUser();
                                                                console.log(values);
                                                            }}>
                                                        <Form>
                                                            <div className="form-group half">
                                                                <Field type="text" name="firstName"
                                                                       value={user.firstName}
                                                                       onInput={changeInputEdit} required="required"/>
                                                                <ErrorMessage name="firstName" component="div"
                                                                              className="text-danger"/>
                                                                <label className="control-label" htmlFor="input">First
                                                                    Name</label><i className="mtrl-select"></i>
                                                            </div>
                                                            <div className="form-group half">
                                                                <Field type="text" name="lastName" value={user.lastName}
                                                                       onInput={changeInputEdit} required="required"/>
                                                                <ErrorMessage name="lastName" component="div"
                                                                              className="text-danger"/>
                                                                <label className="control-label" htmlFor="input">Last
                                                                    Name</label><i className="mtrl-select"></i>
                                                            </div>
                                                            <div className="form-group">
                                                                <Field type="text" name="email" value={user.email}
                                                                       onInput={changeInputEdit} required="required"/>
                                                                <ErrorMessage name="email" component="div"
                                                                              className="text-danger"/>
                                                                <label className="control-label"
                                                                       htmlFor="input">Email</label><i
                                                                className="mtrl-select"></i>
                                                            </div>
                                                            <div className="form-group">
                                                                <Field type="text" name="phone" value={user.phone}
                                                                       onInput={changeInputEdit} required="required"/>
                                                                <ErrorMessage name="phone" component="div"
                                                                              className="text-danger"/>
                                                                <label className="control-label" htmlFor="input">Phone
                                                                    No.</label><i className="mtrl-select"></i>
                                                            </div>
                                                            <div className="form-group half">
                                                                <Field type="date" name="birthday" value={user.birthday}
                                                                       onInput={changeInputEdit} required="required"/>
                                                                <ErrorMessage name="birthday" component="div"
                                                                              className="text-danger"/>
                                                                <label className="control-label"
                                                                       htmlFor="input">Birthday</label><i
                                                                className="mtrl-select"></i>
                                                            </div>
                                                            <div className="form-group half">
                                                                <Field as="select" name="gender" value={user.gender}
                                                                       onChange={changeInputEdit} required="required">
                                                                    <option value="true">Male</option>
                                                                    <option value="false">Female</option>
                                                                </Field>
                                                                <ErrorMessage name="gender" component="div"
                                                                              className="text-danger"/>
                                                                <label className="control-label"
                                                                       htmlFor="input">Gender</label><i
                                                                className="mtrl-select"></i>
                                                            </div>
                                                            <div className="form-group">
                                                                <Field type="text" name="address" value={user.address}
                                                                       onInput={changeInputEdit} required="required"/>
                                                                <ErrorMessage name="address" component="div"
                                                                              className="text-danger"/>
                                                                <label className="control-label"
                                                                       htmlFor="input">Address</label><i
                                                                className="mtrl-select"></i>
                                                            </div>
                                                            <div className="submit-btns">
                                                                <Link to={"/profile/about"}
                                                                      className="mtr-btn"><span>Cancel</span></Link>
                                                                <span> </span>
                                                                <button className="mtr-btn" type="submit">
                                                                    <span>Update</span>
                                                                </button>
                                                            </div>
                                                        </Form>
                                                    </Formik>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>):
                ( <section>
                    <div className="gap gray-bg">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row" id="page-contents">
                                        <div className="col-lg-3">
                                            <aside className="sidebar static">
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
                                            </aside>
                                        </div>
                                        <div className="col-lg-8">
                                            <div className="central-meta">
                                                <div className="editing-info">
                                                    <h5 className="f-title"><i className="ti-lock"></i>Change Password</h5>
                                                    <Formik initialValues={
                                                        {
                                                            oPassword: '',
                                                            nPassword: '',
                                                            confirm: ''
                                                        }
                                                    }
                                                            validationSchema={validateSchemaEditPassword}
                                                            onSubmit={(values) => {
                                                                editPassword();
                                                                console.log(values);
                                                            }}
                                                    >
                                                        <Form>
                                                            <div className="form-group">
                                                                <Field type="password" name="oPassword" required="required" id={"oPassword"}
                                                                       onInput={changeInputEdit}/>
                                                                <ErrorMessage name="oPassword" component="div" className="text-danger"/>
                                                                <label className="control-label" htmlFor="input">Old
                                                                    password</label><i className="mtrl-select"></i>
                                                            </div>
                                                            <div className="form-group">
                                                                <Field type="password" name="nPassword" required="required" id={"nPassword"}
                                                                       onInput={changeInputEdit}/>
                                                                <ErrorMessage name="nPassword" component="div" className="text-danger"/>
                                                                <label className="control-label" htmlFor="input">New
                                                                    password</label><i className="mtrl-select"></i>
                                                            </div>
                                                            <div className="form-group">
                                                                <Field type="password" name="confirm" required="required" id={"confirm"}
                                                                       onInput={changeInputEdit}/>
                                                                <ErrorMessage name="confirm" component="div" className="text-danger"/>
                                                                <label className="control-label" htmlFor="input">Confirm
                                                                    password</label><i className="mtrl-select"></i>
                                                            </div>
                                                            <div className="submit-btns">
                                                                <Link to={"/profile/about"}
                                                                      className="mtr-btn"><span>Cancel</span>
                                                                </Link>
                                                                <span> </span>
                                                                <button type="submit" className="mtr-btn">
                                                                    <span>Update</span>
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
                        </div>
                    </div>
                </section>)}
            {isEdit && <Navigate to="/about"/>}
        </div>
    );
};

export default EditProfile;