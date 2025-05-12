import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="app-header">
      <h1 className="logo">🎉Welcome to EventHive🎉</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Create Event</Link>
        <Link to="/event/12345">Events Page</Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
};

export default Header;
