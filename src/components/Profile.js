import React, {useEffect, useState} from 'react';
import Service from "../services/Service";
import {Link} from "react-router-dom";

const Profile = () => {
    const [account, setAccount] = useState({});
    const [load, setLoad] = useState(true);
    useEffect(() => {
        Service.profile().then((response)=>{
            setAccount(response.data)
            console.log(response.data)
        }).catch((error)=>{
            setLoad(false)
        })
    }, [load]);
    const logout = () => {
        localStorage.removeItem("idAccount");
        localStorage.removeItem("token");
    }
    return (
        <div>
            <section>
                <div className="feature-photo">
                    <figure><img src="images/resources/timeline-4.jpg" alt=""/></figure>
                    <div className="add-btn">
                        <span>1.3k followers</span>
                        <a href="#" title="" data-ripple="">Add button</a>
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
                                            <h5>{account.firstName} {account.lastName}</h5>
                                            <span>{account.email}</span>
                                        </li>
                                        <li>
                                            <a className="active" href="fav-page.html" title="" data-ripple="">Page</a>
                                            <a className="" href="notifications.html" title="" data-ripple="">Notifications</a>
                                            <a className="" href="inbox.html" title="" data-ripple="">inbox</a>
                                            <a className="" href="insights.html" title="" data-ripple="">insights</a>
                                            <a className="" href="fav-page.html" title="" data-ripple="">posts</a>
                                            <a className="" href="page-likers.html" title="" data-ripple="">likers</a>
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
                                        <div className="central-meta">
                                            <div className="new-postbox">
                                                <figure>
                                                    <img id="img-post-account" src={`images/profile/`+account.avatar} alt=""/>
                                                </figure>
                                                <div className="newpst-input">
                                                    <form method="post">
                                                        <textarea rows="3" placeholder="write something"></textarea>
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
                                                                        <input type="file"/>
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
                                                                    <button type="submit">Publish</button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        {/*// <!-- add post new box -->*/}
                                        <div className="loadMore">
                                            <div className="central-meta item">
                                                <div className="user-post">
                                                    <div className="friend-info">
                                                        <figure>
                                                            <img src="images/resources/friend-avatar11.jpg" alt=""/>
                                                        </figure>
                                                        <div className="friend-name">
                                                            <ins><a href="time-line.html" title="">Natti Natasha</a></ins>
                                                            <span>published: june,2 2018 19:PM</span>
                                                        </div>
                                                        <div className="post-meta">
                                                            <img src="images/resources/user-post6.jpg" alt=""/>
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
															<span className="like" data-toggle="tooltip" title="like">
																<i className="ti-heart"></i>
																<ins>2.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="dislike" data-toggle="tooltip" title="dislike">
																<i className="ti-heart-broken"></i>
																<ins>200</ins>
															</span>
                                                                    </li>
                                                                    <li className="social-media">
                                                                        <div className="menu">
                                                                            <div className="btn trigger"><i className="fa fa-share-alt"></i></div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-html5"></i></a></div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-facebook"></i></a></div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-google-plus"></i></a></div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-twitter"></i></a></div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-css3"></i></a></div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-instagram"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-dribbble"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-pinterest"></i></a>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="description">
                                                                <span>beautiful lamp on discount 50%</span>
                                                                <p>
                                                                    Amazon <a href="#" title="">#amazonee</a> the most beatuiful lamp available in america and the saudia arabia, you can purchase for the home and shop for increase the room beauty
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
                                                                        <h5><a href="time-line.html" title="">Donald Trump</a></h5>
                                                                        <span>1 week ago</span>
                                                                        <a className="we-reply" href="#" title="Reply"><i className="fa fa-reply"></i></a>
                                                                    </div>
                                                                    <p>we are working for the dance and sing songs. this video is very awesome for the youngster. please vote this video and like our channel
                                                                        <i className="em em-smiley"></i>
                                                                    </p>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="comet-avatar">
                                                                    <img src="images/resources/comet-3.jpg" alt=""/>
                                                                </div>
                                                                <div className="we-comment">
                                                                    <div className="coment-head">
                                                                        <h5><a href="time-line.html" title="">Jason borne</a></h5>
                                                                        <span>1 year ago</span>
                                                                        <a className="we-reply" href="#" title="Reply"><i className="fa fa-reply"></i></a>
                                                                    </div>
                                                                    <p>we are working for the dance and sing songs. this car is very awesome for the youngster. please vote this car and like our post</p>
                                                                </div>
                                                                <ul>
                                                                    <li>
                                                                        <div className="comet-avatar">
                                                                            <img src="images/resources/comet-2.jpg" alt=""/>
                                                                        </div>
                                                                        <div className="we-comment">
                                                                            <div className="coment-head">
                                                                                <h5><a href="time-line.html" title="">alexendra dadrio</a></h5>
                                                                                <span>1 month ago</span>
                                                                                <a className="we-reply" href="#" title="Reply"><i className="fa fa-reply"></i></a>
                                                                            </div>
                                                                            <p>yes, really very awesome car i see the features of this car in the official website of <a href="#" title="">#Mercedes-Benz</a> and really impressed :-)</p>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="comet-avatar">
                                                                            <img src="images/resources/comet-3.jpg" alt=""/>
                                                                        </div>
                                                                        <div className="we-comment">
                                                                            <div className="coment-head">
                                                                                <h5><a href="time-line.html" title="">Olivia</a></h5>
                                                                                <span>16 days ago</span>
                                                                                <a className="we-reply" href="#" title="Reply"><i className="fa fa-reply"></i></a>
                                                                            </div>
                                                                            <p>i like lexus cars, lexus cars are most beautiful with the awesome features, but this car is really outstanding than lexus</p>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </li>

                                                            <li>
                                                                <a href="#" title="" className="showmore underline">more comments</a>
                                                            </li>
                                                            <li className="post-comment">
                                                                <div className="comet-avatar">
                                                                    <img src="images/resources/comet-4.jpg" alt=""/>
                                                                </div>
                                                                <div className="post-comt-box">
                                                                    <form method="post">
                                                                        <textarea placeholder="Post your comment"></textarea>
                                                                        <div className="add-smiles">
                                                                            <span className="em em-expressionless" title="add icon"></span>
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
                                                            <img src="images/resources/friend-avatar11.jpg" alt=""/>
                                                        </figure>
                                                        <div className="friend-name">
                                                            <ins><a href="time-line.html" title="">Sarah grey</a></ins>
                                                            <span>published: june,2 2018 19:PM</span>
                                                        </div>
                                                        <div className="post-meta">
                                                            <img src="images/resources/user-post7.jpg" alt=""/>
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
															<span className="like" data-toggle="tooltip" title="like">
																<i className="ti-heart"></i>
																<ins>2.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span className="dislike" data-toggle="tooltip" title="dislike">
																<i className="ti-heart-broken"></i>
																<ins>200</ins>
															</span>
                                                                    </li>
                                                                    <li className="social-media">
                                                                        <div className="menu">
                                                                            <div className="btn trigger"><i className="fa fa-share-alt"></i></div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-html5"></i></a></div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-facebook"></i></a></div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-google-plus"></i></a></div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-twitter"></i></a></div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-css3"></i></a></div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-instagram"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-dribbble"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rotater">
                                                                                <div className="btn btn-icon"><a href="#" title=""><i className="fa fa-pinterest"></i></a>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="description">
                                                                <span>Leather bag 70% discount in Summer</span>
                                                                <p>
                                                                    Curabitur <a href="#" title="">#amazon_shop</a> ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc,
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
                                                                        <h5><a href="time-line.html" title="">Jason borne</a></h5>
                                                                        <span>1 year ago</span>
                                                                        <a className="we-reply" href="#" title="Reply"><i className="fa fa-reply"></i></a>
                                                                    </div>
                                                                    <p>we are working for the dance and sing songs. this video is very awesome for the youngster. please vote this video and like our channel</p>
                                                                </div>

                                                            </li>
                                                            <li>
                                                                <div className="comet-avatar">
                                                                    <img src="images/resources/comet-2.jpg" alt=""/>
                                                                </div>
                                                                <div className="we-comment">
                                                                    <div className="coment-head">
                                                                        <h5><a href="time-line.html" title="">Sophia</a></h5>
                                                                        <span>1 week ago</span>
                                                                        <a class="we-reply" href="#" title="Reply"><i class="fa fa-reply"></i></a>
                                                                    </div>
                                                                    <p>we are working for the dance and sing songs. this video is very awesome for the youngster.
                                                                        <i class="em em-smiley"></i>
                                                                    </p>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <a href="#" title="" class="showmore underline">more comments</a>
                                                            </li>
                                                            <li class="post-comment">
                                                                <div class="comet-avatar">
                                                                    <img src="images/resources/comet-4.jpg" alt=""/>
                                                                </div>
                                                                <div class="post-comt-box">
                                                                    <form method="post">
                                                                        <textarea placeholder="Post your comment"></textarea>
                                                                        <div class="add-smiles">
                                                                            <span class="em em-expressionless" title="add icon"></span>
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
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="central-meta item">
                                                <div class="user-post">
                                                    <div class="friend-info">
                                                        <figure>
                                                            <img src="images/resources/friend-avatar10.jpg" alt=""/>
                                                        </figure>
                                                        <div class="friend-name">
                                                            <ins><a href="time-line.html" title="">Janice Griffith</a></ins>
                                                            <span>published: june,2 2018 19:PM</span>
                                                        </div>
                                                        <div class="description">

                                                            <p>
                                                                Curabitur World's most beautiful car in <a href="#" title="">#test drive booking !</a> the most beatuiful car available in america and the saudia arabia, you can book your test drive by our official website
                                                            </p>
                                                        </div>
                                                        <div class="post-meta">
                                                            <div class="linked-image align-left">
                                                                <a href="#" title=""><img src="images/resources/page1.jpg" alt=""/></a>
                                                            </div>
                                                            <div class="detail">
                                                                <span>Love Maid - ChillGroves</span>
                                                                <p>Lorem ipsum dolor sit amet, consectetur ipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua... </p>
                                                                <a href="#" title="">www.sample.com</a>
                                                            </div>
                                                            <div class="we-video-info">
                                                                <ul>
                                                                    <li>
															<span class="views" data-toggle="tooltip" title="views">
																<i class="fa fa-eye"></i>
																<ins>1.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span class="comment" data-toggle="tooltip" title="Comments">
																<i class="fa fa-comments-o"></i>
																<ins>52</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span class="like" data-toggle="tooltip" title="like">
																<i class="ti-heart"></i>
																<ins>2.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span class="dislike" data-toggle="tooltip" title="dislike">
																<i class="ti-heart-broken"></i>
																<ins>200</ins>
															</span>
                                                                    </li>
                                                                    <li class="social-media">
                                                                        <div class="menu">
                                                                            <div class="btn trigger"><i class="fa fa-share-alt"></i></div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-html5"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-facebook"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-google-plus"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-twitter"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-css3"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-instagram"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-dribbble"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-pinterest"></i></a>
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
                                            <div class="central-meta item">
                                                <div class="user-post">
                                                    <div class="friend-info">
                                                        <figure>
                                                            <img src="images/resources/friend-avatar10.jpg" alt=""/>
                                                        </figure>
                                                        <div class="friend-name">
                                                            <ins><a href="time-line.html" title="">Janice Griffith</a></ins>
                                                            <span>published: june,2 2018 19:PM</span>
                                                        </div>
                                                        <div class="post-meta">
                                                            <iframe src="https://player.vimeo.com/video/15232052" height="315" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                                                            <div class="we-video-info">
                                                                <ul>
                                                                    <li>
															<span class="views" data-toggle="tooltip" title="views">
																<i class="fa fa-eye"></i>
																<ins>1.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span class="comment" data-toggle="tooltip" title="Comments">
																<i class="fa fa-comments-o"></i>
																<ins>52</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span class="like" data-toggle="tooltip" title="like">
																<i class="ti-heart"></i>
																<ins>2.2k</ins>
															</span>
                                                                    </li>
                                                                    <li>
															<span class="dislike" data-toggle="tooltip" title="dislike">
																<i class="ti-heart-broken"></i>
																<ins>200</ins>
															</span>
                                                                    </li>
                                                                    <li class="social-media">
                                                                        <div class="menu">
                                                                            <div class="btn trigger"><i class="fa fa-share-alt"></i></div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-html5"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-facebook"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-google-plus"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-twitter"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-css3"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-instagram"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-dribbble"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-pinterest"></i></a>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div class="description">
                                                                <span>Lonely Cat Enjoying in Summer</span>
                                                                <p>
                                                                    Curabitur <a href="#" title="">#mypage</a> ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc,
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="coment-area">
                                                        <ul class="we-comet">
                                                            <li>
                                                                <div class="comet-avatar">
                                                                    <img src="images/resources/comet-1.jpg" alt=""/>
                                                                </div>
                                                                <div class="we-comment">
                                                                    <div class="coment-head">
                                                                        <h5><a href="time-line.html" title="">Jason borne</a></h5>
                                                                        <span>1 year ago</span>
                                                                        <a class="we-reply" href="#" title="Reply"><i class="fa fa-reply"></i></a>
                                                                    </div>
                                                                    <p>we are working for the dance and sing songs. this video is very awesome for the youngster. please vote this video and like our channel</p>
                                                                </div>

                                                            </li>
                                                            <li>
                                                                <div class="comet-avatar">
                                                                    <img src="images/resources/comet-2.jpg" alt=""/>
                                                                </div>
                                                                <div class="we-comment">
                                                                    <div class="coment-head">
                                                                        <h5><a href="time-line.html" title="">Sophia</a></h5>
                                                                        <span>1 week ago</span>
                                                                        <a class="we-reply" href="#" title="Reply"><i class="fa fa-reply"></i></a>
                                                                    </div>
                                                                    <p>we are working for the dance and sing songs. this video is very awesome for the youngster.
                                                                        <i class="em em-smiley"></i>
                                                                    </p>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <a href="#" title="" class="showmore underline">more comments</a>
                                                            </li>
                                                            <li class="post-comment">
                                                                <div class="comet-avatar">
                                                                    <img src="images/resources/comet-2.jpg" alt=""/>
                                                                </div>
                                                                <div class="post-comt-box">
                                                                    <form method="post">
                                                                        <textarea placeholder="Post your comment"></textarea>
                                                                        <div class="add-smiles">
                                                                            <span class="em em-expressionless" title="add icon"></span>
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
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
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
        </div>
    );
};

export default Profile;