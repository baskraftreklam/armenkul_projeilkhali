import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortfolioCard from '../components/PortfolioCard';
import { FaInstagram, FaFacebook, FaYoutube, FaEdit, FaTimes, FaUserCircle } from 'react-icons/fa';
import { turkishCities } from '../data/cities';
import './Profil.css';

function Profil({ properties, onDeletePortfolio }) {
    const { currentUser, deleteAccount, updateUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isEditMode, setIsEditMode] = useState(false);
    
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        officeName: currentUser?.officeName || '',
        city: currentUser?.city || '',
        phone: currentUser?.phone || '',
        email: currentUser?.email || '',
        socialInstagram: currentUser?.socialInstagram || '',
        socialFacebook: currentUser?.socialFacebook || '',
        socialYoutube: currentUser?.socialYoutube || '',
        profilePicture: currentUser?.profilePicture || null,
    });
    const [profileImagePreview, setProfileImagePreview] = useState(currentUser?.profilePicture || null);
    
    useEffect(() => {
        if (location.state?.openEditModal) {
            setIsEditMode(true);
        }
    }, [location.state]);

    useEffect(() => {
        if (currentUser) {
            setFormData(currentUser);
            setProfileImagePreview(currentUser.profilePicture || null);
        }
    }, [currentUser]);

    if (!currentUser) {
        navigate('/admin/login');
        return null;
    }

    const myProperties = properties.filter(p => p.ownerId === currentUser.id);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files && files.length > 0 ? files[0] : null;
            if (file) {
                const previewUrl = URL.createObjectURL(file);
                setFormData({ ...formData, profilePictureFile: file });
                setProfileImagePreview(previewUrl);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleDelete = () => {
        if (window.confirm("Hesabınızı ve tüm portföylerinizi kalıcı olarak silmek istediğinizden emin misiniz?")) {
            deleteAccount(currentUser.id);
            navigate('/');
        }
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const submissionData = { ...formData, profilePicture: profileImagePreview };
        delete submissionData.profilePictureFile;
        updateUser(currentUser.id, submissionData);
        setIsEditMode(false);
        alert('Profiliniz güncellendi!');
    };

    return (
        <div className="profile-dashboard">
            <div className="profile-sidebar">
                <div className="profile-card">
                    <div className="profile-image-wrapper">
                        <img 
                            src={profileImagePreview || `https://ui-avatars.com/api/?name=${formData.name}&background=ff0000&color=fff`} 
                            alt="Profil" 
                            className="profile-picture"
                        />
                    </div>
                    <h1 className="profile-name">{formData.name}</h1>
                    <h2 className="profile-office">{formData.officeName}</h2>
                    <p className="profile-city">{formData.city}</p>
                    <div className="profile-social">
                        {formData.socialInstagram && <a href={formData.socialInstagram} target="_blank" rel="noopener noreferrer"><FaInstagram/></a>}
                        {formData.socialFacebook && <a href={formData.socialFacebook} target="_blank" rel="noopener noreferrer"><FaFacebook/></a>}
                        {formData.socialYoutube && <a href={formData.socialYoutube} target="_blank" rel="noopener noreferrer"><FaYoutube/></a>}
                    </div>
                    <button onClick={() => setIsEditMode(true)} className="edit-profile-btn">
                        <FaEdit /> Bilgileri Düzenle
                    </button>
                </div>
            </div>

            <div className="dashboard-main">
                <div className="my-portfolios-section">
                    <h2>Portföylerim ({myProperties.length})</h2>
                    {myProperties.length > 0 ? (
                        <div className="property-grid">
                            {myProperties.map(property => (
                                <PortfolioCard 
                                    key={property.id} 
                                    property={property}
                                    onDeletePortfolio={onDeletePortfolio} 
                                />
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

            {isEditMode && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Hesap Ayarları</h2>
                            <button onClick={() => setIsEditMode(false)} className="close-modal-btn"><FaTimes /></button>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className="profile-form">
                           <div className="profile-image-upload-modal">
                                <label htmlFor="profilePictureInputModal" className="profile-image-label">
                                    {profileImagePreview ? (
                                        <img src={profileImagePreview} alt="Profil Önizleme" className="profile-image-preview" />
                                    ) : (
                                        <div className="profile-image-placeholder"><FaUserCircle size={60} /></div>
                                    )}
                                </label>
                                <input id="profilePictureInputModal" type="file" name="profilePictureFile" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
                                <button type="button" onClick={() => document.getElementById('profilePictureInputModal').click()} className="change-photo-btn">Resmi Değiştir</button>
                            </div>
                            
                            <div className="form-grid">
                                <div className="form-group"><label>İsim Soyisim</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} required /></div>
                                <div className="form-group"><label>Ofis Adı</label><input type="text" name="officeName" value={formData.officeName || ''} onChange={handleChange} required /></div>
                                <div className="form-group"><label>Uzmanlık Bölgeniz (Şehir)</label><select name="city" value={formData.city || ''} onChange={handleChange} required><option value="">Şehir Seçiniz...</option>{turkishCities.map(city => <option key={city} value={city}>{city}</option>)}</select></div>
                                <div className="form-group"><label>Telefon</label><input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} required /></div>
                            </div>
                            <div className="form-group"><label>Instagram</label><input type="text" name="socialInstagram" value={formData.socialInstagram || ''} placeholder="https://..." onChange={handleChange} /></div>
                            <div className="form-group"><label>Facebook</label><input type="text" name="socialFacebook" value={formData.socialFacebook || ''} placeholder="https://..." onChange={handleChange} /></div>
                            <div className="form-group"><label>Youtube</label><input type="text" name="socialYoutube" value={formData.socialYoutube || ''} placeholder="https://..." onChange={handleChange} /></div>
                            
                            <div className="modal-actions">
                                <button type="button" onClick={handleDelete} className="delete-account-btn">Hesabı Sil</button>
                                <button type="submit" className="save-profile-btn">Değişiklikleri Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profil;