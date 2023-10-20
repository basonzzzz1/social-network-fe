import React, {useEffect, useState} from 'react';
import Service from "../../services/Service";
import {Link, Navigate} from 'react-router-dom';
import Stomp from "stompjs";
import {toast} from "react-toastify";

let stompClient = null;
const ws = new WebSocket("ws://localhost:8080/ws/websocket");
ws.onopen = function () {
    var t = setInterval(function () {
        if (ws.readyState != 1) {
            clearInterval(t);
            return;
        }
        ws.send('{type:"ping"}');
    }, 2592000000000000);
};
const Header = () => {
    const [account, setAccount] = useState({});
    const [userSettingActive, setUserSettingActive] = useState(false);
    const [load, setLoad] = useState(true);
    const [dropdown, setDropdown] = useState(false);
    const [connect, setConnect] = useState(true);
    const [texted, setTexted] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [accountMessage, setAccountMessage] = useState({});
    const [listMessageFriend, setListMessageFriend] = useState([]);
    useEffect(() => {
        Service.profile().then((response) => {
            setAccount(response.data)
            console.log(response.data)
        }).catch((error) => {
            setLoad(false)
        })
    }, [load]);

    useEffect(() => {
        Service.findByListMessageFriend().then((response) => {
            setTexted(response)
            console.log(response)
        }).catch((error) => {
            setLoad(false)
        })
    }, [load]);
    const toggleUserSetting = () => {
        setUserSettingActive((prevState) => !prevState);
    };

    const findMessageByFriend = (id) => {
        Service.getMessageByFriend(id, account).then((response) => {
            setListMessageFriend(response)
            setDropdown(false)
            console.log(response)
        }).catch((error) => {
            alert("error !")
            console.log(error);
            setLoad(false)
        })
    }
    const logout = () => {
        localStorage.removeItem("idAccount");
        localStorage.removeItem("token");
        localStorage.removeItem("account");
    }

    useEffect(() => {
        let socket = new WebSocket('ws://localhost:8080/ws/websocket');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe("/chat/user/queue/position-update", function (message) {
                const messageData = JSON.parse(message.body);
                setLoad(true)
                Service.getMessageByFriend(messageData.toUserId, messageData.principal).then((response) => {
                    setListMessageFriend(response)
                })
                console.log(message);
            });
        });

    }, []);

    // const loadMessage = () => {
    //
    // }
    const sendMessage = () => {
        const message = {
            messageCreateBindingModel: {
                toUserId: accountMessage.id,
                content: document.getElementById("message-content-modal-create").value
            },
            principal: account
        };
        stompClient.send("ws://localhost:8080/app/chat", {}, JSON.stringify(message));
    }
    const sendMessage1 = () => {
        if(document.getElementById("message-content-modal-create").value == ""){
            return
        }
        let data = {
            toUserId: accountMessage.id,
            content: document.getElementById("message-content-modal-create").value
        }
        Service.sendMessage(account.id, data).then((response) => {
            document.getElementById("message-content-modal-create").value = "";
        }).catch((error) => {
            toast.error("not send message error !")
            console.log(error);
            setLoad(false)
        })
        stompClient.send("ws://localhost:8080/app/chat", {}, JSON.stringify(data));

    }
    const findAccountMessage = (t) => {
        console.log(t);
        setAccountMessage(t)
    }
    const handleSearch = (e) => {
        const search = e.target.value;
        Service.searchName(search).then((response) => {
                setSearchList(response.data);
        }).catch((error) => {
            console.log(error);
            setLoad(false)
        })

    }

    function calculateTimeChat(createdAt) {
        const currentTime = new Date();
        const postedTime = new Date(createdAt);
        const timeDiff = currentTime - postedTime;
        if (timeDiff < 60000) {
            return Math.floor(timeDiff / 1000) + " seconds ago";
        } else if (timeDiff < 3600000) {
            return Math.floor(timeDiff / 60000) + " minutes ago";
        } else if (timeDiff < 86400000) {
            return Math.floor(timeDiff / 3600000) + " hours ago";
        } else if (timeDiff < 2592000000) {
            return Math.floor(timeDiff / 86400000) + " days ago";
        } else if (timeDiff < 31536000000) {
            return Math.floor(timeDiff / 2592000000) + " months ago";
        } else {
            return Math.floor(timeDiff / 31536000000) + " years ago";
        }
    }

    const toggleDropdown = () => {
        if (dropdown === false) {
            setDropdown(true);
        } else {
            setDropdown(false);
        }
    };
    if (localStorage.getItem("idAccount") == null) {
        return (
            <>
                {<Navigate to="/login"/>}
            </>)
    } else {
        return (
            <div>
                <div className="responsive-header">
                    <div className="mh-head first Sticky">
                        <span className="mh-btns-left">
                            <a className="" href="#menu"><i className="fa fa-align-justify"></i></a>
                        </span>
                        <span className="mh-text">
                            <Link to={"/home"}><img src="images/logo2.png" alt=""/></Link>
                        </span>
                        <span className="mh-btns-right">
                            <a className="fa fa-sliders" href="#shoppingbag"></a>
                        </span>
                    </div>
                    <div className="mh-head second">
                        <form className="mh-form">
                            <input placeholder="search"/>
                            <a href="#/" className="fa fa-search"></a>
                        </form>
                    </div>
                    <nav id="menu" className="res-menu">
                        <ul>
                            <li><span>Home</span>
                                <ul>
                                    <li><a href="index-2.html" title="">Home Social</a></li>
                                    <li><a href="index2.html" title="">Home Social 2</a></li>
                                    <li><a href="index-company.html" title="">Home Company</a></li>
                                    <li><a href="landing.html" title="">Login page</a></li>
                                    <li><a href="logout.html" title="">Logout Page</a></li>
                                    <li><a href="newsfeed.html" title="">news feed</a></li>
                                </ul>
                            </li>
                            <li><span>Time Line</span>
                                <ul>
                                    <li><a href="time-line.html" title="">timeline</a></li>
                                    <li><a href="timeline-friends.html" title="">timeline friends</a></li>
                                    <li><a href="timeline-groups.html" title="">timeline groups</a></li>
                                    <li><a href="timeline-pages.html" title="">timeline pages</a></li>
                                    <li><a href="timeline-photos.html" title="">timeline photos</a></li>
                                    <li><a href="timeline-videos.html" title="">timeline videos</a></li>
                                    <li><a href="fav-page.html" title="">favourit page</a></li>
                                    <li><a href="groups.html" title="">groups page</a></li>
                                    <li><a href="page-likers.html" title="">Likes page</a></li>
                                    <li><a href="people-nearby.html" title="">people nearby</a></li>


                                </ul>
                            </li>
                            <li><span>Account Setting</span>
                                <ul>
                                    <li><a href="create-fav-page.html" title="">create fav page</a></li>
                                    <li><a href="edit-account-setting.html" title="">edit account setting</a></li>
                                    <li><a href="edit-interest.html" title="">edit-interest</a></li>
                                    <li><a href="edit-password.html" title="">edit-password</a></li>
                                    <li><a href="edit-profile-basic.html" title="">edit profile basics</a></li>
                                    <li><a href="edit-work-eductation.html" title="">edit work educations</a></li>
                                    <li><a href="messages.html" title="">message box</a></li>
                                    <li><a href="inbox.html" title="">Inbox</a></li>
                                    <li><a href="notifications.html" title="">notifications page</a></li>
                                </ul>
                            </li>
                            <li><span>forum</span>
                                <ul>
                                    <li><a href="forum.html" title="">Forum Page</a></li>
                                    <li><a href="forums-category.html" title="">Fourm Category</a></li>
                                    <li><a href="forum-open-topic.html" title="">Forum Open Topic</a></li>
                                    <li><a href="forum-create-topic.html" title="">Forum Create Topic</a></li>
                                </ul>
                            </li>
                            <li><span>Our Shop</span>
                                <ul>
                                    <li><a href="shop.html" title="">Shop Products</a></li>
                                    <li><a href="shop-masonry.html" title="">Shop Masonry Products</a></li>
                                    <li><a href="shop-single.html" title="">Shop Detail Page</a></li>
                                    <li><a href="shop-cart.html" title="">Shop Product Cart</a></li>
                                    <li><a href="shop-checkout.html" title="">Product Checkout</a></li>
                                </ul>
                            </li>
                            <li><span>Our Blog</span>
                                <ul>
                                    <li><a href="blog-grid-wo-sidebar.html" title="">Our Blog</a></li>
                                    <li><a href="blog-grid-right-sidebar.html" title="">Blog with R-Sidebar</a></li>
                                    <li><a href="blog-grid-left-sidebar.html" title="">Blog with L-Sidebar</a></li>
                                    <li><a href="blog-masonry.html" title="">Blog Masonry Style</a></li>
                                    <li><a href="blog-list-wo-sidebar.html" title="">Blog List Style</a></li>
                                    <li><a href="blog-list-right-sidebar.html" title="">Blog List with R-Sidebar</a>
                                    </li>
                                    <li><a href="blog-list-left-sidebar.html" title="">Blog List with L-Sidebar</a></li>
                                    <li><a href="blog-detail.html" title="">Blog Post Detail</a></li>
                                </ul>
                            </li>
                            <li><span>Portfolio</span>
                                <ul>
                                    <li><a href="portfolio-2colm.html" title="">Portfolio 2col</a></li>
                                    <li><a href="portfolio-3colm.html" title="">Portfolio 3col</a></li>
                                    <li><a href="portfolio-4colm.html" title="">Portfolio 4col</a></li>
                                </ul>
                            </li>
                            <li><span>Support & Help</span>
                                <ul>
                                    <li><a href="support-and-help.html" title="">Support & Help</a></li>
                                    <li><a href="support-and-help-detail.html" title="">Support & Help Detail</a></li>
                                    <li><a href="support-and-help-search-result.html" title="">Support & Help Search
                                        Result</a></li>
                                </ul>
                            </li>
                            <li><span>More pages</span>
                                <ul>
                                    <li><a href="careers.html" title="">Careers</a></li>
                                    <li><a href="career-detail.html" title="">Career Detail</a></li>
                                    <li><a href="404.html" title="">404 error page</a></li>
                                    <li><a href="404-2.html" title="">404 Style2</a></li>
                                    <li><a href="faq.html" title="">faq's page</a></li>
                                    <li><a href="insights.html" title="">insights</a></li>
                                    <li><a href="knowledge-base.html" title="">knowledge base</a></li>
                                </ul>
                            </li>
                            <li><a href="about.html" title="">about</a></li>
                            <li><a href="about-company.html" title="">About Us2</a></li>
                            <li><a href="contact.html" title="">contact</a></li>
                            <li><a href="contact-branches.html" title="">Contact Us2</a></li>
                            <li><a href="widgets.html" title="">Widgts</a></li>
                        </ul>
                    </nav>
                    <nav id="shoppingbag">
                        <div>
                            <div className="">
                                <form method="post">
                                    <div className="setting-row">
                                        <span>use night mode</span>
                                        <input type="checkbox" id="nightmode"/>
                                        <label htmlFor="nightmode" data-on-label="ON" data-off-label="OFF"></label>
                                    </div>
                                    <div className="setting-row">
                                        <span>Notifications</span>
                                        <input type="checkbox" id="switch2"/>
                                        <label htmlFor="switch2" data-on-label="ON" data-off-label="OFF"></label>
                                    </div>
                                    <div className="setting-row">
                                        <span>Notification sound</span>
                                        <input type="checkbox" id="switch3"/>
                                        <label htmlFor="switch3" data-on-label="ON" data-off-label="OFF"></label>
                                    </div>
                                    <div className="setting-row">
                                        <span>My profile</span>
                                        <input type="checkbox" id="switch4"/>
                                        <label htmlFor="switch4" data-on-label="ON" data-off-label="OFF"></label>
                                    </div>
                                    <div className="setting-row">
                                        <span>Show profile</span>
                                        <input type="checkbox" id="switch5"/>
                                        <label htmlFor="switch5" data-on-label="ON" data-off-label="OFF"></label>
                                    </div>
                                </form>
                                <h4 className="panel-title">Account Setting</h4>
                                <form method="post">
                                    <div className="setting-row">
                                        <span>Sub users</span>
                                        <input type="checkbox" id="switch6"/>
                                        <label htmlFor="switch6" data-on-label="ON" data-off-label="OFF"></label>
                                    </div>
                                    <div className="setting-row">
                                        <span>personal account</span>
                                        <input type="checkbox" id="switch7"/>
                                        <label htmlFor="switch7" data-on-label="ON" data-off-label="OFF"></label>
                                    </div>
                                    <div className="setting-row">
                                        <span>Business account</span>
                                        <input type="checkbox" id="switch8"/>
                                        <label htmlFor="switch8" data-on-label="ON" data-off-label="OFF"></label>
                                    </div>
                                    <div className="setting-row">
                                        <span>Show me online</span>
                                        <input type="checkbox" id="switch9"/>
                                        <label htmlFor="switch9" data-on-label="ON" data-off-label="OFF"></label>
                                    </div>
                                    <div className="setting-row">
                                        <span>Delete history</span>
                                        <input type="checkbox" id="switch10"/>
                                        <label htmlFor="switch10" data-on-label="ON" data-off-label="OFF"></label>
                                    </div>
                                    <div className="setting-row">
                                        <span>Expose author name</span>
                                        <input type="checkbox" id="switch11"/>
                                        <label htmlFor="switch11" data-on-label="ON" data-off-label="OFF"></label>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </nav>
                </div>
                <div className="topbar stick" id="nav-fix">
                    <div className="logo">
                        <Link to={"/home"}><img src="images/logo.png" alt=""/></Link>
                    </div>
                    <div className="top-area">
                        <ul className="setting-area" id="home-nav-bar">
                            <li className="li-nav-bar-icon">
                                <div className="searched">
                                    <button id="search-form-header" data-toggle="modal"
                                            data-target="#modal-search-list-form"><i className="ti-search"></i></button>
                                </div>
                            </li>
                            <li className="li-nav-bar-icon">
                                <Link to={"/home"} title="Home" data-ripple=""><i className="ti-home"></i></Link>
                            </li>
                            <li className="li-nav-bar-icon">
                                <a href="#" title="Notification" data-ripple="">
                                    <i className="ti-bell"></i><span>20</span>
                                </a>
                                <div className="dropdowns">
                                    <span>4 New Notifications</span>
                                    <ul className="drops-menu">
                                        <li>
                                            <a href="notifications.html" title="">
                                                <img src="images/resources/thumb-1.jpg" alt=""/>
                                                <div className="mesg-meta">
                                                    <h6>sarah Loren</h6>
                                                    <span>Hi, how r u dear ...?</span>
                                                    <i>2 min ago</i>
                                                </div>
                                            </a>
                                            <span className="tag green">New</span>
                                        </li>
                                        <li>
                                            <a href="notifications.html" title="">
                                                <img src="images/resources/thumb-2.jpg" alt=""/>
                                                <div className="mesg-meta">
                                                    <h6>Jhon doe</h6>
                                                    <span>Hi, how r u dear ...?</span>
                                                    <i>2 min ago</i>
                                                </div>
                                            </a>
                                            <span className="tag red">Reply</span>
                                        </li>
                                        <li>
                                            <a href="notifications.html" title="">
                                                <img src="images/resources/thumb-3.jpg" alt=""/>
                                                <div className="mesg-meta">
                                                    <h6>Andrew</h6>
                                                    <span>Hi, how r u dear ...?</span>
                                                    <i>2 min ago</i>
                                                </div>
                                            </a>
                                            <span className="tag blue">Unseen</span>
                                        </li>
                                        <li>
                                            <a href="notifications.html" title="">
                                                <img src="images/resources/thumb-4.jpg" alt=""/>
                                                <div className="mesg-meta">
                                                    <h6>Tom cruse</h6>
                                                    <span>Hi, how r u dear ...?</span>
                                                    <i>2 min ago</i>
                                                </div>
                                            </a>
                                            <span className="tag">New</span>
                                        </li>
                                        <li>
                                            <a href="notifications.html" title="">
                                                <img src="images/resources/thumb-5.jpg" alt=""/>
                                                <div className="mesg-meta">
                                                    <h6>Amy</h6>
                                                    <span>Hi, how r u dear ...?</span>
                                                    <i>2 min ago</i>
                                                </div>
                                            </a>
                                            <span className="tag">New</span>
                                        </li>
                                    </ul>
                                    <a href="notifications.html" title="" className="more-mesg">view more</a>
                                </div>
                            </li>
                            <li className="li-nav-bar-icon">
                                <a id="dropdowns2" onClick={toggleDropdown}><i
                                    className="ti-comment"></i><span>{texted.length}</span>
                                </a>
                                {dropdown ? (
                                    <div className="dropdowns1">
                                        <span>Messages</span>
                                        {texted.map((t) => (
                                            <ul className="drops-menu1" onClick={() => {
                                                findAccountMessage(t.toUser.id == account.id ? t.fromUser : t.toUser);
                                                findMessageByFriend(t.toUser.id == account.id ? t.fromUser.id : t.toUser.id);
                                            }} data-toggle="modal" data-target="#modalMessage">
                                                <li>
                                                    <Link to={"#"}>
                                                        <img className="img-message-friend"
                                                             src={t.toUser.id === account.id ? t.fromUser.avatar : t.toUser.avatar}
                                                             alt=""/>
                                                        <div className="mesg-meta">
                                                            <h6>{t.toUser.id === account.id ? t.fromUser.firstName : t.toUser.firstName} {t.toUser.id === account.id ? t.fromUser.lastName : t.toUser.lastName}</h6>
                                                            <span>{t.content}</span>
                                                            <i>{calculateTimeChat(t.time)}</i>
                                                        </div>
                                                    </Link>
                                                    <span className="tag">New</span>
                                                </li>
                                            </ul>
                                        ))}
                                        <div id="div-message-view-more">
                                            <a href="messages.html" title="" className="more-mesg">view more</a>
                                        </div>
                                    </div>
                                ) : (null)}
                            </li>
                        </ul>
                        <div id="div-img-profile">
                            <div className="user-img">
                                <img
                                    src={account.avatar}
                                    id="img-profile" onClick={toggleUserSetting} alt=""/>
                            </div>
                            <div className={`user-setting ${userSettingActive ? 'active' : ''}`}>
                                <Link to={"/profile"}><i className="ti-user"></i> view profile</Link>
                                <Link to={"/editProfile"}><i className="ti-pencil-alt"></i>edit profile</Link>
                                <a href="#" title=""><i className="ti-target"></i>activity log</a>
                                <a href="#" title=""><i className="ti-settings"></i>account setting</a>
                                <Link to={"/login"} onClick={() => logout()}><i className="ti-power-off"></i>log
                                    out</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal" id="modalMessage">
                    <div className="modal-dialog-1">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="f-title"><i className="ti-bell"></i>All Messages <span
                                    className="more-options"><i className="fa fa-ellipsis-h"></i></span></h5>
                                <button type="button" className="close" data-dismiss="modal"
                                        id="closeModalButtonUpdate">&times;</button>
                            </div>
                            <div id="modal-avatar">

                            </div>
                            <div className="modal-body">
                                <div className="message-box">
                                    <ul className="peoples">
                                        {texted.map((t) => (
                                            <li id="load-load-load" className="li-peoples-modal" onClick={() => {
                                                findAccountMessage(t.toUser.id == account.id ? t.fromUser : t.toUser);
                                                findMessageByFriend(t.toUser.id == account.id ? t.fromUser.id : t.toUser.id);
                                            }}>
                                                <figure>
                                                    <img className="messenger-avatar-modal"
                                                         src={t.toUser.id === account.id ? t.fromUser.avatar : t.toUser.avatar}
                                                         alt=""/>
                                                    {t.toUser.id === account.id ? (t.fromUser.online ?
                                                        <span className="status f-online"></span> : <span
                                                            className="status off-online"></span>) : (t.toUser.online ?
                                                        <span className="status f-online"></span> :
                                                        <span className="status off-online"></span>)}
                                                </figure>
                                                <div className="people-name">
                                                    <div className="content-and-name">
                                                        <span className="name-user-modal">{t.toUser.id === account.id ? t.fromUser.firstName : t.toUser.firstName} {t.toUser.id === account.id ? t.fromUser.lastName : t.toUser.lastName}</span>
                                                        <p className="content-user-modal">{t.content}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="peoples-mesg-box">
                                        <div className="conversation-head">
                                            <figure><img className="img-modal-touser" src={accountMessage.avatar}
                                                         alt=""/></figure>
                                            <span>{accountMessage.firstName} {accountMessage.lastName}{accountMessage.online ?
                                                <i>online</i> : <i>offline</i>}</span>
                                        </div>
                                        <ul className="chatting-area" style={{
                                            width: "567px",
                                            maxHeight: "500px",
                                            overflowY: "scroll",
                                            height: "500px"
                                        }}>
                                            {listMessageFriend.map((l) => (
                                                l.fromUserId === account.id ? (
                                                    <li className="me">
                                                        <figure><img className="avatar-from-user-modal"
                                                                     src={l.fromUserAvatar} alt=""/></figure>
                                                        <p>{l.content}</p>
                                                    </li>
                                                ) : (
                                                    <li className="you">
                                                        <figure><img className="avatar-from-user-modal"
                                                                     src={l.fromUserAvatar} alt=""/></figure>
                                                        <p>{l.content}</p>
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                        <div className="message-text-container"
                                             style={{height: "50px", width: "567px"}}>
                                                <textarea id="message-content-modal-create"
                                                          style={{border: "1px solid #969696", height: "25px"}}
                                                          placeholder={"Message . . . !"}> </textarea>
                                            <button title="send" id="send-message" onClick={() => sendMessage1()}><i
                                                className="fa fa-paper-plane"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal" id="modal-search-list-form">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="f-title"><i className="ti-bell"></i>Search Name<span
                                    className="more-options"></span>
                                </h5>
                                <div id="div-search-list-modal">
                                    <input type="text" id="search-form-header-modal" onChange={handleSearch}
                                           placeholder="Search Friend . . . !"/>
                                    <button id="search-form-modal"><i className="ti-search"></i></button>
                                </div>
                                <button type="button" className="close" data-dismiss="modal"
                                        id="closeModalButtonUpdate">&times;</button>
                            </div>
                            <div className="modal-body">
                                <aside className="sidebar static" id="form-search-list-friend">
                                    <div className="widget friend-list stick-widget">
                                        <h4 className="widget-title">Friends</h4>
                                        <div id="searchDir"></div>
                                        <ul id="people-list" className="friendz-list">
                                            {searchList.map((f) => (
                                            <li>
                                                <figure>
                                                    <img src={f.avatar} className="friend-image-avatar-modal" alt=""/>
                                                    {f.online ? <span className="status f-online"></span> :  <span className="status f-off"></span>}

                                                </figure>
                                                <div className="friendz-meta">
                                                    {f.id == account.id ? <Link to={"/profile"} >{f.firstName} {f.lastName}</Link> : <Link to={`/${f.id}`}  >{f.firstName} {f.lastName}</Link>}
                                                    <i><a href={"#"}>{f.email}</a></i>
                                                </div>
                                            </li>
                                                ))}
                                        </ul>
                                        <div className="chat-box">
                                            <div className="chat-head">
                                                <span className="status f-online"></span>
                                                <h6>Bucky Barnes</h6>
                                                <div className="more">
                                                    <span><i className="ti-more-alt"></i></span>
                                                    <span className="close-mesage"><i className="ti-close"></i></span>
                                                </div>
                                            </div>
                                            <div className="chat-list">
                                                <ul>
                                                    <li className="me">
                                                        <div className="chat-thumb"><img
                                                            src="images/resources/chatlist1.jpg"
                                                            alt=""/></div>
                                                        <div className="notification-event">
                                                <span className="chat-message-item">
                                                    Hi James! Please remember to buy the food for tomorrow! I’m gonna be handling the gifts and Jake’s gonna get the drinks
                                                </span>
                                                            <span className="notification-date"><time
                                                                dateTime="2004-07-24T18:18"
                                                                className="entry-date updated">Yesterday at 8:10pm</time></span>
                                                        </div>
                                                    </li>
                                                    <li className="you">
                                                        <div className="chat-thumb"><img
                                                            src="images/resources/chatlist2.jpg"
                                                            alt=""/></div>
                                                        <div className="notification-event">
                                                <span className="chat-message-item">
                                                    Hi James! Please remember to buy the food for tomorrow! I’m gonna be handling the gifts and Jake’s gonna get the drinks
                                                </span>
                                                            <span className="notification-date"><time
                                                                dateTime="2004-07-24T18:18"
                                                                className="entry-date updated">Yesterday at 8:10pm</time></span>
                                                        </div>
                                                    </li>
                                                    <li className="me">
                                                        <div className="chat-thumb"><img
                                                            src="images/resources/chatlist1.jpg"
                                                            alt=""/></div>
                                                        <div className="notification-event">
															<span className="chat-message-item">
																Hi James! Please remember to buy the food for tomorrow! I’m gonna be handling the gifts and Jake’s gonna get the drinks
															</span>
                                                            <span className="notification-date"><time
                                                                dateTime="2004-07-24T18:18"
                                                                className="entry-date updated">Yesterday at 8:10pm</time></span>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <form className="text-box">
                                                    <textarea placeholder="Post enter to post..."></textarea>
                                                    <div className="add-smiles">
                                                        <span title="add icon" className="em em-expressionless"></span>
                                                    </div>
                                                    <div className="smiles-bunch">
                                                        <i className="em em---1"></i>
                                                        <i className="em em-smiley"></i>
                                                        <i className="em em-anguished"></i>
                                                        <i className="em em-laughing"></i>
                                                        <i className="em em-angry"></i>
                                                        <i className="em em-astonished"></i>
                                                        <i className="em em-blush"></i>
                                                        <i className="em em-disappointed"></i>
                                                        <i className="em em-worried"></i>
                                                        <i className="em em-kissing_heart"></i>
                                                        <i className="em em-rage"></i>
                                                        <i className="em em-stuck_out_tongue"></i>
                                                    </div>
                                                    <button type="button"></button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Header;