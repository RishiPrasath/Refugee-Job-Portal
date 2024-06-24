import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Registration from './components/auth/Registration';
import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';
import './App.css';

const App = () => {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/home" element={<Home />} />
                {/* Add other routes here as needed */}
            </Routes>
        </Router>
    );
}

export default App;
