import React from 'react';

const Footer = () => {
    return (
        <div>
            <footer>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-4">
                            <div className="widget">
                                <div className="foot-logo">
                                    <div className="logo">
                                        <a href="index-2.html" title=""><img src="images/logo.png" alt=""/></a>
                                    </div>
                                    <p>
                                        The trio took this simple idea and built it into the world’s leading carpooling platform.
                                    </p>
                                </div>
                                <ul className="location">
                                    <li>
                                        <i className="ti-map-alt"></i>
                                        <p>33 new montgomery st.750 san francisco, CA USA 94105.</p>
                                    </li>
                                    <li>
                                        <i className="ti-mobile"></i>
                                        <p>+1-56-346 345</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4">
                            <div className="widget">
                                <div className="widget-title"><h4>follow</h4></div>
                                <ul className="list-style">
                                    <li><i className="fa fa-facebook-square"></i> <a href="https://web.facebook.com/shopcircut/" title="">facebook</a></li>
                                    <li><i className="fa fa-twitter-square"></i><a href="https://twitter.com/login?lang=en" title="">twitter</a></li>
                                    <li><i className="fa fa-instagram"></i><a href="https://www.instagram.com/?hl=en" title="">instagram</a></li>
                                    <li><i className="fa fa-google-plus-square"></i> <a href="https://plus.google.com/discover" title="">Google+</a></li>
                                    <li><i className="fa fa-pinterest-square"></i> <a href="https://www.pinterest.com/" title="">Pintrest</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4">
                            <div className="widget">
                                <div className="widget-title"><h4>Navigate</h4></div>
                                <ul className="list-style">
                                    <li><a href="about.html" title="">about us</a></li>
                                    <li><a href="contact.html" title="">contact us</a></li>
                                    <li><a href="terms.html" title="">terms & Conditions</a></li>
                                    <li><a href="#" title="">RSS syndication</a></li>
                                    <li><a href="sitemap.html" title="">Sitemap</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4">
                            <div className="widget">
                                <div className="widget-title"><h4>useful links</h4></div>
                                <ul className="list-style">
                                    <li><a href="#" title="">leasing</a></li>
                                    <li><a href="#" title="">submit route</a></li>
                                    <li><a href="#" title="">how does it work?</a></li>
                                    <li><a href="#" title="">agent listings</a></li>
                                    <li><a href="#" title="">view All</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4">
                            <div className="widget">
                                <div className="widget-title"><h4>download apps</h4></div>
                                <ul className="colla-apps">
                                    <li><a href="https://play.google.com/store?hl=en" title=""><i className="fa fa-android"></i>android</a></li>
                                    <li><a href="https://www.apple.com/lae/ios/app-store/" title=""><i className="ti-apple"></i>iPhone</a></li>
                                    <li><a href="https://www.microsoft.com/store/apps" title=""><i className="fa fa-windows"></i>Windows</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {/*// <!-- footer -->*/}
            <div className="bottombar">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <span className="copyright"><a target="_blank" href="https://www.templateshub.net">Templates Hub</a></span>
                            <i><img src="images/credit-cards.png" alt=""/></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;