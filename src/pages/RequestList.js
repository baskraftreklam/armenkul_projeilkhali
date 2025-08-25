import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { findMatches } from '../utils/matchingLogic';
import PortfolioCard from '../components/PortfolioCard';
import { FaUserCircle } from 'react-icons/fa';
// --- DEĞİŞİKLİK: Kendi CSS dosyası import edildi ---
import './RequestList.css'; 

// Talep Kartı Bileşeni
const MyRequestCard = ({ request, allProperties, onUpdateRequestStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const allMatches = findMatches(request, allProperties);
  const formatPrice = (price) => new Intl.NumberFormat('tr-TR').format(price);
  
  const handleStatusChange = (e) => {
    onUpdateRequestStatus(request.id, e.target.value);
  };
  
  const statusOptions = ["Yeni", "Arandı", "Randevu Oluşturuldu", "Sonuçlandı", "İptal"];
  const statusClass = `status-${request.status.toLowerCase().replace(/ /g, '-')}`;

  return (
    <div className="request-card">
      <div className="request-card-header">
        <h3><FaUserCircle /> {request.name} ({request.listingStatus})</h3>
        <select value={request.status} onChange={handleStatusChange} className={`status-badge ${statusClass}`}>
            {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
      </div>
      <div className="request-details-grid">
        <div className="request-detail-item"><strong>Telefon:</strong><span>{request.phone}</span></div>
        <div className="request-detail-item"><strong>Bütçe:</strong><span>{formatPrice(request.budget[0])} - {formatPrice(request.budget[1])} ₺</span></div>
      </div>

      {allMatches.length > 0 && (
        <>
          <div className="matching-section">
            <span className="match-count my-matches">{allMatches.length} Eşleşen Portföy Bulundu</span>
            <button onClick={() => setIsExpanded(!isExpanded)} className="view-matches-btn">
              {isExpanded ? 'Gizle' : 'Eşleşmeleri Gör'}
            </button>
          </div>
          <div className={`matches-container ${isExpanded ? 'expanded' : ''}`}>
            <div className="matches-grid">
              {allMatches.map(property => <PortfolioCard key={property.id} property={property} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Ana Müşteri Talepleri Sayfası
function RequestList({ requests, properties, onUpdateRequestStatus }) {
  const { currentUser } = useAuth();

  const myRequests = useMemo(() => {
    if (!requests) return [];
    return requests.filter(req => req.agentId === currentUser.id);
  }, [requests, currentUser]);

  if (!myRequests || myRequests.length === 0) {
    return <div className="no-requests">Henüz oluşturduğunuz bir müşteri talebi bulunmuyor.</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Müşteri Taleplerim</h1>
      {/* --- DEĞİŞİKLİK: Kendi CSS'ine uygun class adı verildi --- */}
      <div className="request-list-container">
        {myRequests.map(request => (
          <MyRequestCard 
            key={request.id} 
            request={request} 
            allProperties={properties}
            onUpdateRequestStatus={onUpdateRequestStatus}
          />
        ))}
      </div>
    </div>
  );
}

export default RequestList;