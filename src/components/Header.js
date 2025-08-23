import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';
import logo from '../assets/logo.png';

function Header() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Armenkul Emlak Logo" className="logo-image" />
        </Link>
        <nav>
          <Link to="/" className="nav-link">
            Tüm Portföyler
          </Link>

          {isAdmin && (
            <Link to="/add" className="nav-link-button">
              Yeni Portföy Ekle
            </Link>
          )}
          
          {isAdmin && (
            <button onClick={handleLogout} className="logout-button">
              Çıkış Yap
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;