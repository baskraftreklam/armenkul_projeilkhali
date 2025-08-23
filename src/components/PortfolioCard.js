import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PortfolioCard.css';

function PortfolioCard({ property, onDeletePortfolio }) {
  const { isAdmin } = useAuth();

  const handleDelete = (e) => {
    e.preventDefault();
    onDeletePortfolio(property.id);
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
        <img src={property.images[0] || 'https://via.placeholder.com/400x300.png?text=Resim+Yok'} alt={property.title} className="card-image" />
      </Link>
      <div className="card-body">
        <h3 className="card-title">
           <Link to={`/portfolio/${property.id}`}>{property.title}</Link>
        </h3>
        
        <Link 
          to="/" 
          state={{ neighborhood: property.neighborhood }} 
          className="card-address-link"
        >
          {property.neighborhood}, Atakum
        </Link>

        <div className="card-details">
          <span>{property.roomCount}</span>
          <span>{property.squareMeters} m²</span>
          <span>{property.floor}. Kat</span>
        </div>
        <div className="card-price">{formatPrice(property.price)}</div>
      </div>
      
      {isAdmin && (
        <div className="card-admin-actions">
          <Link to={`/edit/${property.id}`} className="admin-button edit-button">Düzenle</Link>
          <button onClick={handleDelete} className="admin-button delete-button">Sil</button>
        </div>
      )}
    </div>
  );
}
export default PortfolioCard;