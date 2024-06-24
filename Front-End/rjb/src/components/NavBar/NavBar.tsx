import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Login</Link>
                </li>
                <li>
                    <Link to="/register">Registration</Link>
                </li>
                <li>
                    <Link to="/home">Home</Link>
                </li>
                {/* Add other links here as needed */}
            </ul>
        </nav>
    );
}

export default NavBar;
