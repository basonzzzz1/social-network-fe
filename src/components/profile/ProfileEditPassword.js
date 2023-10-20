// import React, {useState} from 'react';
// import {Link, Navigate} from "react-router-dom";
// import {useDispatch, useSelector} from "react-redux";
// import {toast} from "react-toastify";
// import * as Yup from "yup";
// import {ErrorMessage, Field, Form, Formik} from "formik";
// import {updateUserToken} from "../../redux/actions/userActions";
// import UserService from "../../services/UserService";
// import LeftSideBarAbout from "../home/LeftSideBarAbout";
//
// const ProfileEditPassword = () => {
//     const userToken = useSelector((state) => state.userToken);
//     const dispatch = useDispatch();
//
//     const [user, setUser] = useState({id: userToken.id});
//     const [isEdit, setIsEdit] = useState(false);
//
//     const changeInputEdit = (event) => {
//         const {name, value} = event.target;
//         setUser({...user, [name]: value});
//     }
//
//     const editPassword = async () => {
//         try {
//             const response = await UserService.editPassword(user);
//             console.log(response.data);
//             const updatedUser = {...userToken, ...response.data};
//             localStorage.setItem("userToken", JSON.stringify(updatedUser));
//             dispatch(updateUserToken(response.data));
//             toast.success("Edited Password successfully !");
//             setIsEdit(true);
//         } catch (error) {
//             console.error("Error:", error);
//             toast.error("Editing Password failed !");
//         }
//     }
//
//     const validateSchemaEditPassword = Yup.object().shape({
//         oPassword: Yup.string()
//             .required("Password cannot be blank")
//             .notOneOf([' '], 'Password must not contain spaces'),
//         nPassword: Yup.string()
//             .required('Password cannot be blank')
//             .min(6, 'Password must contain at least 6 characters')
//             .max(32, 'Password must contain a maximum of 32 characters')
//             .notOneOf([' '], 'Password must not contain spaces'),
//         confirm: Yup.string()
//             .oneOf([Yup.ref('nPassword'), null], 'Confirmation password must be the same as the password')
//             .required('Password cannot be blank')
//             .notOneOf([' '], 'Password must not contain spaces'),
//     })
//     return (
//         <>
//             <section>
//                 <div className="gap gray-bg">
//                     <div className="container-fluid">
//                         <div className="row">
//                             <div className="col-lg-12">
//                                 <div className="row" id="page-contents">
//                                     <div className="col-lg-3">
//                                         <aside className="sidebar static">
//                                             <LeftSideBarAbout/>
//                                         </aside>
//                                     </div>
//                                     <div className="col-lg-8">
//                                         <div className="central-meta">
//                                             <div className="editing-info">
//                                                 <h5 className="f-title"><i className="ti-lock"></i>Change Password</h5>
//                                                 <Formik initialValues={
//                                                     {
//                                                         oPassword: '',
//                                                         nPassword: '',
//                                                         confirm: ''
//                                                     }
//                                                 }
//                                                         validationSchema={validateSchemaEditPassword}
//                                                         onSubmit={(values) => {
//                                                             editPassword();
//                                                             console.log(values);
//                                                         }}
//                                                 >
//                                                     <Form>
//                                                         <div className="form-group">
//                                                             <Field type="password" name="oPassword" required="required"
//                                                                    onInput={changeInputEdit}/>
//                                                             <ErrorMessage name="oPassword" component="div" className="text-danger"/>
//                                                             <label className="control-label" htmlFor="input">Old
//                                                                 password</label><i className="mtrl-select"></i>
//                                                         </div>
//                                                         <div className="form-group">
//                                                             <Field type="password" name="nPassword" required="required"
//                                                                    onInput={changeInputEdit}/>
//                                                             <ErrorMessage name="nPassword" component="div" className="text-danger"/>
//                                                             <label className="control-label" htmlFor="input">New
//                                                                 password</label><i className="mtrl-select"></i>
//                                                         </div>
//                                                         <div className="form-group">
//                                                             <Field type="password" name="confirm" required="required"
//                                                                    onInput={changeInputEdit}/>
//                                                             <ErrorMessage name="confirm" component="div" className="text-danger"/>
//                                                             <label className="control-label" htmlFor="input">Confirm
//                                                                 password</label><i className="mtrl-select"></i>
//                                                         </div>
//                                                         <div className="submit-btns">
//                                                             <Link to={"/profile/about"}
//                                                                   className="mtr-btn"><span>Cancel</span>
//                                                             </Link>
//                                                             <span> </span>
//                                                             <button type="submit" className="mtr-btn">
//                                                                 <span>Update</span>
//                                                             </button>
//                                                         </div>
//                                                     </Form>
//                                                 </Formik>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             {isEdit && <Navigate to="/profile/about"/>}
//         </>
//     );
// };
//
// export default ProfileEditPassword;