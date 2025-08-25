import React, { useState } from 'react';
import './RequestList.css';

// Detayları gösteren modal (pencere) bileşeni
const RequestDetailModal = ({ request, onClose }) => {
    const formatPrice = (price) => new Intl.NumberFormat('tr-TR').format(price);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Talep Detayları</h2>
                <div className="modal-details">
                    <p><strong>İsim:</strong> {request.name}</p>
                    <p><strong>Telefon:</strong> {request.phone}</p>
                    <hr/>
                    <p><strong>İşlem Türü:</strong> {request.listingStatus}</p>
                    <p><strong>Bütçe Aralığı:</strong> {formatPrice(request.budget[0])} ₺ - {formatPrice(request.budget[1])} ₺</p>
                    <p><strong>Metrekare Aralığı:</strong> {request.squareMeters[0]} m² - {request.squareMeters[1]} m²</p>
                    <p><strong>Oda Sayısı:</strong> {request.roomCount || 'Farketmez'}</p>
                    <p><strong>Bina Yaşı Aralığı:</strong> {request.buildingAge[0]} - {request.buildingAge[1]} Yaş</p>
                    <p><strong>Kat Aralığı:</strong> {request.floor[0]}. Kat - {request.floor[1]}. Kat</p>
                    <p><strong>1. Mahalle Tercihi:</strong> {request.neighborhood1 || '-'}</p>
                    <p><strong>2. Mahalle Tercihi:</strong> {request.neighborhood2 || '-'}</p>
                    {request.neighborhood3 && <p><strong>3. Mahalle Tercihi:</strong> {request.neighborhood3}</p>}
                    {request.neighborhood4 && <p><strong>4. Mahalle Tercihi:</strong> {request.neighborhood4}</p>}
                </div>
                <button onClick={onClose} className="modal-close-btn">Kapat</button>
            </div>
        </div>
    );
};


function RequestList({ requests, onUpdateRequestStatus, onDeleteRequest }) {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const statusOptions = ['Yeni', 'Arandı', 'Randevu Oluşturuldu', 'Sonuçlandı', 'İptal'];

    // Talepleri aktif ve geçmiş olarak ikiye ayır
    const activeRequests = requests.filter(req => req.status !== 'Sonuçlandı' && req.status !== 'İptal');
    const completedRequests = requests.filter(req => req.status === 'Sonuçlandı' || req.status === 'İptal');

    // Tabloyu render eden yardımcı fonksiyon
    const renderTable = (requestList, isCompleted = false) => {
        if (requestList.length === 0) {
            return <p className="no-requests">{isCompleted ? 'Henüz tamamlanmış bir talep bulunmuyor.' : 'Henüz aktif bir talep bulunmuyor.'}</p>;
        }

        return (
            <div className="requests-table-container">
                <table className={`requests-table ${isCompleted ? 'completed-table' : ''}`}>
                    <thead>
                        <tr>
                            <th>İsim</th>
                            <th>Telefon</th>
                            <th>İşlem</th>
                            <th>Bütçe (Max)</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestList.map(req => (
                            <tr key={req.id}>
                                <td>{req.name}</td>
                                <td>{req.phone}</td>
                                <td>{req.listingStatus}</td>
                                <td>{new Intl.NumberFormat('tr-TR').format(req.budget[1])} ₺</td>
                                <td>
                                    <select 
                                        value={req.status} 
                                        onChange={(e) => onUpdateRequestStatus(req.id, e.target.value)}
                                        className={`status-select status-${req.status.toLowerCase().replace(' ', '-')}`}
                                    >
                                        {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => setSelectedRequest(req)} className="btn-details">Detaylar</button>
                                        <button onClick={() => onDeleteRequest(req.id)} className="btn-delete">Sil</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <>
            {selectedRequest && <RequestDetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />}
            
            <div className="request-list-container">
                <div className="request-section">
                    <h1>Aktif Talepler</h1>
                    {renderTable(activeRequests)}
                </div>
                
                <div className="request-section">
                    <h2>Geçmiş Talepler</h2>
                    {renderTable(completedRequests, true)}
                </div>
            </div>
        </>
    );
}

export default RequestList;