import React, {useEffect, useState} from 'react';
import Service from "../../services/Service";
import {useSelector} from "react-redux";

const About = () => {
    const [account, setAccount] = useState({});
    const [load, setLoad] = useState(true);
    const userToken = useSelector((state) => state.userToken);
    useEffect(() => {
        Service.profile().then((response)=>{
            setAccount(response.data)
            console.log(response.data)
        }).catch((error)=>{
            setLoad(false)
        })
    }, [load]);
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
                                            <a className="" href="timeline-groups.html" title="" data-ripple="">Groups</a>
                                            <a className="active" href="about.html" title="" data-ripple="">about</a>
                                            <a className="" href="#" title="" data-ripple="">more</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
                                                        <a title="" href="edit-profile-basic.html">Basic info</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-mouse-alt"></i>
                                                        <a title="" href="edit-work-eductation.html">Education &amp; Work</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-heart"></i>
                                                        <a title="" href="edit-interest.html">My interests</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-settings"></i>
                                                        <a title="" href="edit-account-setting.html">account setting</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-lock"></i>
                                                        <a title="" href="edit-password.html">change password</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="widget">
                                                <h4 className="widget-title">Socials</h4>
                                                <ul className="socials">
                                                    <li className="facebook">
                                                        <a title="" href="#"><i className="fa fa-facebook"></i> <span>facebook</span> <ins>45 likes</ins></a>
                                                    </li>
                                                    <li className="twitter">
                                                        <a title="" href="#"><i className="fa fa-twitter"></i> <span>twitter</span><ins>25 likes</ins></a>
                                                    </li>
                                                    <li className="google">
                                                        <a title="" href="#"><i className="fa fa-google"></i> <span>google</span><ins>35 likes</ins></a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </aside>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="central-meta">
                                            <div className="about">
                                                <div className="personal">
                                                    <h5 className="f-title"><i className="ti-info-alt"></i> Personal
                                                        Info</h5>
                                                </div>
                                                <div className="d-flex flex-row mt-2">
                                                    <ul className="nav nav-tabs nav-tabs--vertical nav-tabs--left">
                                                        <li className="nav-item">
                                                            <a href="#basic" className="nav-link active"
                                                               data-toggle="tab">Basic info</a>
                                                        </li>
                                                    </ul>
                                                    <div className="tab-content">
                                                        <div className="tab-pane fade show active" id="basic">
                                                            <ul className="basics">
                                                                <li><i
                                                                    className="ti-user"></i>{userToken.firstName} {userToken.lastName}
                                                                </li>
                                                                <li><i className="ti-calendar"></i>{userToken.birthday}
                                                                </li>
                                                                <li><i
                                                                    className="ti-id-badge"></i>{userToken.gender ? 'Male' : 'Female'}
                                                                </li>
                                                                <li><i className="ti-map-alt"></i>{userToken.address}
                                                                </li>
                                                                <li><i className="ti-mobile"></i>{userToken.phone}</li>
                                                                <li><i className="ti-email"></i><a
                                                                    href="https://wpkixx.com/cdn-cgi/l/email-protection"
                                                                    className="__cf_email__"
                                                                    data-cfemail="3c4553494e515d55507c59515d5550125f5351">{userToken.email}</a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-3">
                                        <aside class="sidebar static">
                                            <div class="widget">
                                                <h4 class="widget-title">Your page</h4>
                                                <div class="your-page">
                                                    <figure>
                                                        <a title="" href="#"><img alt="" src="images/resources/friend-avatar9.jpg"/></a>
                                                    </figure>
                                                    <div class="page-meta">
                                                        <a class="underline" title="" href="#">My page</a>
                                                        <span><i class="ti-comment"></i>Messages <em>9</em></span>
                                                        <span><i class="ti-bell"></i>Notifications <em>2</em></span>
                                                    </div>
                                                    <div class="page-likes">
                                                        <ul class="nav nav-tabs likes-btn">
                                                            <li class="nav-item"><a data-toggle="tab" href="#link1" class="active">likes</a></li>
                                                            <li class="nav-item"><a data-toggle="tab" href="#link2" class="">views</a></li>
                                                        </ul>
                                                        <div class="tab-content">
                                                            <div id="link1" class="tab-pane active fade show">
                                                                <span><i class="ti-heart"></i>884</span>
                                                                <a title="weekly-likes" href="#">35 new likes this week</a>
                                                                <div class="users-thumb-list">
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="Anderw">
                                                                        <img alt="" src="images/resources/userlist-1.jpg"/>
                                                                    </a>
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="frank">
                                                                        <img alt="" src="images/resources/userlist-2.jpg"/>
                                                                    </a>
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="Sara">
                                                                        <img alt="" src="images/resources/userlist-3.jpg"/>
                                                                    </a>
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="Amy">
                                                                        <img alt="" src="images/resources/userlist-4.jpg"/>
                                                                    </a>
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="Ema">
                                                                        <img alt="" src="images/resources/userlist-5.jpg"/>
                                                                    </a>
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="Sophie">
                                                                        <img alt="" src="images/resources/userlist-6.jpg"/>
                                                                    </a>
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="Maria">
                                                                        <img alt="" src="images/resources/userlist-7.jpg"/>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div id="link2" class="tab-pane fade">
                                                                <span><i class="ti-eye"></i>445</span>
                                                                <a title="weekly-likes" href="#">440 new views this week</a>
                                                                <div class="users-thumb-list">
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="Anderw">
                                                                        <img alt="" src="images/resources/userlist-1.jpg"/>
                                                                    </a>
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="frank">
                                                                        <img alt="" src="images/resources/userlist-2.jpg"/>
                                                                    </a>
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="Sara">
                                                                        <img alt="" src="images/resources/userlist-3.jpg"/>
                                                                    </a>
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="Amy">
                                                                        <img alt="" src="images/resources/userlist-4.jpg"/>
                                                                    </a>
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="Ema">
                                                                        <img alt="" src="images/resources/userlist-5.jpg"/>
                                                                    </a>
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="Sophie">
                                                                        <img alt="" src="images/resources/userlist-6.jpg"/>
                                                                    </a>
                                                                    <a data-toggle="tooltip" title="" href="#" data-original-title="Maria">
                                                                        <img alt="" src="images/resources/userlist-7.jpg"/>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="widget stick-widget">
                                                <h4 class="widget-title">Who's follownig</h4>
                                                <ul class="followers">
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar2.jpg" alt=""/></figure>
                                                        <div class="friend-meta">
                                                            <h4><a href="time-line.html" title="">Kelly Bill</a></h4>
                                                            <a href="#" title="" class="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar4.jpg" alt=""/></figure>
                                                        <div class="friend-meta">
                                                            <h4><a href="time-line.html" title="">Issabel</a></h4>
                                                            <a href="#" title="" class="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar6.jpg" alt=""/></figure>
                                                        <div class="friend-meta">
                                                            <h4><a href="time-line.html" title="">Andrew</a></h4>
                                                            <a href="#" title="" class="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar8.jpg" alt=""/></figure>
                                                        <div class="friend-meta">
                                                            <h4><a href="time-line.html" title="">Sophia</a></h4>
                                                            <a href="#" title="" class="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar3.jpg" alt=""/></figure>
                                                        <div class="friend-meta">
                                                            <h4><a href="time-line.html" title="">Allen</a></h4>
                                                            <a href="#" title="" class="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </aside>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;