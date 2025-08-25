// src/pages/EditProfile.js (Tasarımı Güncellenmiş Tam Hali)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { turkishCities } from '../data/cities';
import './EditProfile.css'; // YENİ OLUŞTURDUĞUMUZ CSS'İ İMPORT EDİYORUZ

function EditProfile() {
    const { currentUser, deleteAccount, updateUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(currentUser || {});
    const [profileImagePreview, setProfileImagePreview] = useState(currentUser?.profilePicture || null);

    useEffect(() => {
        if (!currentUser) {
            navigate('/admin/login');
        } else {
            setFormData(currentUser);
            setProfileImagePreview(currentUser.profilePicture || null);
        }
    }, [currentUser, navigate]);

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
        alert('Profiliniz güncellendi!');
        navigate('/profil');
    };

    if (!currentUser) return null;

    return (
        <div className="edit-profile-page">
            <h1>Hesap Ayarları</h1>
            <form onSubmit={handleUpdateSubmit}>
                <div className="edit-profile-grid">
                    {/* SOL SÜTUN */}
                    <div className="left-column">
                        <div className="form-card profile-pic-section">
                            <h3>Profil Resmi</h3>
                            <label htmlFor="profilePictureInput" className="profile-image-label">
                                {profileImagePreview ? (
                                    <img src={profileImagePreview} alt="Profil Önizleme" className="profile-image-preview" />
                                ) : (
                                    <div className="profile-image-placeholder"><FaUserCircle size={80} /></div>
                                )}
                            </label>
                            <input id="profilePictureInput" type="file" name="profilePictureFile" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
                            <button type="button" onClick={() => document.getElementById('profilePictureInput').click()} className="change-photo-btn">Resmi Değiştir</button>
                        </div>
                    </div>

                    {/* SAĞ SÜTUN */}
                    <div className="right-column">
                        <div className="form-card">
                            <h3>Kişisel ve Ofis Bilgileri</h3>
                            <div className="form-group"><label>İsim Soyisim</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Ofis Adı</label><input type="text" name="officeName" value={formData.officeName || ''} onChange={handleChange} required /></div>
                            <div className="form-group">
                                <label>Uzmanlık Bölgeniz (Şehir)</label>
                                <select name="city" value={formData.city || ''} onChange={handleChange} required>
                                    <option value="">Şehir Seçiniz...</option>
                                    {turkishCities.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>
                            <div className="form-group"><label>Telefon</label><input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} required /></div>
                        </div>

                        <div className="form-card">
                            <h3>Sosyal Medya Hesapları</h3>
                            <div className="form-group"><label>Instagram</label><input type="text" name="socialInstagram" value={formData.socialInstagram || ''} placeholder="https://www.instagram.com/kullaniciadi" onChange={handleChange} /></div>
                            <div className="form-group"><label>Facebook</label><input type="text" name="socialFacebook" value={formData.socialFacebook || ''} placeholder="https://www.facebook.com/kullaniciadi" onChange={handleChange} /></div>
                            <div className="form-group"><label>Youtube</label><input type="text" name="socialYoutube" value={formData.socialYoutube || ''} placeholder="https://www.youtube.com/kanal" onChange={handleChange} /></div>
                        </div>

                        <div className="form-card">
                           <h3>Hesap Yönetimi</h3>
                           <div className="form-actions">
                                <button type="button" onClick={handleDelete} className="delete-account-btn">Hesabı Sil</button>
                                <button type="submit" className="save-profile-btn">Değişiklikleri Kaydet</button>
                           </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditProfile;

