import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'rc-slider';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import 'rc-slider/assets/index.css';
import './RequestForm.css';

const atakumNeighborhoods = ["Aksu", "Alanlı", "Atakent", "Balaç", "Beypınar", "Büyükkolpınar", "Cumhuriyet", "Çamlıyazı", "Çatalçam", "Denizevleri", "Elmaçukuru", "Erikli", "Esenevler", "Güzelyalı", "İncesu", "İstiklal", "Karakavuk", "Kamalı", "Kesilli", "Körfez", "Küçükkolpınar", "Mevlana", "Mimar Sinan", "Taflan", "Yeni Mahalle", "Yeşiltepe"];
atakumNeighborhoods.sort();

function RequestForm() {
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [visibleNeighborhoods, setVisibleNeighborhoods] = useState(2);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        listingStatus: 'Satılık',
        budget: [500000, 10000000],
        squareMeters: [50, 350],
        roomCount: '',
        neighborhood1: '',
        neighborhood2: '',
        neighborhood3: '',
        neighborhood4: '',
        buildingAge: [0, 40],
        floor: [0, 20],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSliderChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleStatusClick = (status) => {
        setFormData(prev => ({ ...prev, listingStatus: status }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Gönderilen Talep Formu:', formData);
        setIsSubmitted(true);
        window.scrollTo(0, 0);
    };

    const formatPrice = (price) => new Intl.NumberFormat('tr-TR').format(price);

    if (isSubmitted) {
        return (
            <div className="request-form-container submitted">
                <h2>Talebiniz Alınmıştır!</h2>
                <p>Hayalinizdeki mülkü bulmamıza yardımcı olduğunuz için teşekkür ederiz. En kısa sürede sizinle iletişime geçeceğiz.</p>
                <div className="contact-info">
                    <h3>Daha Hızlı İletişim İçin</h3>
                    <p><strong>Adres:</strong> Mimar Sinan, Adnan Menderes Blv. No:55, Atakum/Samsun</p>
                    <p><strong>Telefon:</strong> 0555 123 45 67</p>
                    <p><strong>E-posta:</strong> info@armenkul.com</p>
                    <div className="social-media-icons">
                        <a href="https://www.instagram.com/alihan.tellioglu/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                        <a href="https://wa.me/905551234567" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
                    </div>
                </div>
                <button onClick={() => navigate('/')} className="back-home-btn">Anasayfaya Dön</button>
            </div>
        );
    }

    return (
        <div className="request-form-container">
            <h2>Hayalinizdeki Mülkü Bize Tarif Edin</h2>
            <p className="form-subtitle">Ekibimiz, kriterlerinize en uygun portföyleri sizin için bulup en kısa sürede iletişime geçsin.</p>
            <form onSubmit={handleSubmit} className="portfolio-form">
                <div className="form-section">
                    <h3>İletişim Bilgileriniz</h3>
                    <div className="form-grid">
                        <div className="form-group"><label>Adınız Soyadınız</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Telefon Numaranız</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /></div>
                    </div>
                </div>
                <div className="form-section">
                    <h3>Mülk Kriterleriniz</h3>
                    {/* --- DEĞİŞİKLİK BURADA: Butonlar ve Oda Sayısı aynı grid içine alındı --- */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label>İşlem Türü</label>
                            <div className="status-toggle-buttons">
                                <button type="button" className={formData.listingStatus === 'Satılık' ? 'active' : ''} onClick={() => handleStatusClick('Satılık')}>Satılık</button>
                                <button type="button" className={formData.listingStatus === 'Kiralık' ? 'active' : ''} onClick={() => handleStatusClick('Kiralık')}>Kiralık</button>
                            </div>
                        </div>
                        <div className="form-group"><label>Oda Sayısı</label><select name="roomCount" value={formData.roomCount} onChange={handleChange}><option value="">Farketmez</option><option>1+1</option><option>2+1</option><option>3+1</option><option>4+1 ve üzeri</option></select></div>
                    </div>
                    <div className="form-group slider-group">
                        <label>Bütçe Aralığınız (₺)</label>
                        <div className="range-labels"><span>{formatPrice(formData.budget[0])} ₺</span><span>{formatPrice(formData.budget[1])} ₺</span></div>
                        <Slider range min={0} max={20000000} step={100000} value={formData.budget} onChange={value => handleSliderChange('budget', value)} />
                    </div>
                     <div className="form-group slider-group">
                        <label>Metrekare Aralığı</label>
                        <div className="range-labels"><span>{formData.squareMeters[0]} m²</span><span>{formData.squareMeters[1] === 350 ? '350+' : `${formData.squareMeters[1]} m²`}</span></div>
                        <Slider range min={0} max={350} step={10} value={formData.squareMeters} onChange={value => handleSliderChange('squareMeters', value)} />
                    </div>
                     <div className="form-group slider-group">
                        <label>Bina Yaşı Aralığı</label>
                        <div className="range-labels"><span>Sıfır</span><span>{formData.buildingAge[1] === 40 ? '40+' : `${formData.buildingAge[1]} Yaş`}</span></div>
                        <Slider range min={0} max={40} value={formData.buildingAge} onChange={value => handleSliderChange('buildingAge', value)} />
                    </div>
                    <div className="form-group slider-group">
                        <label>Tercih Edilen Kat Aralığı</label>
                        <div className="range-labels"><span>{formData.floor[0] === 0 ? 'Zemin' : `${formData.floor[0]}. Kat`}</span><span>{formData.floor[1] === 20 ? '20+' : `${formData.floor[1]}. Kat`}</span></div>
                        <Slider range min={0} max={20} value={formData.floor} onChange={value => handleSliderChange('floor', value)} />
                    </div>
                </div>
                 <div className="form-section">
                    <h3>Konum Tercihleriniz</h3>
                    <div className="form-grid">
                        <div className="form-group"><label>1. Tercih Mahalle</label><select name="neighborhood1" value={formData.neighborhood1} onChange={handleChange}><option value="">Seçiniz...</option>{atakumNeighborhoods.map(hood => <option key={`n1-${hood}`} value={hood}>{hood}</option>)}</select></div>
                        <div className="form-group"><label>2. Tercih Mahalle</label><select name="neighborhood2" value={formData.neighborhood2} onChange={handleChange}><option value="">Seçiniz...</option>{atakumNeighborhoods.map(hood => <option key={`n2-${hood}`} value={hood}>{hood}</option>)}</select></div>
                        {visibleNeighborhoods > 2 && (
                            <>
                                <div className="form-group"><label>3. Tercih Mahalle</label><select name="neighborhood3" value={formData.neighborhood3} onChange={handleChange}><option value="">Seçiniz...</option>{atakumNeighborhoods.map(hood => <option key={`n3-${hood}`} value={hood}>{hood}</option>)}</select></div>
                                <div className="form-group"><label>4. Tercih Mahalle</label><select name="neighborhood4" value={formData.neighborhood4} onChange={handleChange}><option value="">Seçiniz...</option>{atakumNeighborhoods.map(hood => <option key={`n4-${hood}`} value={hood}>{hood}</option>)}</select></div>
                            </>
                        )}
                    </div>
                    {visibleNeighborhoods < 4 && (
                        <button type="button" onClick={() => setVisibleNeighborhoods(4)} className="add-more-btn">
                            Daha Fazla Konum Ekle
                        </button>
                    )}
                </div>
                
                <button type="submit" className="submit-btn">Talebimi Gönder</button>
            </form>
        </div>
    );
}

export default RequestForm;