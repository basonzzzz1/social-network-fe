import React, { useEffect, useState, useRef } from 'react';
import Service from "../services/Service";

const EditProfile = () => {
    const [account, setAccount] = useState({});
    const [load, setLoad] = useState(true);
    const [selectedGender, setSelectedGender] = useState(true);

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

    const editProfile = (id) => {
        let data = new FormData();
        let firstName = inputRef.current.value;
        let lastName = lastNameRef.current.value;
        let email = emailRef.current.value;
        let phone = phoneRef.current.value;

        data.append("file", "");
        data.append('firstName', firstName);
        data.append('lastName', lastName);
        data.append('email', email);
        data.append('gender', selectedGender);
        const birthday = dateOfBirthRef.current.value;
        data.append('birthday', birthday);
        data.append('phone', phone);

        Service.editProfile(data, account.id).then((response) => {
            alert("Thành công!");
            console.log(response);
        }).catch((error) => {
            console.log(error);
            alert("Thất bại!");
        });
    };

    return (
        <div>
            <section>
                <div className="feature-photo">
                    <figure><img src="images/resources/timeline-1.jpg" alt=""/></figure>
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
                                        <img src={`images/profile/`+account.avatar} alt=""/>
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
                                            <h5>Janice Griffith</h5>
                                            <span>Group Admin</span>
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

            <section>
                <div className="gap gray-bg">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row" id="page-contents">
                                    <div className="col-lg-3">
                                        <aside className="sidebar static">
                                            <div className="widget">
                                                <h4 className="widget-title">Recent Activity</h4>
                                                <ul className="activitiez">
                                                    <li>
                                                        <div className="activity-meta">
                                                            <i>10 hours Ago</i>
                                                            <span><a title="" href="#">Commented on Video posted </a></span>
                                                            <h6>by <a href="time-line.html">black demon.</a></h6>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="activity-meta">
                                                            <i>30 Days Ago</i>
                                                            <span><a title="" href="#">Posted your status. “Hello guys, how are you?”</a></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="activity-meta">
                                                            <i>2 Years Ago</i>
                                                            <span><a title="" href="#">Share a video on her timeline.</a></span>
                                                            <h6>"<a href="#">you are so funny mr.been.</a>"</h6>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="widget stick-widget">
                                                <h4 className="widget-title">Edit info</h4>
                                                <ul className="naves">
                                                    <li>
                                                        <i className="ti-info-alt"></i>
                                                        <a href="edit-profile-basic.html" title="">Basic info</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-mouse-alt"></i>
                                                        <a href="edit-work-eductation.html" title="">Education & Work</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-heart"></i>
                                                        <a href="edit-interest.html" title="">My interests</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-settings"></i>
                                                        <a href="edit-account-setting.html" title="">account setting</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-lock"></i>
                                                        <a href="edit-password.html" title="">change password</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/*/<!-- settings widget -->*/}
                                        </aside>
                                    </div>
                                    {/*// <!-- sidebar -->*/}
                                    <div className="col-lg-6">
                                        <div className="central-meta">
                                            <div className="editing-info">
                                                <h5 className="f-title"><i className="ti-info-alt"></i> Edit Basic Information</h5>



                                                <form method="post">
                                                    <div className="form-group half">
                                                        <input type="text" ref={inputRef} required="required" />
                                                        <label className="control-label" htmlFor="input">First Name</label><i className="mtrl-select"></i>
                                                    </div>
                                                    <div className="form-group half">
                                                        <input type="text" ref={lastNameRef} required="required" />
                                                        <label className="control-label" htmlFor="input">Last Name</label><i className="mtrl-select"></i>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="text" ref={emailRef} required="required" />
                                                        <label className="control-label" htmlFor="input">
                                                            <a href="https://wpkixx.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="4b0e262a22270b">[email&#160;protected]</a>
                                                        </label><i className="mtrl-select"></i>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="text" ref={phoneRef} required="required" />
                                                        <label className="control-label" htmlFor="input">Phone No.</label><i className="mtrl-select"></i>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="date" ref={dateOfBirthRef} required="required" />
                                                        <label className="control-label" htmlFor="input">Date Of Birth</label><i className="mtrl-select"></i>
                                                    </div>
                                                    {/* Rest of your JSX code */}
                                                    <div className="form-radio" id="gender">
                                                        <div className="radio">
                                                            <label>
                                                                <input type="radio" name="radio" value={true} checked={selectedGender === true} onChange={handleGenderChange} /><i className="check-box"></i>Male
                                                            </label>
                                                        </div>
                                                        <div className="radio" id="radio-2">
                                                            <label>
                                                                <input type="radio" name="radio" value={false} checked={selectedGender === false} onChange={handleGenderChange} /><i className="check-box"></i>Female
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="text" required="required" />
                                                        <label className="control-label" htmlFor="input">City</label><i className="mtrl-select"></i>
                                                    </div>
                                                    <div className="submit-btns">
                                                        <button type="button" className="mtr-btn"><span>Cancel</span></button>
                                                        <button type="button" id="hv-1" className="mtr-btn" onClick={() => editProfile()}><span>Update</span></button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    {/*// <!-- centerl meta -->*/}
                                    <div className="col-lg-3">
                                        <aside className="sidebar static">
                                            <div className="widget">
                                                <h4 className="widget-title">Your page</h4>
                                                <div className="your-page">
                                                    <figure>
                                                        <a title="" href="#"><img alt="" src="images/resources/friend-avatar9.jpg"/></a>
                                                    </figure>
                                                    <div className="page-meta">
                                                        <a className="underline" title="" href="#">My page</a>
                                                        <span><i className="ti-comment"></i>Messages <em>9</em></span>
                                                        <span><i className="ti-bell"></i>Notifications <em>2</em></span>
                                                    </div>
                                                    <div className="page-likes">
                                                        <ul className="nav nav-tabs likes-btn">
                                                            <li className="nav-item"><a data-toggle="tab" href="#link1" className="active">likes</a></li>
                                                            <li className="nav-item"><a data-toggle="tab" href="#link2" className="">views</a></li>
                                                        </ul>
                                                        {/*// <!-- Tab panes -->*/}
                                                        <div className="tab-content">
                                                            <div id="link1" className="tab-pane active fade show">
                                                                <span><i className="ti-heart"></i>884</span>
                                                                <a title="weekly-likes" href="#">35 new likes this week</a>
                                                                <div className="users-thumb-list">
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
                                                            <div id="link2" className="tab-pane fade">
                                                                <span><i className="ti-eye"></i>445</span>
                                                                <a title="weekly-likes" href="#">440 new views this week</a>
                                                                <div className="users-thumb-list">
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
                                            <div className="widget stick-widget">
                                                <h4 className="widget-title">Who's follownig</h4>
                                                <ul className="followers">
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar2.jpg" alt=""/></figure>
                                                        <div className="friend-meta">
                                                            <h4><a href="time-line.html" title="">Kelly Bill</a></h4>
                                                            <a href="#" title="" className="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar4.jpg" alt=""/></figure>
                                                        <div className="friend-meta">
                                                            <h4><a href="time-line.html" title="">Issabel</a></h4>
                                                            <a href="#" title="" className="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar6.jpg" alt=""/></figure>
                                                        <div className="friend-meta">
                                                            <h4><a href="time-line.html" title="">Andrew</a></h4>
                                                            <a href="#" title="" className="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar8.jpg" alt=""/></figure>
                                                        <div className="friend-meta">
                                                            <h4><a href="time-line.html" title="">Sophia</a></h4>
                                                            <a href="#" title="" className="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar3.jpg" alt=""/></figure>
                                                        <div className="friend-meta">
                                                            <h4><a href="time-line.html" title="">Allen</a></h4>
                                                            <a href="#" title="" className="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/*// <!-- who's following -->*/}
                                        </aside>
                                    </div>
                                    {/*// <!-- sidebar -->*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EditProfile;