import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import './Header.css';
import logo from '../assets/logo.png';

function Header() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => { /* ... (değişmedi) ... */ }, []);

  const handleLogout = () => { /* ... (değişmedi) ... */ };
  const closeMenu = () => setIsMenuOpen(false);

  const openEditProfile = () => {
    closeMenu();
    navigate('/profil', { state: { openEditModal: true } });
  };

  return (
    <header className={isScrolled ? 'header scrolled' : 'header'}>
      <div className="container header-container">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <img src={logo} alt="Armenkul Emlak Logo" className="logo-image" />
        </Link>
        <nav>
          <Link to="/" className="nav-link" onClick={closeMenu}>Tüm Portföyler</Link>
          <Link to="/talep-et" className="nav-link-button talep-button" onClick={closeMenu}>Talep Et</Link>

          {currentUser ? (
            <div className="nav-user-section">
              <Link to="/profil" className="profile-icon-link" onClick={closeMenu}>
                {currentUser.profilePicture ? (
                  <img src={currentUser.profilePicture} alt="Profil" className="profile-icon-image" />
                ) : (
                  <FaUserCircle className="profile-icon-default" />
                )}
              </Link>
              <div className="admin-menu-container">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-toggle-button">
                  {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
                {isMenuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/talepler" className="dropdown-link" onClick={closeMenu}>Müşteri Talepleri</Link>
                    <Link to="/takvim" className="dropdown-link" onClick={closeMenu}>Randevu Takvimi</Link>
                    <Link to="/add" className="dropdown-link" onClick={closeMenu}>Yeni Portföy Ekle</Link>
                    <button onClick={openEditProfile} className="dropdown-link">Hesap Ayarları</button>
                    <button onClick={handleLogout} className="dropdown-link logout">Çıkış Yap</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="nav-guest-section">
              <Link to="/kayit-ol" className="nav-link">Kayıt Ol</Link>
              <Link to="/admin/login" className="nav-link-button">Giriş Yap</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
export default Header;