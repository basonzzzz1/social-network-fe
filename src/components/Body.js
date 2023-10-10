import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Service from "../services/Service";
import moment from 'moment';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const Body = () => {
    // const cors = require('cors');
    // const express = require('express');
    // let app = express();
    // app.use(cors());
    // app.options('*', cors());
    const [menu, setMenu] = useState(false);
    const [posts, setPosts] = useState([]);
    const [status, setStatus] = useState([]);
    const [postFull, setPostFull] = useState([]);
    const [like, setLike] = useState([]);
    const [account, setAccount] = useState([]);
    const [load, setLoad] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [postContent, setPostContent] = useState("");
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
        alert('Connected to WebSocket');
        // Lắng nghe tin nhắn từ máy chủ
        stompClient.subscribe('/topic/like', (message) => {
            console.log('Received like message:', message.body);
            setLoad(true)
            alert("lắng nghe")
            Service.findAllLike().then((response) => {
                setLike(response)
            }).catch((error) => {
                // alert("lỗi !")
            })
            // Xử lý tin nhắn like ở đây
            // Ví dụ: cập nhật trạng thái like trong danh sách bài viết
            // Cần có một cơ chế để xác định bài viết được like và người dùng thực hiện like
        });
        stompClient.subscribe('/topic/deleteLike', (message) => {
            console.log('Received deleteLike message:', message.body);
            alert("lắng nghe")
            Service.findAllPost().then((response) => {
                const sortedPosts = response.sort((a, b) => {
                    return new Date(b.time) - new Date(a.time);
                });
                setPosts(sortedPosts)
                console.log(response)
                setLoad(true)
            }).catch((error) => {

            })
            Service.findAllLike().then((response) => {
                setLike(response)
            }).catch((error) => {
                // alert("lỗi !")
            })
            // Xử lý tin nhắn deleteLike ở đây
            // Ví dụ: cập nhật trạng thái deleteLike trong danh sách bài viết
        });
    });
// Sau khi thực hiện các hoạt động liên quan đến like, bạn có thể gửi tin nhắn WebSocket để thông báo về sự kiện like hoặc deleteLike.
// Dưới đây là một ví dụ gửi tin nhắn like:
//         const likePost1 = (postId) => {
//             stompClient.send('/app/like', {}, JSON.stringify({ postId }));
//         };

// Và gửi tin nhắn deleteLike:
//         const deleteLike = (likeId) => {
//             stompClient.send('/app/deleteLike', {}, JSON.stringify({ likeId }));
//         };
    useEffect(() => {
        Service.findAllPost().then((response) => {
            const filteredPosts = response.filter((post) => post.status.name == "public" || post.loggedInUser.id == localStorage.getItem("idAccount"));
            const sortedPosts = filteredPosts.sort((a, b) => {
                return new Date(b.time) - new Date(a.time);
            });
            setPosts(sortedPosts);
            console.log(response);
            setLoad(false);
        }).catch((error) => {
            console.log(error);
        })
    }, [load]);
    useEffect(() => {
        Service.getAllStatus().then((response) => {
            console.log(response);
            setStatus(response.data);
        }).catch((error) => {

        })
    }, []);
    useEffect(() => {
        Service.findAllLike().then((response) => {
            setLike(response)
            setLoad(false)
        }).catch((error) => {
            // alert("lỗi !")
        })
    }, [load]);
    useEffect(() => {
        let newPostFull = {};
        let arrPost = [];
        for (let i = 0; i < posts.length; i++) {
            let countLike = 0;
            for (let j = 0; j < like.length; j++) {
                if (posts[i].id == like[j].post.id) {
                    countLike++
                }
            }
            newPostFull = {
                status: posts[i].status,
                id: posts[i].id,
                loggedInUser: posts[i].loggedInUser,
                content: posts[i].content,
                time: posts[i].time,
                image: posts[i].image,
                countLike: countLike
            }
            arrPost.push(newPostFull);
        }
        setPostFull(arrPost)
    }, [posts]);
    useEffect(() => {
        if (postContent != "") {
            document.getElementById("create-post").style.backgroundColor = "#38B6FF";
        } else {
            document.getElementById("create-post").style.backgroundColor = "#beb1b1";
        }
    }, [postContent]);
    const logout = () => {
        localStorage.removeItem("idAccount");
        localStorage.removeItem("token");
    }
    const createPost = () => {
        let file = document.getElementById("file1").files[0];
        let data = new FormData();
        let content = document.getElementById("post-content").value;
        let statusId = document.getElementById("status-select").value;
        data.append("content", content);
        data.append("file", file);
        data.append("statusId", statusId);
        if (postContent !== "") {
            Service.createPost(data).then((response) => {
                alert("thành công !");
                document.getElementById("post-content").value = "";
                setSelectedImage(null)
                document.getElementById("selectedImage").style.display = 'none';
                setLoad(true);
            }).catch((error) => {
                alert("thất cmn bại !")
            })
        } else {
        }
    }
    const handlePostContentChange = (e) => {
        setPostContent(e.target.value);
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
                setPostContent(e.target.value);
                document.getElementById("selectedImage").style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImage(null);
            document.getElementById("selectedImage").style.display = 'none';
        }
    };
    const menuPost = (id) => {
        if (menu == true) {
            document.getElementById(`menu${id}`).style.display = 'none';
            setMenu(false)
        } else {
            setMenu(true);
            document.getElementById(`menu${id}`).style.display = 'block';
        }
    }
    const isMenu = (id) => {
        let count = 0;
        document.getElementById(`menu${id}`).style.display = 'block';
    }
    const remoteFile = () => {
        setSelectedImage(null);
        setPostContent("");
        setLoad(true);
        document.getElementById("selectedImage").style.display = 'none';
        document.getElementById("file1").value = "";
    }
    useEffect(() => {
        Service.profile().then((response) => {
            setAccount(response.data)
            setLoad(true);
        }).catch((error) => {

        })
    }, []);
    const deletePost = (id) => {
        Service.deletePost(id)
            .then((response) => {
                setLoad(true);
            })
            .catch((error) => {
                console.error('Lỗi khi xóa post:', error);
                alert("lỗi xóa post");
            });
    }

    const likePost = (post) => {
        const isLiked = like.some((likedPost) => likedPost.post.id === post.id && account.id === likedPost.account.id);
        if (isLiked) {
            const likedPost = like.find((likedPost) => likedPost.post.id === post.id && account.id === likedPost.account.id);
            let likeId = likedPost.id;
            Service.deleteLike(likedPost.id)
                .then((response) => {
                    stompClient.send('/app/deleteLike', {}, JSON.stringify({likeId}));
                    setLoad(true);
                })
                .catch((error) => {
                    console.error('Lỗi khi xóa like:', error);
                    alert("Lỗi khi xóa like:");
                });
        } else {
            const newLike = {
                account: account,
                post: post,
            };
            Service.likePost(newLike)
                .then(() => {
                    stompClient.send('/app/like', {}, JSON.stringify({newLike}));
                    setLoad(true);
                })
                .catch((error) => {
                    console.error('Lỗi khi "like":', error);
                    alert('Lỗi khi like !');
                });
        }
    };
    return (
        <div>
            <section>
                <div className="gap gray-bg">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row" id="page-contents">
                                    <div className="col-lg-3">
                                        <aside className="sidebar static">
                                            <div className="widget">
                                                <h4 className="widget-title">Shortcuts</h4>
                                                <ul className="naves">
                                                    <li>
                                                        <i className="ti-clipboard"></i>
                                                        <a href="newsfeed.html" title="">News feed</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-mouse-alt"></i>
                                                        <a href="inbox.html" title="">Inbox</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-files"></i>
                                                        <a href="fav-page.html" title="">My pages</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-user"></i>
                                                        <a href="timeline-friends.html" title="">friends</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-image"></i>
                                                        <a href="timeline-photos.html" title="">images</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-video-camera"></i>
                                                        <a href="timeline-videos.html" title="">videos</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-comments-smiley"></i>
                                                        <a href="messages.html" title="">Messages</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-bell"></i>
                                                        <a href="notifications.html" title="">Notifications</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-share"></i>
                                                        <a href="people-nearby.html" title="">People Nearby</a>
                                                    </li>
                                                    <li>
                                                        <i className="fa fa-bar-chart-o"></i>
                                                        <a href="insights.html" title="">insights</a>
                                                    </li>
                                                    <li>
                                                        <i className="ti-power-off"></i>
                                                        <Link to={"/login"} onClick={() => logout()}>Logout</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/*// <!-- Shortcuts -->*/}
                                            <div className="widget">
                                                <h4 className="widget-title">Recent Activity</h4>
                                                <ul className="activitiez">
                                                    <li>
                                                        <div className="activity-meta">
                                                            <i>10 hours Ago</i>
                                                            <span><a href="#"
                                                                     title="">Commented on Video posted </a></span>
                                                            <h6>by <a href="time-line.html">black demon.</a></h6>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="activity-meta">
                                                            <i>30 Days Ago</i>
                                                            <span><a href="#" title="">Posted your status. “Hello guys, how are you?”</a></span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="activity-meta">
                                                            <i>2 Years Ago</i>
                                                            <span><a href="#"
                                                                     title="">Share a video on her timeline.</a></span>
                                                            <h6>"<a href="#">you are so funny mr.been.</a>"</h6>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/*// <!-- recent activites -->*/}
                                            <div className="widget stick-widget">
                                                <h4 className="widget-title">Who's follownig</h4>
                                                <ul className="followers">
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar2.jpg" alt=""/>
                                                        </figure>
                                                        <div className="friend-meta">
                                                            <h4><a href="time-line.html" title="">Kelly Bill</a></h4>
                                                            <a href="#" title="" className="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar4.jpg" alt=""/>
                                                        </figure>
                                                        <div className="friend-meta">
                                                            <h4><a href="time-line.html" title="">Issabel</a></h4>
                                                            <a href="#" title="" className="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar6.jpg" alt=""/>
                                                        </figure>
                                                        <div className="friend-meta">
                                                            <h4><a href="time-line.html" title="">Andrew</a></h4>
                                                            <a href="#" title="" className="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar8.jpg" alt=""/>
                                                        </figure>
                                                        <div className="friend-meta">
                                                            <h4><a href="time-line.html" title="">Sophia</a></h4>
                                                            <a href="#" title="" className="underline">Add Friend</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar3.jpg" alt=""/>
                                                        </figure>
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
                                    <div className="col-lg-6" id="body-scroll">
                                        <div className="central-meta">
                                            <div className="new-postbox">
                                                <figure>
                                                    <img src="images/resources/admin2.jpg" alt=""/>
                                                </figure>
                                                <div className="newpst-input">
                                                    <form>
                                                        <select id="status-select">
                                                            {status.map((item) => (
                                                                <option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <textarea rows="2" placeholder="write something"
                                                                  id="post-content"
                                                                  onChange={handlePostContentChange}></textarea>
                                                        <div className="post-meta">
                                                            <img src={selectedImage} alt="Selected Image"
                                                                 id="selectedImage" style={{display: 'none'}}/>
                                                            {selectedImage && (
                                                                <span className="remove-image" onClick={remoteFile}>
                                                                    <svg id="bi-x-square"
                                                                         xmlns="http://www.w3.org/2000/svg" width="16"
                                                                         height="16" fill="currentColor"
                                                                         className="bi bi-x-square" viewBox="0 0 16 16">
                                                                        <path
                                                                            d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                                                        <path
                                                                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                                                    </svg>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="attachments">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa fa-music"></i>
                                                                    <label className="fileContainer">
                                                                        <input type="file"/>
                                                                    </label>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-image"></i>
                                                                    <label className="fileContainer">
                                                                        <input type="file" id="file1"
                                                                               onChange={handleFileChange}/>
                                                                    </label>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-video-camera"></i>
                                                                    <label className="fileContainer">
                                                                        <input type="file"/>
                                                                    </label>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-camera"></i>
                                                                    <label className="fileContainer">
                                                                        <input type="file"/>
                                                                    </label>
                                                                </li>
                                                                <li>
                                                                    <button id="create-post" type="button"
                                                                            onClick={() => createPost()}>Post
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        {/*// <!-- add post new box -->*/}
                                        <div className="loadMore">
                                            {postFull.map((p) => (
                                                <div className="central-meta item" key={p.id}>
                                                    <div className="user-post">
                                                        <div className="friend-info">
                                                            <figure>
                                                                <img src={`images/profile/` + p.loggedInUser.avatar}
                                                                     id="img-logged" alt=""/>
                                                            </figure>
                                                            <div className="friend-name">
                                                                <ins>
                                                                    <a href="time-line.html"
                                                                       title="">{p.loggedInUser.firstName} {p.loggedInUser.lastName}</a>
                                                                </ins>
                                                                <span id="status-name">
                                                                     {p.status.name === "public" ? (
                                                                         <i className="fa fa-globe"></i>
                                                                     ) : p.status.name === "friend" ? (
                                                                         <i className="fa fa-user"></i>
                                                                     ) : p.status.name === "private" ? (
                                                                         <i className="fa fa-lock"></i>
                                                                     ) : null}
                                                                </span>
                                                                <span>{moment(p.time).format('MMMM Do YYYY, h:mm:ss a')}</span>
                                                            </div>
                                                            <div className="top-are">
                                                                <div>
                                                                    <button onClick={() => menuPost(p.id)}
                                                                            className="menu-button-post"><span><i
                                                                        className="fa fa-list"></i></span></button>
                                                                    <div id={"menu" + p.id} style={{display: 'none'}}
                                                                         className="menu-div-post">
                                                                        <div className="menu-post">
                                                                            <div className="menu-post-li">
                                                                                <button className="button-menu-1"
                                                                                        onClick={() => deletePost(p.id)}>
                                                                                    <i className="fa fa-trash"></i> delete
                                                                                </button>
                                                                            </div>
                                                                            <div className="menu-post-li">
                                                                                {/*<Link to={"/editProfile"}><i className="ti-pencil-alt"></i>edit profile</Link>*/}
                                                                            </div>
                                                                            <div className="menu-post-li">
                                                                                {/*<a href="#" title=""><i className="ti-target"></i>activity log</a>*/}
                                                                            </div>
                                                                            <div className="menu-post-li">
                                                                                {/*<a href="#" title=""><i className="ti-settings"></i>account setting</a>*/}
                                                                            </div>
                                                                            <div className="menu-post-li">
                                                                                {/*<a href="#" title=""><i className="ti-power-off"></i>log out</a>*/}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="post-meta">
                                                                <img src={`images/profile/` + p.image} alt=""/>
                                                                <div className="we-video-info">
                                                                    <ul>
                                                                        <li>
															<span className="views" data-toggle="tooltip" title="views">
																<i className="fa fa-eye"></i>
																<ins>1.2k</ins>
															</span>
                                                                        </li>
                                                                        <li>
															<span className="comment" data-toggle="tooltip"
                                                                  title="Comments">
																<i className="fa fa-comments-o"></i>
																<ins>52</ins>
															</span>
                                                                        </li>
                                                                        <li>
                                                                            <span onClick={() => likePost(p)}>
                                                                                             {like.some((likedPost) => likedPost.post.id == p.id && account.id == likedPost.account.id) ? (
                                                                                                 <i className="ti-heart"
                                                                                                    id="likeok"></i>
                                                                                             ) : (
                                                                                                 <i className="ti-heart"></i>
                                                                                             )}
                                                                                <ins>{p.countLike}</ins>
                                                                            </span>
                                                                        </li>
                                                                        <li className="social-media">
                                                                            <div className="menu">
                                                                                <div className="btn trigger"><i
                                                                                    className="fa fa-share-alt"></i>
                                                                                </div>
                                                                                <div className="rotater">
                                                                                    <div className="btn btn-icon"><a
                                                                                        href="#" title=""><i
                                                                                        className="fa fa-html5"></i></a>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="rotater">
                                                                                    <div className="btn btn-icon"><a
                                                                                        href="#" title=""><i
                                                                                        className="fa fa-facebook"></i></a>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="rotater">
                                                                                    <div className="btn btn-icon"><a
                                                                                        href="#" title=""><i
                                                                                        className="fa fa-google-plus"></i></a>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="rotater">
                                                                                    <div className="btn btn-icon"><a
                                                                                        href="#" title=""><i
                                                                                        className="fa fa-twitter"></i></a>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="rotater">
                                                                                    <div className="btn btn-icon"><a
                                                                                        href="#" title=""><i
                                                                                        className="fa fa-css3"></i></a>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="rotater">
                                                                                    <div className="btn btn-icon"><a
                                                                                        href="#" title=""><i
                                                                                        className="fa fa-instagram"></i></a>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="rotater">
                                                                                    <div className="btn btn-icon"><a
                                                                                        href="#" title=""><i
                                                                                        className="fa fa-dribbble"></i></a>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="rotater">
                                                                                    <div className="btn btn-icon"><a
                                                                                        href="#" title=""><i
                                                                                        className="fa fa-pinterest"></i></a>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className="description">

                                                                    <p>
                                                                        {p.content}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="coment-area">
                                                            <ul className="we-comet">
                                                                <li>
                                                                    <div className="comet-avatar">
                                                                        <img src="images/resources/comet-1.jpg" alt=""/>
                                                                    </div>
                                                                    <div className="we-comment">
                                                                        <div className="coment-head">
                                                                            <h5><a href="time-line.html" title="">Jason
                                                                                borne</a></h5>
                                                                            <span>1 year ago</span>
                                                                            <a className="we-reply" href="#"
                                                                               title="Reply"><i
                                                                                className="fa fa-reply"></i></a>
                                                                        </div>
                                                                        <p>we are working for the dance and sing songs.
                                                                            this car is very awesome for the youngster.
                                                                            please vote this car and like our post</p>
                                                                    </div>
                                                                    <ul>
                                                                        <li>
                                                                            <div className="comet-avatar">
                                                                                <img src="images/resources/comet-2.jpg"
                                                                                     alt=""/>
                                                                            </div>
                                                                            <div className="we-comment">
                                                                                <div className="coment-head">
                                                                                    <h5><a href="time-line.html"
                                                                                           title="">alexendra dadrio</a>
                                                                                    </h5>
                                                                                    <span>1 month ago</span>
                                                                                    <a className="we-reply" href="#"
                                                                                       title="Reply"><i
                                                                                        className="fa fa-reply"></i></a>
                                                                                </div>
                                                                                <p>yes, really very awesome car i see
                                                                                    the features of this car in the
                                                                                    official website of <a href="#"
                                                                                                           title="">#Mercedes-Benz</a> and
                                                                                    really impressed :-)</p>
                                                                            </div>
                                                                        </li>
                                                                        <li>
                                                                            <div className="comet-avatar">
                                                                                <img src="images/resources/comet-3.jpg"
                                                                                     alt=""/>
                                                                            </div>
                                                                            <div className="we-comment">
                                                                                <div className="coment-head">
                                                                                    <h5><a href="time-line.html"
                                                                                           title="">Olivia</a></h5>
                                                                                    <span>16 days ago</span>
                                                                                    <a className="we-reply" href="#"
                                                                                       title="Reply"><i
                                                                                        className="fa fa-reply"></i></a>
                                                                                </div>
                                                                                <p>i like lexus cars, lexus cars are
                                                                                    most beautiful with the awesome
                                                                                    features, but this car is really
                                                                                    outstanding than lexus</p>
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                </li>
                                                                <li>
                                                                    <div className="comet-avatar">
                                                                        <img src="images/resources/comet-1.jpg" alt=""/>
                                                                    </div>
                                                                    <div className="we-comment">
                                                                        <div className="coment-head">
                                                                            <h5><a href="time-line.html" title="">Donald
                                                                                Trump</a></h5>
                                                                            <span>1 week ago</span>
                                                                            <a className="we-reply" href="#"
                                                                               title="Reply"><i
                                                                                className="fa fa-reply"></i></a>
                                                                        </div>
                                                                        <p>we are working for the dance and sing songs.
                                                                            this video is very awesome for the
                                                                            youngster. please vote this video and like
                                                                            our channel
                                                                            <i className="em em-smiley"></i>
                                                                        </p>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <a href="#" title="" className="showmore underline">more
                                                                        comments</a>
                                                                </li>
                                                                <li className="post-comment">
                                                                    <div className="comet-avatar">
                                                                        <img src="images/resources/comet-1.jpg" alt=""/>
                                                                    </div>
                                                                    <div className="post-comt-box">
                                                                        <form method="post">
                                                                            <textarea
                                                                                placeholder="Post your comment"></textarea>
                                                                            <div className="add-smiles">
                                                                                <span className="em em-expressionless"
                                                                                      title="add icon"></span>
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
                                                                            <button type="submit"></button>
                                                                        </form>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="central-meta item">
                                                <div className="user-post">
                                                    <div className="friend-info">
                                                        <figure>
                                                            <img src="images/resources/friend-avatar10.jpg" alt=""/>
                                                        </figure>
                                                        <div className="friend-name">
                                                            <ins><a href="time-line.html" title="">Janice Griffith</a>
                                                            </ins>
                                                            <span>published: june,2 2018 19:PM</span>
                                                        </div>
                                                        <div className="post-meta">
                                                            <img src="" alt=""/>
                                                            <div className="we-video-info">
                                                                <ul>
                                                                    <li>
															<span className="views" data-toggle="tooltip" title="views">
																<i className="fa fa-eye"></i>
																<ins>1.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="comment" data-toggle="tooltip"
                                                                  title="Comments">
																<i className="fa fa-comments-o"></i>
																<ins>52</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="like" data-toggle="tooltip" title="like">
																<i className="ti-heart"></i>
																<ins>2.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="dislike" data-toggle="tooltip"
                                                                  title="dislike">
																<i className="ti-heart-broken"></i>
																<ins>200</ins>
															</span>
                                                                    </li>
                                                                    <li className="social-media">
                                                                        <div className="menu">
                                                                            <div className="btn trigger"><i
                                                                                className="fa fa-share-alt"></i></div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-html5"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-facebook"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-google-plus"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-twitter"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-css3"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-instagram"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-dribbble"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-pinterest"></i></a>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="description">

                                                                <p>
                                                                    World's most beautiful car in Curabitur <a href="#"
                                                                                                               title="">#test
                                                                    drive booking !</a> the most beatuiful car available
                                                                    in america and the saudia arabia, you can book your
                                                                    test drive by our official website
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="coment-area">
                                                        <ul className="we-comet">
                                                            <li>
                                                                <div className="comet-avatar">
                                                                    <img src="images/resources/comet-1.jpg" alt=""/>
                                                                </div>
                                                                <div className="we-comment">
                                                                    <div className="coment-head">
                                                                        <h5><a href="time-line.html" title="">Jason
                                                                            borne</a></h5>
                                                                        <span>1 year ago</span>
                                                                        <a className="we-reply" href="#"
                                                                           title="Reply"><i className="fa fa-reply"></i></a>
                                                                    </div>
                                                                    <p>we are working for the dance and sing songs. this
                                                                        car is very awesome for the youngster. please
                                                                        vote this car and like our post</p>
                                                                </div>
                                                                <ul>
                                                                    <li>
                                                                        <div className="comet-avatar">
                                                                            <img src="images/resources/comet-2.jpg"
                                                                                 alt=""/>
                                                                        </div>
                                                                        <div className="we-comment">
                                                                            <div className="coment-head">
                                                                                <h5><a href="time-line.html" title="">alexendra
                                                                                    dadrio</a></h5>
                                                                                <span>1 month ago</span>
                                                                                <a className="we-reply" href="#"
                                                                                   title="Reply"><i
                                                                                    className="fa fa-reply"></i></a>
                                                                            </div>
                                                                            <p>yes, really very awesome car i see the
                                                                                features of this car in the official
                                                                                website of <a href="#"
                                                                                              title="">#Mercedes-Benz</a> and
                                                                                really impressed :-)</p>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="comet-avatar">
                                                                            <img src="images/resources/comet-3.jpg"
                                                                                 alt=""/>
                                                                        </div>
                                                                        <div className="we-comment">
                                                                            <div className="coment-head">
                                                                                <h5><a href="time-line.html"
                                                                                       title="">Olivia</a></h5>
                                                                                <span>16 days ago</span>
                                                                                <a className="we-reply" href="#"
                                                                                   title="Reply"><i
                                                                                    className="fa fa-reply"></i></a>
                                                                            </div>
                                                                            <p>i like lexus cars, lexus cars are most
                                                                                beautiful with the awesome features, but
                                                                                this car is really outstanding than
                                                                                lexus</p>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </li>
                                                            <li>
                                                                <div className="comet-avatar">
                                                                    <img src="images/resources/comet-1.jpg" alt=""/>
                                                                </div>
                                                                <div className="we-comment">
                                                                    <div className="coment-head">
                                                                        <h5><a href="time-line.html" title="">Donald
                                                                            Trump</a></h5>
                                                                        <span>1 week ago</span>
                                                                        <a className="we-reply" href="#"
                                                                           title="Reply"><i className="fa fa-reply"></i></a>
                                                                    </div>
                                                                    <p>we are working for the dance and sing songs. this
                                                                        video is very awesome for the youngster. please
                                                                        vote this video and like our channel
                                                                        <i className="em em-smiley"></i>
                                                                    </p>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <a href="#" title="" className="showmore underline">more
                                                                    comments</a>
                                                            </li>
                                                            <li className="post-comment">
                                                                <div className="comet-avatar">
                                                                    <img src="images/resources/comet-1.jpg" alt=""/>
                                                                </div>
                                                                <div className="post-comt-box">
                                                                    <form method="post">
                                                                        <textarea
                                                                            placeholder="Post your comment"></textarea>
                                                                        <div className="add-smiles">
                                                                            <span className="em em-expressionless"
                                                                                  title="add icon"></span>
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
                                                                        <button type="submit"></button>
                                                                    </form>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="central-meta item">
                                                <div className="user-post">
                                                    <div className="friend-info">
                                                        <figure>
                                                            <img src="images/resources/nearly1.jpg" alt=""/>
                                                        </figure>
                                                        <div className="friend-name">
                                                            <ins><a href="time-line.html" title="">Sara Grey</a></ins>
                                                            <span>published: june,2 2018 19:PM</span>
                                                        </div>
                                                        <div className="post-meta">
                                                            <iframe src="https://player.vimeo.com/video/15232052"
                                                                    height="315" webkitallowfullscreen
                                                                    mozallowfullscreen allowFullScreen></iframe>
                                                            <div className="we-video-info">
                                                                <ul>
                                                                    <li>
															<span className="views" data-toggle="tooltip" title="views">
																<i className="fa fa-eye"></i>
																<ins>1.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="comment" data-toggle="tooltip"
                                                                  title="Comments">
																<i className="fa fa-comments-o"></i>
																<ins>52</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="like" data-toggle="tooltip" title="like">
																<i className="ti-heart"></i>
																<ins>2.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="dislike" data-toggle="tooltip"
                                                                  title="dislike">
																<i className="ti-heart-broken"></i>
																<ins>200</ins>
															</span>
                                                                    </li>
                                                                    <li className="social-media">
                                                                        <div className="menu">
                                                                            <div className="btn trigger"><i
                                                                                className="fa fa-share-alt"></i></div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-html5"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-facebook"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-google-plus"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-twitter"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-css3"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-instagram"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-dribbble"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-pinterest"></i></a>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="description">

                                                                <p>
                                                                    Lonely Cat Enjoying in Summer Curabitur <a href="#"
                                                                                                               title="">#mypage</a> ullamcorper
                                                                    ultricies nisi. Nam eget dui. Etiam rhoncus.
                                                                    Maecenas tempus, tellus eget condimentum rhoncus,
                                                                    sem quam semper libero, sit amet adipiscing sem
                                                                    neque sed ipsum. Nam quam nunc,
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="coment-area">
                                                        <ul className="we-comet">
                                                            <li>
                                                                <div className="comet-avatar">
                                                                    <img src="images/resources/comet-1.jpg" alt=""/>
                                                                </div>
                                                                <div className="we-comment">
                                                                    <div className="coment-head">
                                                                        <h5><a href="time-line.html" title="">Jason
                                                                            borne</a></h5>
                                                                        <span>1 year ago</span>
                                                                        <a className="we-reply" href="#"
                                                                           title="Reply"><i className="fa fa-reply"></i></a>
                                                                    </div>
                                                                    <p>we are working for the dance and sing songs. this
                                                                        video is very awesome for the youngster. please
                                                                        vote this video and like our channel</p>
                                                                </div>

                                                            </li>
                                                            <li>
                                                                <div className="comet-avatar">
                                                                    <img src="images/resources/comet-2.jpg" alt=""/>
                                                                </div>
                                                                <div className="we-comment">
                                                                    <div className="coment-head">
                                                                        <h5><a href="time-line.html" title="">Sophia</a>
                                                                        </h5>
                                                                        <span>1 week ago</span>
                                                                        <a className="we-reply" href="#"
                                                                           title="Reply"><i className="fa fa-reply"></i></a>
                                                                    </div>
                                                                    <p>we are working for the dance and sing songs. this
                                                                        video is very awesome for the youngster.
                                                                        <i className="em em-smiley"></i>
                                                                    </p>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <a href="#" title="" className="showmore underline">more
                                                                    comments</a>
                                                            </li>
                                                            <li className="post-comment">
                                                                <div className="comet-avatar">
                                                                    <img src="images/resources/comet-2.jpg" alt=""/>
                                                                </div>
                                                                <div className="post-comt-box">
                                                                    <form method="post">
                                                                        <textarea
                                                                            placeholder="Post your comment"></textarea>
                                                                        <div className="add-smiles">
                                                                            <span className="em em-expressionless"
                                                                                  title="add icon"></span>
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
                                                                        <button type="submit"></button>
                                                                    </form>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="central-meta item">
                                                <div className="user-post">
                                                    <div className="friend-info">
                                                        <figure>
                                                            <img src="images/resources/nearly6.jpg" alt=""/>
                                                        </figure>
                                                        <div className="friend-name">
                                                            <ins><a href="time-line.html" title="">Sophia</a></ins>
                                                            <span>published: january,5 2018 19:PM</span>
                                                        </div>
                                                        <div className="post-meta">
                                                            <div className="post-map">
                                                                <div className="nearby-map">
                                                                    <div id="map-canvas"></div>
                                                                </div>
                                                            </div>
                                                            {/*// <!-- near by map -->*/}
                                                            <div className="we-video-info">
                                                                <ul>
                                                                    <li>
															<span className="views" data-toggle="tooltip" title="views">
																<i className="fa fa-eye"></i>
																<ins>1.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="comment" data-toggle="tooltip"
                                                                  title="Comments">
																<i className="fa fa-comments-o"></i>
																<ins>52</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="like" data-toggle="tooltip" title="like">
																<i className="ti-heart"></i>
																<ins>2.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="dislike" data-toggle="tooltip"
                                                                  title="dislike">
																<i className="ti-heart-broken"></i>
																<ins>200</ins>
															</span>
                                                                    </li>
                                                                    <li className="social-media">
                                                                        <div className="menu">
                                                                            <div className="btn trigger"><i
                                                                                className="fa fa-share-alt"></i></div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-html5"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-facebook"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-google-plus"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-twitter"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-css3"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-instagram"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-dribbble"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-pinterest"></i></a>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="description">

                                                                <p>
                                                                    Curabitur Lonely Cat Enjoying in Summer <a href="#"
                                                                                                               title="">#mypage</a> ullamcorper
                                                                    ultricies nisi. Nam eget dui. Etiam rhoncus.
                                                                    Maecenas tempus, tellus eget condimentum rhoncus,
                                                                    sem quam semper libero, sit amet adipiscing sem
                                                                    neque sed ipsum. Nam quam nunc,
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="coment-area">
                                                        <ul className="we-comet">
                                                            <li>
                                                                <div className="comet-avatar">
                                                                    <img src="images/resources/comet-1.jpg" alt=""/>
                                                                </div>
                                                                <div className="we-comment">
                                                                    <div className="coment-head">
                                                                        <h5><a href="time-line.html" title="">Jason
                                                                            borne</a></h5>
                                                                        <span>1 year ago</span>
                                                                        <a className="we-reply" href="#"
                                                                           title="Reply"><i className="fa fa-reply"></i></a>
                                                                    </div>
                                                                    <p>we are working for the dance and sing songs. this
                                                                        video is very awesome for the youngster. please
                                                                        vote this video and like our channel</p>
                                                                </div>

                                                            </li>
                                                            <li>
                                                                <div className="comet-avatar">
                                                                    <img src="images/resources/comet-2.jpg" alt=""/>
                                                                </div>
                                                                <div className="we-comment">
                                                                    <div className="coment-head">
                                                                        <h5><a href="time-line.html" title="">Sophia</a>
                                                                        </h5>
                                                                        <span>1 week ago</span>
                                                                        <a className="we-reply" href="#"
                                                                           title="Reply"><i className="fa fa-reply"></i></a>
                                                                    </div>
                                                                    <p>we are working for the dance and sing songs. this
                                                                        video is very awesome for the youngster.
                                                                        <i className="em em-smiley"></i>
                                                                    </p>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <a href="#" title="" className="showmore underline">more
                                                                    comments</a>
                                                            </li>
                                                            <li className="post-comment">
                                                                <div className="comet-avatar">
                                                                    <img src="images/resources/comet-2.jpg" alt=""/>
                                                                </div>
                                                                <div className="post-comt-box">
                                                                    <form method="post">
                                                                        <textarea
                                                                            placeholder="Post your comment"></textarea>
                                                                        <div className="add-smiles">
                                                                            <span className="em em-expressionless"
                                                                                  title="add icon"></span>
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
                                                                        <button type="submit"></button>
                                                                    </form>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="central-meta item">
                                                <div className="user-post">
                                                    <div className="friend-info">
                                                        <figure>
                                                            <img alt="" src="images/resources/friend-avatar10.jpg"/>
                                                        </figure>
                                                        <div className="friend-name">
                                                            <ins><a title="" href="time-line.html">Janice Griffith</a>
                                                            </ins>
                                                            <span>published: june,2 2018 19:PM</span>
                                                        </div>
                                                        <div className="description">

                                                            <p>
                                                                Curabitur World's most beautiful car in <a title=""
                                                                                                           href="#">#test
                                                                drive booking !</a> the most beatuiful car available in
                                                                america and the saudia arabia, you can book your test
                                                                drive by our official website
                                                            </p>
                                                        </div>
                                                        <div className="post-meta">
                                                            <div className="linked-image align-left">
                                                                <a title="" href="#"><img alt=""
                                                                                          src="images/resources/page1.jpg"/></a>
                                                            </div>
                                                            <div className="detail">
                                                                <span>Love Maid - ChillGroves</span>
                                                                <p>Lorem ipsum dolor sit amet, consectetur ipisicing
                                                                    elit, sed do eiusmod tempor incididunt ut labore et
                                                                    dolore magna aliqua... </p>
                                                                <a title="" href="#">www.sample.com</a>
                                                            </div>
                                                            <div className="we-video-info">
                                                                <ul>
                                                                    <li>
															<span className="views" data-toggle="tooltip" title="views">
																<i className="fa fa-eye"></i>
																<ins>1.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="comment" data-toggle="tooltip"
                                                                  title="Comments">
																<i className="fa fa-comments-o"></i>
																<ins>52</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="like" data-toggle="tooltip" title="like">
																<i className="ti-heart"></i>
																<ins>2.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="dislike" data-toggle="tooltip"
                                                                  title="dislike">
																<i className="ti-heart-broken"></i>
																<ins>200</ins>
															</span>
                                                                    </li>
                                                                    <li className="social-media">
                                                                        <div className="menu">
                                                                            <div className="btn trigger"><i
                                                                                className="fa fa-share-alt"></i></div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-html5"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-facebook"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-google-plus"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-twitter"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-css3"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-instagram"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-dribbble"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a
                                                                                    href="#" title=""><i
                                                                                    className="fa fa-pinterest"></i></a>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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
                                                        <a href="#" title=""><img
                                                            src="images/resources/friend-avatar9.jpg" alt=""/></a>
                                                    </figure>
                                                    <div className="page-meta">
                                                        <a href="#" title="" className="underline">My page</a>
                                                        <span><i className="ti-comment"></i><a href="insight.html"
                                                                                               title="">Messages <em>9</em></a></span>
                                                        <span><i className="ti-bell"></i><a href="insight.html"
                                                                                            title="">Notifications <em>2</em></a></span>
                                                    </div>
                                                    <div className="page-likes">
                                                        <ul className="nav nav-tabs likes-btn">
                                                            <li className="nav-item"><a className="active" href="#link1"
                                                                                        data-toggle="tab">likes</a></li>
                                                            <li className="nav-item"><a className="" href="#link2"
                                                                                        data-toggle="tab">views</a></li>
                                                        </ul>
                                                        {/*// <!-- Tab panes -->*/}
                                                        <div className="tab-content">
                                                            <div className="tab-pane active fade show " id="link1">
                                                                <span><i className="ti-heart"></i>884</span>
                                                                <a href="#" title="weekly-likes">35 new likes this
                                                                    week</a>
                                                                <div className="users-thumb-list">
                                                                    <a href="#" title="Anderw" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-1.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                    <a href="#" title="frank" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-2.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                    <a href="#" title="Sara" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-3.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                    <a href="#" title="Amy" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-4.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                    <a href="#" title="Ema" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-5.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                    <a href="#" title="Sophie" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-6.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                    <a href="#" title="Maria" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-7.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div className="tab-pane fade" id="link2">
                                                                <span><i className="ti-eye"></i>440</span>
                                                                <a href="#" title="weekly-likes">440 new views this
                                                                    week</a>
                                                                <div className="users-thumb-list">
                                                                    <a href="#" title="Anderw" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-1.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                    <a href="#" title="frank" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-2.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                    <a href="#" title="Sara" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-3.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                    <a href="#" title="Amy" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-4.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                    <a href="#" title="Ema" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-5.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                    <a href="#" title="Sophie" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-6.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                    <a href="#" title="Maria" data-toggle="tooltip">
                                                                        <img src="images/resources/userlist-7.jpg"
                                                                             alt=""/>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*// <!-- page like widget -->*/}
                                            <div className="widget">
                                                <div className="banner medium-opacity bluesh">
                                                    <div className="bg-image"
                                                         style={{backgroundImage: "url(images/resources/baner-widgetbg.jpg)"}}></div>
                                                    <div className="baner-top">
                                                        <span><img alt="" src="images/book-icon.png"/></span>
                                                        <i className="fa fa-ellipsis-h"></i>
                                                    </div>
                                                    <div className="banermeta">
                                                        <p>
                                                            create your own favourit page.
                                                        </p>
                                                        <span>like them all</span>
                                                        <a data-ripple="" title="" href="#">start now!</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="widget friend-list stick-widget">
                                                <h4 className="widget-title">Friends</h4>
                                                <div id="searchDir"></div>
                                                <ul id="people-list" className="friendz-list">
                                                    <li>
                                                        <figure>
                                                            <img src="images/resources/friend-avatar.jpg" alt=""/>
                                                            <span className="status f-online"></span>
                                                        </figure>
                                                        <div className="friendz-meta">
                                                            <a href="time-line.html">bucky barnes</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection"
                                                                  className="__cf_email__"
                                                                  data-cfemail="a0d7c9ced4c5d2d3cfccc4c5d2e0c7cdc1c9cc8ec3cfcd">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure>
                                                            <img src="images/resources/friend-avatar2.jpg" alt=""/>
                                                            <span className="status f-away"></span>
                                                        </figure>
                                                        <div className="friendz-meta">
                                                            <a href="time-line.html">Sarah Loren</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection"
                                                                  className="__cf_email__"
                                                                  data-cfemail="b4d6d5c6dad1c7f4d3d9d5ddd89ad7dbd9">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure>
                                                            <img src="images/resources/friend-avatar3.jpg" alt=""/>
                                                            <span className="status f-off"></span>
                                                        </figure>
                                                        <div className="friendz-meta">
                                                            <a href="time-line.html">jason borne</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection"
                                                                  className="__cf_email__"
                                                                  data-cfemail="1d777c6e72737f5d7a707c7471337e7270">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure>
                                                            <img src="images/resources/friend-avatar4.jpg" alt=""/>
                                                            <span className="status f-off"></span>
                                                        </figure>
                                                        <div className="friendz-meta">
                                                            <a href="time-line.html">Cameron diaz</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection"
                                                                  className="__cf_email__"
                                                                  data-cfemail="bed4dfcdd1d0dcfed9d3dfd7d290ddd1d3">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>

                                                        <figure>
                                                            <img src="images/resources/friend-avatar5.jpg" alt=""/>
                                                            <span className="status f-online"></span>
                                                        </figure>
                                                        <div className="friendz-meta">
                                                            <a href="time-line.html">daniel warber</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection"
                                                                  className="__cf_email__"
                                                                  data-cfemail="553f34263a3b37153238343c397b363a38">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>

                                                        <figure>
                                                            <img src="images/resources/friend-avatar6.jpg" alt=""/>
                                                            <span className="status f-away"></span>
                                                        </figure>
                                                        <div className="friendz-meta">
                                                            <a href="time-line.html">andrew</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection"
                                                                  className="__cf_email__"
                                                                  data-cfemail="5933382a36373b193e34383035773a3634">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>

                                                        <figure>
                                                            <img src="images/resources/friend-avatar7.jpg" alt=""/>
                                                            <span className="status f-off"></span>
                                                        </figure>
                                                        <div className="friendz-meta">
                                                            <a href="time-line.html">amy watson</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection"
                                                                  className="__cf_email__"
                                                                  data-cfemail="5933382a36373b193e34383035773a3634">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>

                                                        <figure>
                                                            <img src="images/resources/friend-avatar5.jpg" alt=""/>
                                                            <span className="status f-online"></span>
                                                        </figure>
                                                        <div className="friendz-meta">
                                                            <a href="time-line.html">daniel warber</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection"
                                                                  className="__cf_email__"
                                                                  data-cfemail="dbb1baa8b4b5b99bbcb6bab2b7f5b8b4b6">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>

                                                        <figure>
                                                            <img src="images/resources/friend-avatar2.jpg" alt=""/>
                                                            <span className="status f-away"></span>
                                                        </figure>
                                                        <div className="friendz-meta">
                                                            <a href="time-line.html">Sarah Loren</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection"
                                                                  className="__cf_email__"
                                                                  data-cfemail="2644475448435566414b474f4a0845494b">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
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
                                                                    src="images/resources/chatlist1.jpg" alt=""/></div>
                                                                <div className="notification-event">
															<span className="chat-message-item">
																Hi James! Please remember to buy the food for tomorrow! I’m gonna be handling the gifts and Jake’s gonna get the drinks
															</span>
                                                                    <span className="notification-date"><time
                                                                        datetime="2004-07-24T18:18"
                                                                        className="entry-date updated">Yesterday at 8:10pm</time></span>
                                                                </div>
                                                            </li>
                                                            <li className="you">
                                                                <div className="chat-thumb"><img
                                                                    src="images/resources/chatlist2.jpg" alt=""/></div>
                                                                <div className="notification-event">
															<span className="chat-message-item">
																Hi James! Please remember to buy the food for tomorrow! I’m gonna be handling the gifts and Jake’s gonna get the drinks
															</span>
                                                                    <span className="notification-date"><time
                                                                        datetime="2004-07-24T18:18"
                                                                        className="entry-date updated">Yesterday at 8:10pm</time></span>
                                                                </div>
                                                            </li>
                                                            <li className="me">
                                                                <div className="chat-thumb"><img
                                                                    src="images/resources/chatlist1.jpg" alt=""/></div>
                                                                <div className="notification-event">
															<span className="chat-message-item">
																Hi James! Please remember to buy the food for tomorrow! I’m gonna be handling the gifts and Jake’s gonna get the drinks
															</span>
                                                                    <span className="notification-date"><time
                                                                        datetime="2004-07-24T18:18"
                                                                        className="entry-date updated">Yesterday at 8:10pm</time></span>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        <form className="text-box">
                                                            <textarea placeholder="Post enter to post..."></textarea>
                                                            <div className="add-smiles">
                                                                <span title="add icon"
                                                                      className="em em-expressionless"></span>
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
                                                            <button type="submit"></button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*// <!-- friends list sidebar -->*/}
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

export default Body;