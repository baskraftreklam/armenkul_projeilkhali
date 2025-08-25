import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUserCircle, FaHome, FaFileAlt, FaCalendar, FaPlus, FaSignOutAlt, FaUserPlus, FaSignInAlt, FaCog, FaBullseye } from 'react-icons/fa';
import './Header.css';
import logo from '../assets/logo.png';

function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
       setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={isScrolled ? 'header scrolled' : 'header'}>
      <div className="container header-container">
        <Link to="/" className="logo-link" onClick={closeMenu}>
           <img src={logo} alt="Armenkul Emlak Logo" className="logo-image" />
        </Link>
        
        <nav className="header-right-nav">
          {currentUser && (
            <Link to="/profil" className="profile-icon-link" onClick={closeMenu}>
              {currentUser.profilePicture ? (
                 <img src={currentUser.profilePicture} alt="Profil" className="profile-icon-image" />
              ) : (
                <FaUserCircle className="profile-icon-default" />
              )}
            </Link>
          )}

          <div className="admin-menu-container">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-toggle-button">
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            {isMenuOpen && (
              <div className="dropdown-menu">
                
                {/* --- DEĞİŞİKLİK: Menü yapısı tamamen yenilendi --- */}

                {currentUser ? (
                   <>
                    {/* Üst Kısım - Kırmızı Butonlar */}
                    <Link to="/add" className="dropdown-link dropdown-link-primary" onClick={closeMenu}><FaPlus /> Yeni Portföy Ekle</Link>
                    <Link to="/talep-et" className="dropdown-link dropdown-link-primary" onClick={closeMenu}><FaFileAlt /> Talep Ekle</Link>
                    
                    <hr className="dropdown-divider" />

                    {/* Alt Kısım - Normal Linkler */}
                    <Link to="/" className="dropdown-link" onClick={closeMenu}><FaHome /> Tüm Portföyler</Link>
                    <Link to="/talep-havuzu" className="dropdown-link" onClick={closeMenu}><FaBullseye /> Talep Havuzu</Link>
                    <Link to="/talepler" className="dropdown-link" onClick={closeMenu}><FaFileAlt /> Müşteri Taleplerim</Link>
                    <Link to="/takvim" className="dropdown-link" onClick={closeMenu}><FaCalendar /> Randevu Takvimi</Link>
                    <Link to="/profil/duzenle" className="dropdown-link" onClick={closeMenu}><FaCog /> Hesap Ayarları</Link>
                    
                    <hr className="dropdown-divider" />
                    
                    <button onClick={handleLogout} className="dropdown-link logout"><FaSignOutAlt /> Çıkış Yap</button>
                  </>
                ) : (
                   <>
                    {/* Giriş Yapmamış Kullanıcı Menüsü */}
                    <Link to="/talep-et" className="dropdown-link dropdown-link-primary" onClick={closeMenu}><FaFileAlt /> Talep Et</Link>
                    <hr className="dropdown-divider" />
                    <Link to="/" className="dropdown-link" onClick={closeMenu}><FaHome /> Tüm Portföyler</Link>
                    <Link to="/kayit-ol" className="dropdown-link" onClick={closeMenu}><FaUserPlus /> Kayıt Ol</Link>
                    <Link to="/admin/login" className="dropdown-link" onClick={closeMenu}><FaSignInAlt /> Giriş Yap</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
export default Header;