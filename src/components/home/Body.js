import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Service from "../../services/Service";
import moment from 'moment';
import {toast } from 'react-toastify';
import {storage} from "../../Config/firebase";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {v4} from "uuid";
import PostService from "../../services/PostService";
import {useSelector} from "react-redux";


const imageMimeType = /image\/(png|jpg|jpeg)/i;
const Body = () => {
    const [menu, setMenu] = useState(false);
    const [post, setPost] = useState({});
    const [file, setFile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [status, setStatus] = useState([]);
    const [postFull, setPostFull] = useState([]);
    const [like, setLike] = useState([]);
    const [account, setAccount] = useState([]);
    const [load, setLoad] = useState(true);
    const [checkFindImage, setCheckFindImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [postContent, setPostContent] = useState("");
    const [selectedImageUpdate, setSelectedImageUpdate] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState({});
    const [id, setId] = useState(0);
    const [editComment, setEditComment] = useState("")
    const userToken = useSelector((state) => state.userToken);
    useEffect(() => {
        Service.findAllPost().then((response) => {
            const filteredPosts = response.filter((post) => post.status.name === "public" || post.status.name === "friend" || post.loggedInUser.id === localStorage.getItem("idAccount"));
            const sortedPosts = filteredPosts.sort((a, b) => new Date(b.time) - new Date(a.time));
            setPosts(sortedPosts);
            setLoad(false);
        }).catch((error) => {
            console.log(error);
        });
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
        Service.getAllStatus().then((response) => {
            setStatus(response.data);
        }).catch((error) => {
            console.log(error)
        })
    }, [load]);
    useEffect(() => {
        Service.findAllLike().then((response) => {
            setLike(response)
        }).catch((error) => {
            console.log(error);
        })
    }, [load]);
    useEffect(() => {
        const updatedPosts = posts.map((post) => {
            const countLike = like.filter((likedPost) => likedPost.post.id === post.id).length;
            const listComment = comments.filter((comment) => comment.post.id === post.id);
            return {
                status: post.status,
                id: post.id,
                loggedInUser: post.loggedInUser,
                content: post.content,
                time: post.time,
                image: post.image,
                countLike: countLike,
                listComment: listComment,
            };
        });
        setPostFull(updatedPosts);
    }, [posts]);
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
        const commentButton = document.getElementById(`cmt-cmt${id}`);
        if (commentButton) {
            if (content !== "") {
                commentButton.style.backgroundColor = "#38B6FF";
                commentButton.style.color = "#fcfcfc";
            } else {
                commentButton.style.backgroundColor = "#d2d7e1";
                commentButton.style.color = "#888888";
            }
        }
    }, [content, id]);
    const setId123 = (id1) => {
        setId(id1)
    }
    useEffect(() => {
        Service.getAllComment()
            .then((response) => {
                const sortedComments = response.sort((a, b) => {
                    return new Date(b.time) - new Date(a.time);
                });
                setComments(sortedComments);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [load])
    const logout = () => {
        localStorage.removeItem("idAccount");localStorage.removeItem("token");localStorage.removeItem("account");
    }
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
                const closeModalButton = document.getElementById("closeModalButton");
                if (closeModalButton) {
                    closeModalButton.click();
                }
                toast.success('Create Post Successfully!');
                setPostContent("");
                setLoad(!load);
                return;
            }else {
                let content = document.getElementById("post-content").value;
                let statusId = document.getElementById("status-select").value;
                const imageRef = ref(storage, `images/${file.name + v4()}`);
                const snapshot = await uploadBytes(imageRef, file);
                const url = await getDownloadURL(snapshot.ref);
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
                remoteFile()
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
    const handleFileChangeUpdate = (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImageUpdate(reader.result);
                setPostContent(e.target.value);
                document.getElementById("selectedImageUpdate").style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImageUpdate(null);
            document.getElementById("selectedImageUpdate").style.display = 'none';
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
            const imageRef = ref(storage, `images/${file.name + v4()}`);
            const snapshot = await uploadBytes(imageRef, file);
            const url = await getDownloadURL(snapshot.ref);
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
                    toast.error("error !");
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
                    toast.error("error !");
                });
        }

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
    const loadImage = (imageFileName) => {
        const img = new Image();
        img.src = imageFileName;
        img.onload = () => {
            document.getElementById("selectedImageUpdate").src = img.src;
            document.getElementById("selectedImageUpdate").style.display = 'block';
        };
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
        }).catch((error) => {
            console.log(error);
        })
    }, []);
    const deletePost = (id) => {
        Service.deletePost(id)
            .then((response) => {
                setLoad(true);
            })
            .catch((error) => {
                console.error(error);
                toast.error("error");
            });
    }
    const likePost = (post) => {
        const isLiked = like.some((likedPost) => likedPost.post.id === post.id && account.id === likedPost.account.id);
        const likeId = isLiked ? like.find((likedPost) => likedPost.post.id === post.id && account.id === likedPost.account.id)?.id : null;
        const action = isLiked ? Service.deleteLike(likeId) : Service.likePost({ account, post });
        setLoad(true);
    };
    const handleCommentChange = (e) => {
        setContent(e.target.value);
    };
    const createComment = (p) => {
        const comments = {
            creator: account,
            post: p,
            content: content
        }
        if (content == null || content == undefined || content == "") {
            toast.warning("content not null")
        } else {
            Service.addComment(comments).then((response) => {
                console.log(response);
                toast.success("create success");
                setContent("")
                // navigate("/");
                document.getElementById("post-content-input").value = "";
                setLoad(true)
            }).catch(function (err) {
                console.log(err);
            })
        }

    }
    const deleteComment = (id) => {
        Service.deleteComment(id)
            .then((response) => {
                setLoad(true);
            })
            .catch((error) => {
                console.error('Lỗi khi xóa comment:', error);
                toast.error("error delete comment !")
            });
    }
    const updateComment = (cmt) => {
        let comment = {
            ...comments,
            id: cmt.id,
            content: editComment,
            creator: account
        }
        Service.updateComment(comment).then((response) => {
            console.log(response);
           toast.success("update comment success !")
            setLoad(true)
            document.getElementById("click").click();
            document.getElementById(`edit-cmt-input${comment.id}`).style.display = "none";


            // document.getElementById("click").click();
        }).catch(function (err) {
            console.log(err);
        })


    }
    const handleEditComment = (e) => {
        setEditComment(e.target.value);
    };
    const handleCancelEdit = () => {
        setEditComment(null);
    };

    const openEditComment = (id) => {
        document.getElementById(`edit-cmt-input${id}`).style.display= "block";
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
    const menuComment = (id) => {
        const element = document.getElementById(`menu-abc${id}`);
        if (element) {
            if (menu) {
                element.style.display = 'none';
            } else {
                element.style.display = 'block';
            }
        }
        setMenu(!menu); // Toggle the menu state
    }
    return (
        <div>
            <section>
                <div className="gap gray-bg" id="gray-bg">
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
                                                        <Link to={"/home"} title="">News feed</Link>
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
                                        <div className="central-meta" id="central-post">
                                            <div className="new-postbox">
                                                <figure>
                                                    <img id="account-post-avatar" src={account.avatar} alt=""/>
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
                                        <div>

                                        </div>
                                        {/*// <!-- add post new box -->*/}
                                        <div className="loadMore">
                                            {postFull.map((p) => (
                                                <div className="central-meta item" key={p.id}>
                                                    <div className="user-post">
                                                        <div className="friend-info">
                                                            <figure>
                                                                <img src={p.loggedInUser.avatar}
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
                                                                                {p.loggedInUser.id == account.id ?  <button className="button-menu-1" onClick={() => deletePost(p.id)}>
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
                                                                        {p.listComment.map((c) => (
                                                                            <li>
                                                                                <div className="comet-avatar">
                                                                                    <img
                                                                                        src={c.creator.avatar}
                                                                                        alt="" id="img-logged"/>
                                                                                </div>
                                                                                <div className="we-comment">
                                                                                    <div className="coment-head">
                                                                                        <h5><a href="time-line.html"
                                                                                               title="">{c.creator.firstName} {c.creator.lastName}</a>
                                                                                        </h5>
                                                                                        <span>{calculateTimeChat(c.time)}</span>
                                                                                        <a className="we-reply" href="#"
                                                                                           title="Reply"><i
                                                                                            className="fa fa-reply"></i></a>
                                                                                    </div>
                                                                                    <div className="top-cmt">
                                                                                        <div>
                                                                                            {account.id === c.creator.id ? (
                                                                                                <button
                                                                                                    onClick={() => menuComment(c.id)}
                                                                                                    className="menu-button-cmt">
                                                                                                        <span id={"click"}>
                                                                                                            <i className="fa fa-ellipsis-h"></i>
                                                                                                        </span>
                                                                                                </button>) : null}
                                                                                            <div id={"menu-abc" + c.id}
                                                                                                 style={{display: 'none'}}
                                                                                                 className="menu-div-cmt">
                                                                                                <div
                                                                                                    className="menu-cmt">
                                                                                                    <div
                                                                                                        className="menu-cmt-li">
                                                                                                        {account.id === c.creator.id ? (
                                                                                                            <button
                                                                                                                className="button-menu-1"
                                                                                                                onClick={() => deleteComment(c.id)}>
                                                                                                                Delete
                                                                                                            </button>
                                                                                                        ) : null}
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="menu-post-li">
                                                                                                        <button id={"update-cmt"} ><span onClick={()=>openEditComment(c.id)} >Edit Comment</span></button>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="menu-post-li">
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="menu-post-li">
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div>
                                                                                                <div>
                                                                                                    <p>{c.content}</p>
                                                                                                </div>
                                                                                                <div id={"edit-cmt-input"+c.id} style={{display: "none"}}>
                                                                                                    <textarea placeholder="edit comment" value={editComment.trim()}
                                                                                                              onChange={(e) => {
                                                                                                                  handleEditComment(e);

                                                                                                                  // setId123(c.id);
                                                                                                              }}
                                                                                                    />
                                                                                                    <button onClick={()=> updateComment(c)} className={"save-cmt-post"}>save</button>
                                                                                                </div>

                                                                                            </div>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                <li className="post-comment">
                                                                    <div className="comet-avatar">
                                                                        <img src="images/resources/comet-1.jpg" alt=""/>
                                                                    </div>
                                                                    <div className="post-comt-box">
                                                                        <form method="post">
                                                                      <textarea
                                                                          id="post-content-input"
                                                                          placeholder="Post your comment"
                                                                          onChange={(e) => {
                                                                              handleCommentChange(e);
                                                                              setId123(p.id);
                                                                          }}
                                                                      ></textarea>

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
                                                                            <button className={"sent-icon"} type="button" id={`cmt-cmt${p.id}`} onClick={() => createComment(p)}>
                                                                                <i className="fa fa-paper-plane"/>
                                                                            </button>
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
                                <img id="account-post-avatar-2" src={account.avatar} alt=""/>
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
        </div>
    );
};

export default Body;