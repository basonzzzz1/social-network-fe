import React, {Suspense, lazy} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from "./components/NotFound";
import userService from "./services/Service";
import LoginRegister from "./components/LoginRegister";
import {Provider} from "react-redux";
import store from '../src/redux/store/store';
import About from "./components/About";
const SeeProfile = lazy(() => import('./components/SeeProfile'));
const Header = lazy(() => import('./components/Header'));
const Body = lazy(() => import('./components/Body'));
const Profile = lazy(() => import('./components/Profile'));
const EditProfile = lazy(() => import('./components/EditProfile'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));

const App = () => {
    let loggedIn = userService.isTheUserLoggedIn();
    return (
        <div>
            <Provider store={store}>
            <Router>
                {/*{loggedIn ? <Header/> : <></>}*/}
                <Suspense fallback={<div>
                    <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
                        <circle className="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000"
                                stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330"
                                stroke-linecap="round"></circle>
                        <circle className="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000"
                                stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110"
                                stroke-linecap="round"></circle>
                        <circle className="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000"
                                stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
                        <circle className="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000"
                                stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
                    </svg>
                </div>}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login"/>}/>
                        {/*<Route path="/login" element={<Login/>}/>*/}
                        <Route path={"/login"} element={<LoginRegister/>}></Route>
                        {/*<Route path="/register" element={<Register/>}/>*/}
                        <Route path="/home" element={
                            <React.Fragment>
                                <Header/>
                                <Body/>
                            </React.Fragment>
                        }/>
                        <Route path="/profile" element={
                            <React.Fragment>
                                <Header/>
                                <Profile/>
                            </React.Fragment>
                        }/>
                        <Route path="/editProfile" element={
                            <React.Fragment>
                                <Header/>
                                <EditProfile/>
                            </React.Fragment>
                        }/>
                        {
                            // nếu path là /seeProfile/:id router sẽ hiểu là một component bên trong một component
                            // còn khi là /:id nó sẽ hiểu là mỗi một một id khác nhau là một component khác nhau
                            // và sẽ không bị mất dữ liệu nữa
                            <Route path="/:id" element={
                                <React.Fragment>
                                    <Header/>
                                    <SeeProfile/>
                                </React.Fragment>
                            }/>
                        }
                        <Route path="/about" element={
                            <React.Fragment>
                                <Header/>
                                <About/>
                            </React.Fragment>
                        }/>


                        {/*<Route element={<Layout />}>*/}
                        {/*    /!* Nested routes within the Layout component *!/*/}
                        {/*    <Route path="/home" element={<Body />} />*/}
                        {/*    <Route path="/profile" element={<Profile />} />*/}
                        {/*    <Route path="/editProfile" element={<EditProfile />} />*/}
                        {/*    <Route path="/seeProfile/:id" element={<SeeProfile />} />*/}
                        {/*</Route>*/}


                        {/*<Route path="/home" element={<HomePage /> } />*/}
                        {/*<Route path="/profile" element={<ProfilePage/>}/>*/}
                        {/*<Route path="/editProfile" element={<EditProfilePage/>}/>*/}
                        {/*<Route path="/seeProfile/:id" element={<SeeProfile/>}/>*/}

                        {/*{idAccount !== null ? (*/}
                        {/*    <>*/}
                        {/*        <Route path="/home" element={<HomePage />} />*/}
                        {/*        <Route path="/profile" element={<ProfilePage />} />*/}
                        {/*        <Route path="/editProfile" element={<EditProfilePage />} />*/}
                        {/*    </>*/}
                        {/*) : null}*/}
                        {/*        <Route path="" element={<Body/>}/>*/}
                        {/*        <Route path="profile" element={<ProfilePage/>}/>*/}
                        {/*</Route>*/}
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </Suspense>
                <ToastContainer />
            </Router>
            </Provider>
        </div>
    );
};
const Layout = () => {
    return (
        <div>
            <Header />
            <Outlet /> {/* This will render nested routes */}
        </div>
    );
};

export default App;
