import React, {useEffect, useState} from 'react';
import Service from "../services/Service";
import {Link} from "react-router-dom";
import moment from "moment/moment";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import PostService from "../services/PostService";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../Config/firebase";
import UserService from "../services/UserService";
import {updateUserToken} from '../redux/actions/userActions';
import {v4} from "uuid";
const imageMimeType = /image\/(png|jpg|jpeg)/i;
const Profile = () => {
    const [file, setFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);
    const [account, setAccount] = useState({});
    const [load, setLoad] = useState(true);
    const [posts, setPosts] = useState([]);
    const [postFull, setPostFull] = useState([]);
    const [like, setLike] = useState([]);
    const [menu, setMenu] = useState(false);
    const [status, setStatus] = useState([]);
    const [post, setPost] = useState({});
    const [postContent, setPostContent] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageUpdate, setSelectedImageUpdate] = useState(null);
    const [checkFindImage, setCheckFindImage] = useState(false);
    const userToken = useSelector((state) => state.userToken);
    const dispatch = useDispatch();
    const editAvatar = async (event) => {
        try {
            if (event.target.files[0] == null) {
                return;
            }

            const imageRef = ref(storage, `images/${event.target.files[0].name + v4()}`);
            const snapshot = await uploadBytes(imageRef, event.target.files[0]);
            const url = await getDownloadURL(snapshot.ref);

            const user = {id: userToken.id, avatar: url};

            const response = await UserService.editAvatar(user);

            toast.success("Upload Successfully!");
            toast.success("Edit Avatar Successfully!");

            const updatedUser = {...userToken, ...response.data};
            localStorage.setItem("userToken", JSON.stringify(updatedUser));
            dispatch(updateUserToken(response.data));
            setLoad(true);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Edit Avatar failed!");
        }
    }
    const editThumbnail = async (event) => {
        try {
            if (event.target.files[0] == null) {
                return;
            }
            const imageRef = ref(storage, `images/${event.target.files[0].name + v4()}`);
            const snapshot = await uploadBytes(imageRef, event.target.files[0]);
            const url = await getDownloadURL(snapshot.ref);
            const user = {id: userToken.id, thumbnail: url};
            const response = await UserService.editThumbnail(user);
            toast.success("Upload successful!");
            toast.success("Edit Thumbnail Successfully!");
            const updatedUser = {...userToken, ...response.data};
            localStorage.setItem("userToken", JSON.stringify(updatedUser));
            dispatch(updateUserToken(response.data));
            setLoad(true);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Edit Thumbnail failed!");
        }
    }

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
    useEffect(() => {
        Service.profile().then((response)=>{
            setAccount(response.data)
            console.log(response.data)
        }).catch((error)=>{
            setLoad(false)
        })
    }, [load]);

    useEffect(() => {
        let fileReader, isCancel = false;
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {
                const {result} = e.target;
                if (result && !isCancel) {
                    setFileDataURL(result)
                }
            }
            fileReader.readAsDataURL(file);
            return () => {
                isCancel = true;
                if (fileReader && fileReader.readyState === 1) {
                    fileReader.abort();
                }
            }
        }else{
            setFileDataURL(selectedImageUpdate);
        }


    }, [file,load]);

    useEffect(() => {
        Service.findAllPost().then((response) => {
            const filteredPosts = response.filter((post) => post.loggedInUser.id == localStorage.getItem("idAccount"));
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
            alert("lỗi !")
        })
    }, [load]);

    useEffect(() => {
        if (postContent != "" || selectedImage != null) {
            document.getElementById("post-post").style.backgroundColor = "#38B6FF";
            document.getElementById("post-post").style.color = "#fcfcfc";
        } else {
            document.getElementById("post-post").style.backgroundColor = "#d2d7e1";
            document.getElementById("post-post").style.color = "#888888";
        }
    }, [postContent,selectedImage]);


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
    const changeImage = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (!file.type.match(imageMimeType)) {
            toast.error("Image mime type is not valid");
            return;
        }
        setSelectedImageUpdate(file);
        setSelectedImage(file)
        document.getElementById("selectedImage").style.display = 'block';
        document.getElementById("selectedImageUpdate").style.display = 'block';
        setFile(file);
    }
    const createPost = async () => {
        try {
            if (file == null) {
                let content = document.getElementById("post-content").value;
                let statusId = document.getElementById("status-select").value;
                const newP = {content : content,
                    status : {id:statusId} ,
                    loggedInUser:{id: userToken.id}};
                const response = await PostService.createPost(newP);
                console.log(response.data);
                 document.getElementById("closeModalButton").click();
                toast.success('Create Post Successfully!');
                setPostContent("");
                setLoad(!load);
                return;
            }else {
                let content = document.getElementById("post-content").value;
                let statusId = document.getElementById("status-select").value;
                document.getElementById("loader").style.display = 'block';
                const imageRef = ref(storage, `images/${file.name + v4()}`);
                const snapshot = await uploadBytes(imageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                document.getElementById("loader").style.display = 'none';
                const closeModalButton = document.getElementById("closeModalButton");
                setSelectedImage(file)
                const newP = {content : content,
                    status : {id:statusId},
                    image:url,
                    loggedInUser:{id: userToken.id}
                };
                const response = await PostService.createPost(newP);
                console.log(response.data);
                if (closeModalButton) {
                    closeModalButton.click();
                }
                remoteFile();
                toast.success('Create Post Successfully!');
                setPostContent("");
                setFile(null);
                setFileDataURL(null);
                setLoad(!load);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error('Error while creating the post.');
        }
    }
    const findByPost = (id) => {
        Service.findByPost(id).then((response) => {
            setPost(response)
            document.getElementById("idPostModal").value = response.id;
            document.getElementById("update-post-content").value = response.content;
            document.getElementById("status-select-update").value = response.status.id;
            if(response.image == null || response.image == "" || response.image == undefined){
                setCheckFindImage(false)
            }else{
                document.getElementById("selectedImageUpdate").style.display = 'block';
                setSelectedImageUpdate(response.image);
                setCheckFindImage(true)
                setFileDataURL(response.image)
                // document.getElementById("selectedImageUpdate").style.display = 'block';
            }
            console.log(response);
            setLoad(true);
        }).catch((error) => {
            console.log(error);
        })
    }
    const updatePost = async () => {
        let idPost = document.getElementById("idPostModal").value;
        let content = document.getElementById("update-post-content").value;
        let statusId = document.getElementById("status-select-update").value;

        if (file != null) {
            document.getElementById("loader").style.display = "block";
            const imageRef = ref(storage, `images/${file.name + v4()}`);
            const snapshot = await uploadBytes(imageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            document.getElementById("loader").style.display = "none";
            let post1 = {
                id: idPost,
                content: content,
                status:{id: statusId},
                image: url,
                loggedInUser:{id:account.id}
            };
            Service.updatePost(post1)
                .then((response) => {
                    document.getElementById("post-content").value = "";
                    document.getElementById("selectedImageUpdate").style.display = "none";
                    document.getElementById("closeModalButtonUpdate").click();
                    setFileDataURL(null);
                    setFile(null)
                    setPostContent("");
                    setSelectedImageUpdate(null);
                    setLoad(true);
                    remoteFile();
                })
                .catch((error) => {
                    console.error("Thất bại!", error);
                    alert("Thất bại!");
                });
        }else{
            let post1 = {
                id: idPost,
                content: content,
                status:{id: statusId},
                image: selectedImageUpdate,
                loggedInUser:account
            };
            Service.updatePost(post1)
                .then((response) => {
                    document.getElementById("post-content").value = "";
                    setPostContent("");
                    setSelectedImageUpdate(null);
                    setLoad(true);
                    document.getElementById("selectedImageUpdate").style.display = "none";
                    document.getElementById("closeModalButtonUpdate").click();
                    setFileDataURL(null);
                    setFile(null)
                    remoteFile();
                })
                .catch((error) => {
                    console.error("Thất bại!", error);
                    alert("Thất bại!");
                });
        }

    }
    const remoteFile = () => {
        setSelectedImage(null);
        setPostContent("");
        setLoad(true);
        document.getElementById("selectedImage").style.display = 'none';
        document.getElementById("file1").value = "";
    }
    const remoteFileUpdate = () => {
        setSelectedImageUpdate(null);
        setPostContent("");
        setLoad(true);
        setFileDataURL(null)
        document.getElementById("selectedImageUpdate").style.display = "none";
        // document.getElementById("selectedImageUpdate").style.display = 'none';
        document.getElementById("file2").value = "";
    }
    const menuPost = (id) => {
        if (menu == true) {
            document.getElementById(`menu${id}`).style.display = 'none';
            setMenu(false)
        } else {
            setMenu(true);
            document.getElementById(`menu${id}`).style.display = 'block';
        }
    }
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
    const handlePostContentChange = (e) => {
        setPostContent(e.target.value);
    }
    const likePost = (post) => {
        const isLiked = like.some((likedPost) => likedPost.post.id === post.id && account.id === likedPost.account.id);
        const likeId = isLiked ? like.find((likedPost) => likedPost.post.id === post.id && account.id === likedPost.account.id)?.id : null;
        const action = isLiked ? Service.deleteLike(likeId) : Service.likePost({ account, post });
        action
            .then(() => {
                stompClient.send(isLiked ? '/app/deleteLike' : '/app/like', {}, JSON.stringify({ likeId }));
                setLoad(true);
            })
            .catch((error) => {
                console.error(`Lỗi khi ${isLiked ? 'xóa like' : 'like'}:`, error);
                alert(`Lỗi khi ${isLiked ? 'xóa like' : 'like'}:`);
            });
    };
    const logout = () => {
        localStorage.removeItem("idAccount");
        localStorage.removeItem("token");
        localStorage.removeItem("userToken");
    }

    return (
        <div>
            <section>
                <div className="feature-photo">
                    <figure><img src={userToken.thumbnail} alt="" style={{width: 1536, height: 449.783}}/></figure>
                    <div className="add-btn">
                        <span>1.3k followers</span>
                        <a href="#" title="" data-ripple="">Add button</a>
                    </div>
                    <form className="edit-phto">
                        <i className="fa fa-camera-retro"></i>
                        <label className="fileContainer">
                            Edit Cover Photo
                            <input type="file"
                                   accept='.png, .jpg, .jpeg'
                                   onChange={(event) => {
                                       editThumbnail(event)
                                   }}
                            />
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
                                                <input type="file"
                                                       accept='.png, .jpg, .jpeg'
                                                       onChange={(event) => {
                                                           editAvatar(event)
                                                       }}/>
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
                                            <a className="active" href="fav-page.html" title="" data-ripple="">Page</a>
                                            <a className="" href="notifications.html" title="" data-ripple="">Notifications</a>
                                            <a className="" href="inbox.html" title="" data-ripple="">inbox</a>
                                            <a className="" href="insights.html" title="" data-ripple="">insights</a>
                                            <a className="" href="fav-page.html" title="" data-ripple="">posts</a>
                                            <Link to={"/about"} title="" data-ripple="">About</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section >
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
                                                            <span><a href="#" title="">Commented on Video posted </a></span>
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
                                                            <span><a href="#" title="">Share a video on her timeline.</a></span>
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
                                    <div className="col-lg-6" id="profile-scroll">
                                        <div className="central-meta" id="central-post">
                                            <div className="new-postbox">
                                                <figure>
                                                    <img id="account-post-avatar" src={ account.avatar} alt=""/>
                                                </figure>
                                                <div className="newpst-input">
                                                    <form>
                                                        <button type="button" className="button" style={{ verticalAlign: 'middle'}}  id="post-content-1" data-toggle="modal" data-target="#modalPost">
                                                            <span>
                                                                Write something
                                                            </span>
                                                        </button>
                                                        <div className="attachments">
                                                            <div id="navbar-post">
                                                                <div>
                                                                    <i className="fa fa-music" id="post-icon-music"></i>
                                                                    <label className="fileContainer">
                                                                        <input type="file"/>
                                                                    </label>
                                                                    Music
                                                                </div>
                                                                <div>
                                                                    <i className="fa fa-video-camera" id="post-icon-video"></i>
                                                                    <label className="fileContainer">
                                                                        <input type="file"/>
                                                                    </label>
                                                                    Live Stream
                                                                </div>
                                                                <div>
                                                                    <i className="fa fa-camera" id="post-icon-camera"></i>
                                                                    <label className="fileContainer">
                                                                        <input type="file"/>
                                                                    </label>
                                                                    Camera
                                                                </div>
                                                                <div>
                                                                    <i className="fa fa-image" id="post-icon-img"></i>
                                                                    <label className="fileContainer">
                                                                        {/*<input type="file" id="file1"/>*/}
                                                                    </label>
                                                                    Photo
                                                                </div>
                                                            </div>
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
                                                                <img src={ p.loggedInUser.avatar}
                                                                     id="img-logged" alt=""/>
                                                            </figure>
                                                            <div className="friend-name">
                                                                <ins>
                                                                    {p.loggedInUser.id == account.id ? <Link to={"/profile"}>{p.loggedInUser.firstName} {p.loggedInUser.lastName}</Link> : <Link to={`/${p.loggedInUser.id}`}>{p.loggedInUser.firstName} {p.loggedInUser.lastName}</Link>}
                                                                </ins>
                                                                <span>{moment(p.time).format('MMMM Do YYYY, h:mm:ss a')}</span>
                                                                <span id="status-name">
                                                                     {p.status.name === "public" ? (
                                                                         <i className="fa fa-globe"></i>
                                                                     ) : p.status.name === "friend" ? (
                                                                         <i className="fa fa-user"></i>
                                                                     ) : p.status.name === "private" ? (
                                                                         <i className="fa fa-lock"></i>
                                                                     ) : null}
                                                                </span>
                                                            </div>
                                                            <div className="top-are">
                                                                <div>
                                                                    <button onClick={() => menuPost(p.id)}
                                                                            className="menu-button-post"><span><i
                                                                        className="fa fa-ellipsis-v"></i></span></button>
                                                                    <div id={"menu" + p.id} style={{display: 'none'}} className="menu-div-post">
                                                                        <div className="menu-post">
                                                                            <div className="menu-post-li">
                                                                                {p.loggedInUser.id === account.id ?  <button className="button-menu-1" onClick={() => deletePost(p.id)}>
                                                                                    <i className="fa fa-trash"></i> delete
                                                                                </button> : null}
                                                                            </div>
                                                                            <div className="menu-post-li">
                                                                                {p.loggedInUser.id === account.id ?<button className="button-menu-1" data-toggle="modal" data-target="#modalEditePost" onClick={()=> findByPost(p.id)}><i className="ti-pencil-alt"></i> edit post</button> : null}
                                                                            </div>
                                                                            <div className="menu-post-li">
                                                                                <a href="#" title=""><i className="ti-target"></i>activity log</a>
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
                                                                <div>
                                                                    <p id="post-content-2">
                                                                        {p.content}
                                                                    </p>
                                                                </div>
                                                                <img src={p.image} alt=""/>
                                                                <div className="we-video-info">
                                                                    <ul>
                                                                        <li>
                                                                            <span className="views" data-toggle="tooltip" title="views">
                                                                                <i className="fa fa-eye"></i>
                                                                                <ins>1.2k</ins>
                                                                            </span>
                                                                        </li>
                                                                        <li>
                                                                            <span className="comment" data-toggle="tooltip" title="Comments">
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
                                                            </div>
                                                        </div>
                                                        <div className="coment-area">
                                                            <ul className="we-comet">
                                                                <div className="scroll-comment">
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
                                                                    </ul>
                                                                </div>
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
                                        </div>
                                    </div>
                                    {/*// <!-- centerl meta -->*/}
                                    <div class="col-lg-3">
                                        <aside class="sidebar static">
                                            <div class="advertisment-box">
                                                <h4 class="">advertisment</h4>
                                                <figure>
                                                    <a href="#" title="Advertisment"><img src="images/resources/ad-widget.jpg" alt=""/></a>
                                                </figure>
                                            </div>
                                            <div class="widget">
                                                <h4 class="widget-title">Invite friends</h4>
                                                <ul class="invition">
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar8.jpg" alt=""/></figure>
                                                        <div class="friend-meta">
                                                            <h4><a href="time-line.html" class="underline" title="">Sophia hayat</a></h4>
                                                            <a href="#" title="" class="invite" data-ripple="">invite</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar4.jpg" alt=""/></figure>
                                                        <div class="friend-meta">
                                                            <h4><a href="time-line.html" class="underline" title="">Issabel kaif</a></h4>
                                                            <a href="#" title="" class="invite" data-ripple="">invite</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar2.jpg" alt=""/></figure>
                                                        <div class="friend-meta">
                                                            <h4><a href="time-line.html" class="underline" title="">Kelly Bill</a></h4>
                                                            <a href="#" title="" class="invite" data-ripple="">invite</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar3.jpg" alt=""/></figure>
                                                        <div class="friend-meta">
                                                            <h4><a href="time-line.html" class="underline" title="">Allen jhon</a></h4>
                                                            <a href="#" title="" class="invite" data-ripple="">invite</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar6.jpg" alt=""/></figure>
                                                        <div class="friend-meta">
                                                            <h4><a href="time-line.html" class="underline" title="">tom Andrew</a></h4>
                                                            <a href="#" title="" class="invite" data-ripple="">invite</a>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <figure><img src="images/resources/friend-avatar3.jpg" alt=""/></figure>
                                                        <div class="friend-meta">
                                                            <h4><a href="time-line.html" title="" class="underline">Allen doe</a></h4>
                                                            <a href="#" title="" class="invite" data-ripple="">invite</a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/*// <!-- invite for page  -->*/}

                                            <div class="widget friend-list stick-widget">
                                                <h4 class="widget-title">Friends</h4>
                                                <div id="searchDir"></div>
                                                <ul id="people-list" class="friendz-list">
                                                    <li>
                                                        <figure>
                                                            <img src="images/resources/friend-avatar.jpg" alt=""/>
                                                            <span class="status f-online"></span>
                                                        </figure>
                                                        <div class="friendz-meta">
                                                            <a href="time-line.html">bucky barnes</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="1e6977706a7b6c6d71727a7b6c5e79737f7772307d7173">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure>
                                                            <img src="images/resources/friend-avatar2.jpg" alt=""/>
                                                            <span class="status f-away"></span>
                                                        </figure>
                                                        <div class="friendz-meta">
                                                            <a href="time-line.html">Sarah Loren</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="debcbfacb0bbad9eb9b3bfb7b2f0bdb1b3">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure>
                                                            <img src="images/resources/friend-avatar3.jpg" alt=""/>
                                                            <span class="status f-off"></span>
                                                        </figure>
                                                        <div class="friendz-meta">
                                                            <a href="time-line.html">jason borne</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="0e646f7d61606c4e69636f6762206d6163">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure>
                                                            <img src="images/resources/friend-avatar4.jpg" alt=""/>
                                                            <span class="status f-off"></span>
                                                        </figure>
                                                        <div class="friendz-meta">
                                                            <a href="time-line.html">Cameron diaz</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="513b30223e3f3311363c30383d7f323e3c">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>

                                                        <figure>
                                                            <img src="images/resources/friend-avatar5.jpg" alt=""/>
                                                            <span class="status f-online"></span>
                                                        </figure>
                                                        <div class="friendz-meta">
                                                            <a href="time-line.html">daniel warber</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="315b50425e5f5371565c50585d1f525e5c">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>

                                                        <figure>
                                                            <img src="images/resources/friend-avatar6.jpg" alt=""/>
                                                            <span class="status f-away"></span>
                                                        </figure>
                                                        <div class="friendz-meta">
                                                            <a href="time-line.html">andrew</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="f69c9785999894b6919b979f9ad895999b">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>

                                                        <figure>
                                                            <img src="images/resources/friend-avatar7.jpg" alt=""/>
                                                            <span class="status f-off"></span>
                                                        </figure>
                                                        <div class="friendz-meta">
                                                            <a href="time-line.html">amy watson</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="bad0dbc9d5d4d8faddd7dbd3d694d9d5d7">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>

                                                        <figure>
                                                            <img src="images/resources/friend-avatar5.jpg" alt=""/>
                                                            <span class="status f-online"></span>
                                                        </figure>
                                                        <div class="friendz-meta">
                                                            <a href="time-line.html">daniel warber</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="076d667468696547606a666e6b2964686a">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                    <li>

                                                        <figure>
                                                            <img src="images/resources/friend-avatar2.jpg" alt=""/>
                                                            <span class="status f-away"></span>
                                                        </figure>
                                                        <div class="friendz-meta">
                                                            <a href="time-line.html">Sarah Loren</a>
                                                            <i><a href="https://wpkixx.com/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="b1d3d0c3dfd4c2f1d6dcd0d8dd9fd2dedc">[email&#160;protected]</a></i>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <div class="chat-box">
                                                    <div class="chat-head">
                                                        <span class="status f-online"></span>
                                                        <h6>Bucky Barnes</h6>
                                                        <div class="more">
                                                            <span><i class="ti-more-alt"></i></span>
                                                            <span class="close-mesage"><i class="ti-close"></i></span>
                                                        </div>
                                                    </div>
                                                    <div class="chat-list">
                                                        <ul>
                                                            <li class="me">
                                                                <div class="chat-thumb"><img src="images/resources/chatlist1.jpg" alt=""/></div>
                                                                <div class="notification-event">
															<span class="chat-message-item">
																Hi James! Please remember to buy the food for tomorrow! I’m gonna be handling the gifts and Jake’s gonna get the drinks
															</span>
                                                                    <span class="notification-date"><time datetime="2004-07-24T18:18" class="entry-date updated">Yesterday at 8:10pm</time></span>
                                                                </div>
                                                            </li>
                                                            <li class="you">
                                                                <div class="chat-thumb"><img src="images/resources/chatlist2.jpg" alt=""/></div>
                                                                <div class="notification-event">
															<span class="chat-message-item">
																Hi James! Please remember to buy the food for tomorrow! I’m gonna be handling the gifts and Jake’s gonna get the drinks
															</span>
                                                                    <span class="notification-date"><time datetime="2004-07-24T18:18" class="entry-date updated">Yesterday at 8:10pm</time></span>
                                                                </div>
                                                            </li>
                                                            <li class="me">
                                                                <div class="chat-thumb"><img src="images/resources/chatlist1.jpg" alt=""/></div>
                                                                <div class="notification-event">
															<span class="chat-message-item">
																Hi James! Please remember to buy the food for tomorrow! I’m gonna be handling the gifts and Jake’s gonna get the drinks
															</span>
                                                                    <span class="notification-date"><time datetime="2004-07-24T18:18" class="entry-date updated">Yesterday at 8:10pm</time></span>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        <form class="text-box">
                                                            <textarea placeholder="Post enter to post..."></textarea>
                                                            <div class="add-smiles">
                                                                <span title="add icon" class="em em-expressionless"></span>
                                                            </div>
                                                            <div class="smiles-bunch">
                                                                <i class="em em---1"></i>
                                                                <i class="em em-smiley"></i>
                                                                <i class="em em-anguished"></i>
                                                                <i class="em em-laughing"></i>
                                                                <i class="em em-angry"></i>
                                                                <i class="em em-astonished"></i>
                                                                <i class="em em-blush"></i>
                                                                <i class="em em-disappointed"></i>
                                                                <i class="em em-worried"></i>
                                                                <i class="em em-kissing_heart"></i>
                                                                <i class="em em-rage"></i>
                                                                <i class="em em-stuck_out_tongue"></i>
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
            <div className="modal" id="modalPost">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" >create articles</h4>
                            <button type="button" className="close" data-dismiss="modal" id="closeModalButton">&times;</button>
                        </div>
                        <div id="modal-avatar">
                            <div>
                                <figure>
                                    <img id="account-post-avatar-2" src={ account.avatar} alt=""/>
                                </figure>
                            </div>
                            <div id="modal-avatar-fill">
                                <div>
                                    <h5 id="h5-modal">{account.firstName} {account.lastName}</h5>
                                </div>
                                <div>
                                    <select id="status-select">
                                        {status.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-body">
                             <textarea rows="2" placeholder="write something ... ?" id="post-content" onChange={handlePostContentChange}>
                            </textarea><br/>
                        </div>
                        <div id="seclect-img-display">
                            <div className="post-meta">
                                <img src={fileDataURL} alt="Selected Image"
                                     id="selectedImage" style={{display: 'none'}}/>
                                {selectedImage && (
                                    <span className="remove-image" onClick={remoteFile}>
                                      <svg id="bi-x-square" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-square" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                  </span>
                                )}
                            </div>
                            <div className="attachments" id="change-file-img">
                                <ul>
                                    <li>
                                        <h6>
                                            Add to your article  !
                                        </h6>
                                    </li>
                                    <li>
                                        <i className="fa fa-image" id="icon-post-img"></i>
                                        <label className="fileContainer">
                                            <input type="file" id="file1" accept='.png, .jpg, .jpeg' onChange={changeImage}/>
                                        </label>
                                    </li>
                                    <li>
                                        <i className="fa fa-video-camera" id="icon-post-video"></i>
                                        <label className="fileContainer">
                                            <input type="file"/>
                                        </label>
                                    </li>
                                    <li>
                                        <i className="fa fa-camera" id="icon-post-camera"></i>
                                        <label className="fileContainer">
                                            <input type="file"/>
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="post-post"  onClick={() => createPost()}>Post</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id="modalEditePost">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" >Edit article</h4>
                            <button type="button" className="close" data-dismiss="modal" id="closeModalButtonUpdate">&times;</button>
                        </div>
                        <div id="modal-avatar">
                            <input type="hidden" id="idPostModal" />
                            <div>
                                <figure>
                                    <img id="account-post-avatar-2" src={ account.avatar} alt=""/>
                                </figure>
                            </div>
                            <div id="modal-avatar-fill">
                                <div>
                                    <h5 id="h5-modal">{account.firstName} {account.lastName}</h5>
                                </div>
                                <div>
                                    <select id="status-select-update">
                                        {status.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-body">
                             <textarea rows="2" placeholder="write something ... ?" id="update-post-content" onChange={handlePostContentChange}>
                            </textarea><br/>
                        </div>
                        <div id="seclect-img-display">
                            <div className="post-meta">
                                <img src={fileDataURL} alt="Selected Image" id="selectedImageUpdate" style={{ display: 'none' }} />
                                {fileDataURL !== null && (
                                    <span className="remove-image-update" onClick={remoteFileUpdate}>
                                        <svg id="bi-x-square" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-square" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                          </span>
                                )}
                            </div>

                            <div className="attachments" id="change-file-img">
                                <ul>
                                    <li>
                                        <h6>
                                            Add to your article  !
                                        </h6>
                                    </li>
                                    <li>
                                        <i className="fa fa-image" id="icon-post-img"></i>
                                        <label className="fileContainer">
                                            <input type="file" id="file2" accept='.png, .jpg, .jpeg' onChange={changeImage}/>
                                        </label>
                                    </li>
                                    <li>
                                        <i className="fa fa-video-camera" id="icon-post-video"></i>
                                        <label className="fileContainer">
                                            <input type="file"/>
                                        </label>
                                    </li>
                                    <li>
                                        <i className="fa fa-camera" id="icon-post-camera"></i>
                                        <label className="fileContainer">
                                            <input type="file"/>
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="post-post"  onClick={() => updatePost()}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="loader" id="loader" style={{display:"none"}}></div>
        </div>
    );
};

export default Profile;