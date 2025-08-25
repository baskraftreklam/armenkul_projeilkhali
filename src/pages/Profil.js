import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortfolioCard from '../components/PortfolioCard';
import { 
    FaInstagram, 
    FaFacebook, 
    FaYoutube, 
    FaEdit, 
    FaEye, 
    FaEyeSlash,
    FaPhoneAlt,
    FaEnvelope,
    FaBuilding,
    FaMapMarkerAlt
} from 'react-icons/fa';
import './Profil.css';

function Profil({ properties, onDeletePortfolio, onToggleVisibility }) {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    if (!currentUser) {
        navigate('/admin/login');
        return null;
    }

    const myProperties = properties.filter(p => p.ownerId === currentUser.id);

    return (
        <div className="profile-dashboard">
            <div className="profile-sidebar">
                <div className="profile-card">
                    <div className="profile-image-wrapper">
                        <img 
                            src={currentUser.profilePicture || `https://ui-avatars.com/api/?name=${currentUser.name}&background=ff0000&color=fff`} 
                            alt="Profil" 
                            className="profile-picture"
                        />
                    </div>
                    <h1 className="profile-name">{currentUser.name}</h1>
                    
                    <div className="profile-details">
                        <div className="profile-detail-item">
                            <FaBuilding /> <span>{currentUser.officeName}</span>
                        </div>
                        <div className="profile-detail-item">
                            <FaMapMarkerAlt /> <span>{currentUser.city}</span>
                        </div>
                        {currentUser.phone && (
                            <div className="profile-detail-item">
                                <FaPhoneAlt /> <span>{currentUser.phone}</span>
                            </div>
                        )}
                        {currentUser.email && (
                            <div className="profile-detail-item">
                                <FaEnvelope /> <span>{currentUser.email}</span>
                            </div>
                        )}
                    </div>

                    <div className="profile-social">
                        {currentUser.socialInstagram && <a href={currentUser.socialInstagram} target="_blank" rel="noopener noreferrer"><FaInstagram/></a>}
                        {currentUser.socialFacebook && <a href={currentUser.socialFacebook} target="_blank" rel="noopener noreferrer"><FaFacebook/></a>}
                        {currentUser.socialYoutube && <a href={currentUser.socialYoutube} target="_blank" rel="noopener noreferrer"><FaYoutube/></a>}
                    </div>

                    <Link to="/profil/duzenle" className="edit-profile-btn">
                        <FaEdit /> Bilgileri Düzenle
                    </Link>
                </div>
            </div>

            <div className="dashboard-main">
                <div className="my-portfolios-section">
                    <h2>Portföylerim ({myProperties.length})</h2>
                    {myProperties.length > 0 ? (
                        <div className="profile-property-grid">
                            {myProperties.map(property => (
                                <div key={property.id} className={`profile-portfolio-item ${!property.isPublished ? 'is-hidden' : ''}`}>
                                    <div className="portfolio-item-header">
                                        <span className={property.isPublished ? 'status-published' : 'status-hidden'}>
                                            {property.isPublished ? <><FaEye/> Yayında</> : <><FaEyeSlash/> Gizli</>}
                                        </span>
                                        <button 
                                            onClick={() => onToggleVisibility(property.id)} 
                                            className="toggle-visibility-btn"
                                        >
                                            {property.isPublished ? 'Gizle' : 'Yayınla'}
                                        </button>
                                    </div>
                                    {/* --- DEĞİŞİKLİK: "showAdminActions" prop'u buraya eklendi --- */}
                                    <PortfolioCard 
                                        property={property}
                                        onDeletePortfolio={onDeletePortfolio}
                                        showAdminActions={true} 
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-portfolios">
                            <p>Henüz hiç portföy eklemediniz.</p>
                            <Link to="/add" className="add-portfolio-link">İlk Portföyünüzü Ekleyin</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profil;