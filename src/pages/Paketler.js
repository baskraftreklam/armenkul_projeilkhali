import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import './Paketler.css';

const packages = [
    { name: 'Aylık', price: '199.00₺', billing: '/ay', features: ['Sınırsız Portföy Ekleme', 'Sınırsız Talep Ekleme', 'Talep Havuzu Erişimi', '7/24 Destek'] },
    { name: '3 Aylık', price: '500.00₺', billing: '/3 ay', features: ['Tüm Aylık Paket Özellikleri', 'İstatistik ve Raporlama', 'Öne Çıkan İlan Hakkı', 'WhatsApp Entegrasyonu'] },
    { name: '6 Aylık', price: '990.00₺', billing: '/6 ay', features: ['Tüm 3 Aylık Paket Özellikleri', 'Özel Danışman Desteği', 'Gelişmiş Pazarlama Araçları', 'Web Sitesi Entegrasyonu'] },
    { name: 'Yıllık Pro', price: '1599.00₺', billing: '/yıl', features: ['Tüm 6 Aylık Paket Özellikleri', 'Eğitim ve Webinarlar', 'Öncelikli Destek', 'Özel Raporlama'] }
];

function Paketler() {
    return (
        <div className="packages-container">
            <h1>Abonelik Paketleri</h1>
            <div className="packages-grid">
                {packages.map((pkg, index) => (
                    <div className="package-card" key={index}>
                        <h2 className="package-name">{pkg.name}</h2>
                        <p className="package-price">{pkg.price}</p>
                        <p className="package-billing">{pkg.billing}</p>
                        <ul className="package-features">
                            {pkg.features.map((feature, fIndex) => (
                                <li key={fIndex}><FaCheck /> {feature}</li>
                            ))}
                        </ul>
                        <Link to={`/odeme/${pkg.name}`} className="select-package-btn">
                            Paketi Seç
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Paketler;