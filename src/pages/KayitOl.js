import React, { useState } from 'react'; // HATA GİDERİLDİ: Fazladan virgül kaldırıldı.
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { turkishCities } from '../data/cities';
import './KayitOl.css';

function KayitOl() {
    const [formData, setFormData] = useState({
        name: '',
        officeName: '',
        phone: '',
        email: '',
        password: '',
        city: '',
        socialInstagram: '',
        socialFacebook: '',
        socialYoutube: '',
        profilePictureFile: null,
        profilePicture: null
    });
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files && files.length > 0 ? files[0] : null;
            setFormData({ ...formData, profilePictureFile: file });
            if (file) {
                const previewUrl = URL.createObjectURL(file);
                setProfileImagePreview(previewUrl);
                setFormData(prev => ({ ...prev, profilePicture: previewUrl }));
            } else {
                setProfileImagePreview(null);
                setFormData(prev => ({ ...prev, profilePicture: null }));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        const { profilePictureFile, ...submissionData } = formData;
        
        const success = signup(submissionData);
        if (success) {
            navigate('/profil');
        } else {
            setError('Bu e-posta adresi zaten kullanılıyor.');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Emlakçı Olarak Kayıt Olun</h2>
                {error && <p className="error-message">{error}</p>}

                <div className="profile-image-upload">
                    <label htmlFor="profilePictureInput" className="profile-image-label">
                        {profileImagePreview ? (
                            <img src={profileImagePreview} alt="Profil Önizleme" className="profile-image-preview" />
                        ) : (
                            <div className="profile-image-placeholder">
                                <FaUserCircle size={60} />
                                <span>+ Resim Ekle</span>
                            </div>
                        )}
                    </label>
                    <input
                        id="profilePictureInput"
                        type="file"
                        name="profilePictureFile"
                        accept="image/*"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                    />
                </div>

                <div className="form-group"><label>İsim Soyisim</label><input type="text" name="name" onChange={handleChange} required /></div>
                <div className="form-group"><label>Ofis Adı</label><input type="text" name="officeName" onChange={handleChange} required /></div>

                <div className="form-group">
                    <label>Uzmanlık Bölgeniz (Şehir)</label>
                    <select name="city" value={formData.city} onChange={handleChange} required>
                        <option value="">Şehir Seçiniz...</option>
                        {turkishCities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                </div>

                <div className="form-group"><label>Telefon</label><input type="tel" name="phone" onChange={handleChange} required /></div>
                <div className="form-group"><label>E-posta</label><input type="email" name="email" onChange={handleChange} required /></div>
                <div className="form-group"><label>Şifre</label><input type="password" name="password" onChange={handleChange} required /></div>
                <div className="form-group"><label>Instagram Adresiniz (Opsiyonel)</label><input type="text" name="socialInstagram" placeholder="https://..." onChange={handleChange} /></div>
                <div className="form-group"><label>Facebook Adresiniz (Opsiyonel)</label><input type="text" name="socialFacebook" placeholder="https://..." onChange={handleChange} /></div>
                <div className="form-group"><label>Youtube Adresiniz (Opsiyonel)</label><input type="text" name="socialYoutube" placeholder="https://..." onChange={handleChange} /></div>

                <button type="submit" className="auth-button">Kayıt Ol</button>
            </form>
        </div>
    );
}
export default KayitOl;