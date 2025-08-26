import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ handleLogout }) => {
    return (
        <header className="bg-light p-3 mb-4 d-flex justify-content-between align-items-center">
            <h1 className="h4 mb-0">Admin Panel</h1>
            <nav>
                <ul className="nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/properties" className="nav-link">Properties</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/blogs" className="nav-link">Blogs</Link>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleLogout} className="btn btn-link nav-link">Logout</button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
