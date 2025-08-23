import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ReactPlayer from 'react-player/lazy';
import DisplayMap from '../components/DisplayMap';
import { useAuth } from '../context/AuthContext';
import './PortfolioDetail.css';

function PortfolioDetail({ properties, onDeletePortfolio }) {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const property = properties.find(p => p.id.toString() === id);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) {
    return <div className="detail-container">Portföy bulunamadı veya yüklenemedi.</div>;
  }
  
  const formatPrice = (price) => {
    if (typeof price !== 'number') return price;
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const goToPrevious = () => {
    setActiveImageIndex(prevIndex => (prevIndex === 0 ? property.images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setActiveImageIndex(prevIndex => (prevIndex === property.images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDelete = () => {
    onDeletePortfolio(property.id);
    navigate('/');
  };

  return (
    <>
      <div className="detail-container">
        <div className="detail-header">
          <div className="header-title-address">
              <h1>{property.title}</h1>
              <p className="address">{property.neighborhood}, {property.address}</p>
          </div>
          <div className="header-actions-price">
            {isAdmin && (
              <div className="detail-admin-actions">
                <Link to={`/edit/${property.id}`} className="detail-admin-button edit">Düzenle</Link>
                <button onClick={handleDelete} className="detail-admin-button delete">Sil</button>
              </div>
            )}
            <div className="price">{formatPrice(property.price)}</div>
          </div>
        </div>
        
        {property.images && property.images.length > 0 && (
          <div className="image-gallery-container">
            <div className="main-image-wrapper">
              <button className="arrow-button left" onClick={goToPrevious}>‹</button>
              <img 
                src={property.images[activeImageIndex]} 
                alt={`${property.title} - Ana Resim ${activeImageIndex + 1}`}
                onClick={() => openLightbox(activeImageIndex)}
              />
              <button className="arrow-button right" onClick={goToNext}>›</button>
            </div>
            <div className="thumbnail-strip">
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="detail-content-grid">
          <div className="main-content">
            {property.videoUrl && (
              <div className="media-wrapper">
                <h4>Tanıtım Videosu</h4>
                <div className="video-player-container">
                  <ReactPlayer
                    url={property.videoUrl}
                    width="100%"
                    height="100%"
                    controls={true}
                    light={(property.images && property.images.length > 0) ? property.images[0] : true}
                  />
                </div>
              </div>
            )}
            <h3>İlan Detayları</h3>
            <div className="details-grid">
                <div className="detail-item"><strong>Oda Sayısı:</strong><span>{property.roomCount}</span></div>
                <div className="detail-item"><strong>Metrekare:</strong><span>{property.squareMeters} m²</span></div>
                <div className="detail-item"><strong>Banyo Sayısı:</strong><span>{property.bathroomCount}</span></div>
                <div className="detail-item"><strong>Bina Yaşı:</strong><span>{property.buildingAge}</span></div>
                <div className="detail-item"><strong>Bulunduğu Kat:</strong><span>{property.floor}</span></div>
                <div className="detail-item"><strong>Toplam Kat:</strong><span>{property.totalFloors}</span></div>
                <div className="detail-item"><strong>Kullanım Durumu:</strong><span>{property.occupancyStatus}</span></div>
                <div className="detail-item"><strong>Mutfak Tipi:</strong><span>{property.kitchenType}</span></div>
                <div className="detail-item"><strong>Ebeveyn Banyosu:</strong><span>{property.ensuiteBathroom ? 'Var' : 'Yok'}</span></div>
                <div className="detail-item"><strong>Kredi Limiti:</strong><span>{formatPrice(property.loanAmount)}</span></div>
            </div>
            <div className="features">
              <h3>Özellikler</h3>
              <p>{property.features}</p>
            </div>
          </div>
          <div className="sidebar-content">
            {property.location && (
              <div className="media-wrapper">
                  <h4>Konum</h4>
                  <div className="map-container">
                      <DisplayMap position={property.location} />
                  </div>
              </div>
            )}
            {isAdmin && (
              <div className="owner-info">
                <h3>Portföy Sahibi Bilgileri</h3>
                <p><strong>İsim:</strong> {property.ownerName}</p>
                <p><strong>Telefon:</strong> {property.ownerPhone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={property.images ? property.images.map(img => ({ src: img })) : []}
          index={lightboxIndex}
      />
    </>
  );
}
export default PortfolioDetail;