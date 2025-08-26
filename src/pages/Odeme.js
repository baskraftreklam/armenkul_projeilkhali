import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Odeme.css';
import moment from 'moment';

function Odeme() {
    const { paketAdi } = useParams();
    const navigate = useNavigate();
    const { currentUser, updateUser } = useAuth(); // updateUser fonksiyonunu AuthContext'ten alıyoruz.

    const handlePayment = (e) => {
        e.preventDefault();
        
        // Simülasyon: Gerçekte burada ödeme işlemi yapılır.
        console.log(`Payment successful for ${paketAdi} plan.`);
        
        let monthsToAdd = 0;
        if (paketAdi === 'Aylık') monthsToAdd = 1;
        if (paketAdi === '3 Aylık') monthsToAdd = 3;
        if (paketAdi === '6 Aylık') monthsToAdd = 6;
        if (paketAdi === 'Yıllık Pro') monthsToAdd = 12;
        
        // Yeni bitiş tarihini hesapla.
        const newEndDate = moment().add(monthsToAdd, 'months').toISOString();

        // Yeni abonelik bilgisini oluştur.
        const newSubscription = {
            plan: paketAdi,
            status: 'active',
            endDate: newEndDate,
        };
        
        // currentUser'ı yeni abonelik bilgisiyle güncelle.
        updateUser({ ...currentUser, subscription: newSubscription });
        
        alert(`${paketAdi} aboneliğiniz başarıyla başlatılmıştır! Profilinize yönlendiriliyorsunuz.`);
        navigate('/profil/abonelik');
    };

    return (
        <div className="payment-container">
            <h1>Ödeme Ekranı</h1>
            <p className="payment-summary">
                Seçilen Paket: <span>{paketAdi}</span>
            </p>
            <form className="payment-form" onSubmit={handlePayment}>
                <div className="form-group">
                    <label>Kart Üzerindeki İsim</label>
                    <input type="text" placeholder="Ad Soyad" required />
                </div>
                <div className="form-group">
                    <label>Kart Numarası</label>
                    <input type="text" placeholder="0000 0000 0000 0000" required />
                </div>
                <div className="card-expiry-cvc">
                    <div className="form-group">
                        <label>Son Kullanma Tarihi</label>
                        <input type="text" placeholder="AA/YY" required />
                    </div>
                    <div className="form-group">
                        <label>CVC</label>
                        <input type="text" placeholder="123" required />
                    </div>
                </div>
                <button type="submit" className="submit-payment-btn">Ödemeyi Tamamla</button>
            </form>
            <div className="payment-options">
                <h3>Veya</h3>
                <button className="eft-button" onClick={() => alert('Havale/EFT bilgileri için lütfen bizimle iletişime geçin.')}>
                    Havale/EFT ile Öde
                </button>
            </div>
        </div>
    );
}

export default Odeme;