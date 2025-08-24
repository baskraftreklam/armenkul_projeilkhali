import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// İkonları import ediyoruz
import { FaBed, FaHome, FaCar, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import './PortfolioCard.css';

function PortfolioCard({ property, onDeletePortfolio }) {
  const { isAdmin } = useAuth();

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Bu portföyü silmek istediğinizden emin misiniz?')) {
        onDeletePortfolio(property.id);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="portfolio-card">
      <Link to={`/portfolio/${property.id}`} className="card-image-link">
        <img src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/400x300.png?text=Resim+Yok'} alt={property.title} className="card-image" />
        {property.roomCount && <div className="room-count-badge">{property.roomCount}</div>}
      </Link>
      <div className="card-body">
        <h3 className="card-title">
           <Link to={`/portfolio/${property.id}`}>{property.title}</Link>
        </h3>
        
        <div className="card-info-icons">
          {property.squareMeters && (
            <div className="info-item" title="Metrekare">
              <FaHome /> <span>{property.squareMeters} m²</span>
            </div>
          )}
          {property.buildingAge && (
            <div className="info-item" title="Bina Yaşı">
              <FaBuilding /> <span>{property.buildingAge} Yaş</span>
            </div>
          )}
          {property.floor && (
             <div className="info-item" title="Bulunduğu Kat">
              <FaBed /> <span>{property.floor}. Kat</span>
            </div>
          )}
          {property.parking && (
            <div className="info-item" title="Otopark">
              <FaCar /> <span>Otopark</span>
            </div>
          )}
        </div>
        
        <Link 
          to="/" 
          state={{ neighborhood: property.neighborhood }} 
          className="card-address-link"
        >
          <FaMapMarkerAlt />
          {property.neighborhood}, Atakum
        </Link>
       </div>
      
       <div className="card-footer">
          {property.price && <div className="card-price-footer">{formatPrice(property.price)}</div>}
          {isAdmin && (
            <div className="card-admin-actions">
              <Link to={`/edit/${property.id}`} className="admin-button edit-button">Düzenle</Link>
              <button onClick={handleDelete} className="admin-button delete-button">Sil</button>
            </div>
          )}
       </div>
    </div>
  );
}
export default PortfolioCard;