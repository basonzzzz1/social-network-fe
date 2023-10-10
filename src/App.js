import React, {Suspense, lazy} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./components/NotFound";
import HomePage from "./components/routings/HomePage";
import ProfilePage from "./components/routings/ProfilePage";
import EditProfilePage from "./components/routings/EditProfilePage";
import userService from "./services/Service";
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const App = () => {
    let loggedIn = userService.isTheUserLoggedIn();
    return (
        <div>
            <Router>
                {/* header */}
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
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/home" element={<HomePage /> } />
                        <Route path="/profile" element={<ProfilePage/>}/>
                        <Route path="/editProfile" element={<EditProfilePage/>}/>

                        {/*{!loggedIn && <Route path="/home" element={<Navigate to="/login"/> } />}*/}
                        {/*{!loggedIn && <Route path="/profile" element={<Navigate to="/login"/>}/>}*/}
                        {/*{!loggedIn && <Route path="/editProfile" element={<Navigate to="/login"/>}/>}*/}
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
            </Router>
        </div>
    );
}

export default App;
