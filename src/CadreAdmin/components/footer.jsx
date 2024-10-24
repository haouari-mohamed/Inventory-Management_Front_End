import React from 'react';

const Footer = () => (
    <footer className="footer">
        <div className="container-fluid d-flex justify-content-between">
            <nav className="pull-left">
                <ul className="nav">
                    <li className="nav-item">
                        <a className="nav-link" href="https://www.linkedin.com/in/salma-baouch-b3b915225/">
                           Salma Baouch
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="https://www.linkedin.com/in/mohamed-haouari-62bb86209/"> Mohamed Haouari </a>
                    </li>
                </ul>
            </nav>
            <div className="copyright">
                2024, made with <i className="fa fa-heart heart text-info" /> by
                <a href="http://cid.co.ma/"> CID</a>
            </div>
        </div>
    </footer>
);

export default Footer;