import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';
import 'moment/locale/tr';
import { FaCheckCircle, FaTimesCircle, FaCrown } from 'react-icons/fa';
import './Abonelik.css';

function Abonelik() {
    const { currentUser } = useAuth();
    
    if (!currentUser || !currentUser.subscription) {
        return (
            <div className="subscription-container">
                <h1>Abonelik Bilgileri</h1>
                <p>Abonelik bilgileriniz yüklenemedi.</p>
            </div>
        )
    }

    const { plan, status, endDate } = currentUser.subscription;
    const isActive = status === 'active';
    const daysRemaining = moment(endDate).diff(moment(), 'days');

    return (
        <div className="subscription-container">
            {currentUser.role === 'superadmin' && (
                <div className="admin-badge">
                    <FaCrown /> Süper Admin Hesabı
                </div>
            )}
            <h1>Abonelik Durumum</h1>
            <div className="subscription-card">
                <div className={`status-icon ${isActive ? 'active' : 'expired'}`}>
                    {isActive ? <FaCheckCircle /> : <FaTimesCircle />}
                </div>
                <h2 className="plan-name">{plan}</h2>
                <p className={`status-text ${isActive ? 'active' : 'expired'}`}>
                    Durum: {isActive ? 'Aktif' : 'Süresi Dolmuş'}
                </p>
                
                {isActive ? (
                    <p className="end-date">
                        Aboneliğinizin sona ermesine <strong>{daysRemaining} gün</strong> kaldı.
                        <br/>
                        Son geçerlilik tarihi: {moment(endDate).format('LL')}
                    </p>
                ) : (
                    <p className="end-date">
                        Aboneliğiniz {moment(endDate).format('LL')} tarihinde sona erdi.
                    </p>
                )}
                
                <div className="subscription-actions">
                    <Link to="/paketler" className="action-button upgrade">
                        Paketleri İncele / Yükselt
                    </Link>
                    {isActive && (
                        <button className="action-button cancel">
                            Aboneliği İptal Et
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Abonelik;