import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';
import logo from '../assets/logo.png';

function Header() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={isScrolled ? 'header scrolled' : 'header'}>
      <div className="container header-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Armenkul Emlak Logo" className="logo-image" />
        </Link>
        <nav>
          <Link to="/" className="nav-link">
            Tüm Portföyler
          </Link>
          
          {/* --- DEĞİŞİKLİK BURADA: Butonun stili değiştirildi --- */}
          <Link to="/talep-et" className="nav-link-button talep-button">
            Talep Et
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