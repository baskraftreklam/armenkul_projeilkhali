import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { findMatches } from '../utils/matchingLogic';
import PortfolioCard from '../components/PortfolioCard';
import { FaUserCircle, FaPhone, FaBuilding, FaMapMarkerAlt, FaCompressArrowsAlt, FaRegBuilding, FaRegClone, FaTag, FaBed } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/tr';
import './DemandPool.css';

const PoolRequestCard = ({ request, myProperties }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const myMatches = findMatches(request, myProperties);

  if (myMatches.length === 0) {
    return null;
  }
  
  const requestedNeighborhoods = [request.neighborhood1, request.neighborhood2, request.neighborhood3, request.neighborhood4].filter(Boolean).join(', ');

  return (
    <div className="request-card">
      <div className="request-card-header">
        <div className="agent-info">
            <img 
                src={request.agentPicture || `https://ui-avatars.com/api/?name=${request.agentName}&background=E9ECEF&color=2d3748`} 
                alt={request.agentName} 
                className="agent-picture"
            />
            <div>
                <h3 className="agent-name">{request.agentName}</h3>
                <div className="agent-contact-info">
                    <span><FaPhone /> {request.agentPhone || 'Belirtilmemiş'}</span>
                    <span><FaBuilding /> {request.agentOfficeName || 'Ofis Belirtilmemiş'}</span>
                </div>
            </div>
        </div>
        <div className="listing-status-badge">{request.listingStatus}</div>
      </div>

      <div className="request-details-grid extended">
        <div className="request-detail-item"><strong><FaTag /> Bütçe Aralığı:</strong><span>{new Intl.NumberFormat('tr-TR').format(request.budget[0])} ₺ - {new Intl.NumberFormat('tr-TR').format(request.budget[1])} ₺</span></div>
        <div className="request-detail-item"><strong><FaCompressArrowsAlt /> Metrekare:</strong><span>{request.squareMeters[0]} - {request.squareMeters[1]} m²</span></div>
        {request.roomCount && <div className="request-detail-item"><strong><FaBed/> Oda Sayısı:</strong><span>{request.roomCount}</span></div>}
        
        {/* --- DEĞİŞİKLİK: "wide" sınıfı buradan kaldırıldı --- */}
        {requestedNeighborhoods && <div className="request-detail-item"><strong><FaMapMarkerAlt /> Tercih Edilen Mahalleler:</strong><span>{requestedNeighborhoods}</span></div>}
        
        {request.buildingAge && <div className="request-detail-item"><strong><FaRegBuilding /> Bina Yaşı:</strong><span>{request.buildingAge[0]} - {request.buildingAge[1]} yaş</span></div>}
        {request.floor && <div className="request-detail-item"><strong><FaRegClone /> Kat Aralığı:</strong><span>{request.floor[0]} - {request.floor[1]}. kat</span></div>}
      </div>

      <div className="matching-section">
        <span className="match-count my-matches">{myMatches.length} Eşleşen Portföyünüz Bulundu</span>
        <button onClick={() => setIsExpanded(!isExpanded)} className="view-matches-btn">
          {isExpanded ? 'Gizle' : 'Portföyleri Gör'}
        </button>
      </div>

      <div className={`matches-container ${isExpanded ? 'expanded' : ''}`}>
        <div className="matches-grid">
          {myMatches.map(property => <PortfolioCard key={property.id} property={property} />)}
        </div>
      </div>
    </div>
  );
};

// Ana Talep Havuzu Sayfası (Bu kısım aynı kalıyor)
function DemandPool({ requests, properties }) {
  const { currentUser } = useAuth();
  
  const { myProperties, otherRequestsInPool } = useMemo(() => {
    if (!requests || !properties) return { myProperties: [], otherRequestsInPool: [] };
    const myProperties = properties.filter(p => p.ownerId === currentUser.id);
    const otherRequestsInPool = requests.filter(req => req.publishToPool && req.agentId !== currentUser.id);
    return { myProperties, otherRequestsInPool };
  }, [requests, properties, currentUser]);


  const categorizedRequests = useMemo(() => {
    const today = [];
    const thisWeek = [];
    const older = [];

    otherRequestsInPool.forEach(request => {
      const matches = findMatches(request, myProperties);
      if (matches.length > 0) {
        const requestDate = moment(request.id);
        if (requestDate.isSame(moment(), 'day')) {
          today.push(request);
        } else if (requestDate.isSame(moment(), 'week')) {
          thisWeek.push(request);
        } else {
          older.push(request);
        }
      }
    });

    return { today, thisWeek, older };
  }, [otherRequestsInPool, myProperties]);

  const hasAnyRequests = categorizedRequests.today.length > 0 || categorizedRequests.thisWeek.length > 0 || categorizedRequests.older.length > 0;

  if (!hasAnyRequests) {
    return <div className="no-requests">Portföylerinizle eşleşen bir müşteri talebi havuzda bulunmuyor.</div>;
  }

  return (
    <div>
      <h1 style={{marginBottom: '20px'}}>Müşteri Talep Havuzu</h1>
      <div className="demand-pool-container">
        {categorizedRequests.today.length > 0 && (
          <section className="demand-group">
            <h2 className="demand-group-title">Bugün Eklenen Talepler</h2>
            {categorizedRequests.today.map(request => (
              <PoolRequestCard key={request.id} request={request} myProperties={myProperties} />
            ))}
          </section>
        )}
        {categorizedRequests.thisWeek.length > 0 && (
          <section className="demand-group">
            <h2 className="demand-group-title">Bu Hafta Eklenen Talepler</h2>
            {categorizedRequests.thisWeek.map(request => (
              <PoolRequestCard key={request.id} request={request} myProperties={myProperties} />
            ))}
          </section>
        )}
        {categorizedRequests.older.length > 0 && (
          <section className="demand-group">
            <h2 className="demand-group-title">Daha Eski Talepler</h2>
            {categorizedRequests.older.map(request => (
              <PoolRequestCard key={request.id} request={request} myProperties={myProperties} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default DemandPool;