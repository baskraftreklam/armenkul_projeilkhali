import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ReactPlayer from 'react-player/lazy';
import DisplayMap from '../components/DisplayMap';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt, FaBuilding, FaBed, FaRulerCombined, FaCalendarAlt, FaStream, FaBath, FaFire, FaTruckLoading, FaUtensils, FaFileContract, FaMoneyBillWave, FaCreditCard, FaCheckCircle, FaTimesCircle, FaCar, FaExchangeAlt, FaHome } from 'react-icons/fa';
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
    if (!price || (typeof price !== 'number' && typeof price !== 'string')) return "-";
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return price;

    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(numericPrice);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const goToPrevious = () => setActiveImageIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1));
  const goToNext = () => setActiveImageIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1));

  const handleDelete = () => {
    if (window.confirm('Bu portföyü silmek istediğinizden emin misiniz?')) {
      onDeletePortfolio(property.id);
      navigate('/');
    }
  };

  const FeatureDisplay = ({ label, value, icon }) => (
    <div className="feature-item">
        <strong>{icon} {label}:</strong>
        <span className={value ? 'feature-yes' : 'feature-no'}>
            {value ? <FaCheckCircle/> : <FaTimesCircle/>} {value ? 'Var' : 'Yok'}
        </span>
    </div>
  );

  return (
    <>
      <div className="detail-container">
        <div className="detail-header">
          <div className="header-title-address">
              <h1>{property.title}</h1>
              <p className="address"><FaMapMarkerAlt />{property.neighborhood}, {property.address}</p>
          </div>
          <div className="header-actions-price">
            {isAdmin && (
              <div className="detail-admin-actions">
                <Link to={`/edit/${property.id}`} className="detail-admin-button edit">Düzenle</Link>
                <button onClick={handleDelete} className="detail-admin-button delete">Sil</button>
              </div>
            )}
            {/* --- DEĞİŞİKLİK BURADA: Fiyat ve Durum Etiketi eski yerine taşındı --- */}
            <div className="price-stack">
                {property.listingStatus && <div className={`header-status-badge ${property.listingStatus.toLowerCase()}`}>{property.listingStatus}</div>}
                <div className="price">{formatPrice(property.price)}</div>
            </div>
          </div>
        </div>
        
        {property.images && property.images.length > 0 && (
          <div className="image-gallery-container">
            <div className="main-image-wrapper">
              <button className="arrow-button left" onClick={goToPrevious}>‹</button>
              <img src={property.images[activeImageIndex]} alt={`${property.title} - Ana Resim ${activeImageIndex + 1}`} onClick={() => openLightbox(activeImageIndex)}/>
              <button className="arrow-button right" onClick={goToNext}>›</button>
            </div>
            <div className="thumbnail-strip">
              {property.images.map((image, index) => (
                <img key={index} src={image} alt={`Thumbnail ${index + 1}`} className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`} onClick={() => setActiveImageIndex(index)}/>
              ))}
            </div>
          </div>
        )}

        <div className="detail-content-grid">
          <div className="main-content">
            {property.videoUrl && (
              <div className="media-wrapper">
                <h4>Tanıtım Videosu</h4>
                <div className="video-player-container"><ReactPlayer url={property.videoUrl} width="100%" height="100%" controls={true} light={(property.images && property.images.length > 0) ? property.images[0] : true}/></div>
              </div>
            )}
            <h3>İlan Detayları</h3>
            <div className="details-grid">
                <div className="detail-item"><strong><FaBuilding /> Portföy Tipi:</strong><span>{property.propertyType}</span></div>
                <div className="detail-item"><strong><FaBed /> Oda Sayısı:</strong><span>{property.roomCount}</span></div>
                <div className="detail-item"><strong><FaRulerCombined /> Net m²:</strong><span>{property.squareMeters} m²</span></div>
                <div className="detail-item"><strong><FaRulerCombined /> Brüt m²:</strong><span>{property.brutSquareMeters || '-'} m²</span></div>
                <div className="detail-item"><strong><FaCalendarAlt /> Bina Yaşı:</strong><span>{property.buildingAge}</span></div>
                <div className="detail-item"><strong><FaStream /> Bulunduğu Kat:</strong><span>{property.floor}</span></div>
                <div className="detail-item"><strong><FaStream /> Toplam Kat:</strong><span>{property.totalFloors}</span></div>
                <div className="detail-item"><strong><FaBath /> Banyo Sayısı:</strong><span>{property.bathroomCount}</span></div>
                <div className="detail-item"><strong><FaFire /> Isıtma Tipi:</strong><span>{property.heatingType}</span></div>
                <div className="detail-item"><strong><FaTruckLoading /> Kullanım Durumu:</strong><span>{property.occupancyStatus}</span></div>
                <div className="detail-item"><strong><FaUtensils /> Mutfak Tipi:</strong><span>{property.kitchenType}</span></div>
                <div className="detail-item"><strong><FaFileContract /> Tapu Durumu:</strong><span>{property.deedStatus}</span></div>
                <div className="detail-item"><strong><FaMoneyBillWave /> Aidat:</strong><span>{formatPrice(property.dues)}</span></div>
                <div className="detail-item"><strong><FaMoneyBillWave /> Depozito:</strong><span>{formatPrice(property.deposit)}</span></div>
                <div className="detail-item"><strong><FaCreditCard /> Kredi Limiti:</strong><span>{formatPrice(property.loanAmount)}</span></div>
            </div>
            
            <h3>Ek Özellikler</h3>
            <div className="features-grid">
                <FeatureDisplay label="Eşyalı" value={property.furnished} icon={<FaHome />} />
                <FeatureDisplay label="Ebeveyn Banyosu" value={property.ensuiteBathroom} icon={<FaBath />} />
                <FeatureDisplay label="Takas" value={property.tradeable} icon={<FaExchangeAlt />} />
                <FeatureDisplay label="Otopark" value={property.parking} icon={<FaCar />} />
            </div>
            
            {property.features && <div className="features"><h3>Açıklama ve Özellikler</h3><p>{property.features}</p></div>}
          </div>
          <div className="sidebar-content">
            {property.location && (
              <div className="media-wrapper">
                  <h4>Konum</h4>
                  <div className="map-container"><DisplayMap position={property.location} /></div>
              </div>
            )}
            {isAdmin && (
              <div className="admin-info-box">
                <h3>Admin Özel Bilgileri</h3>
                <p><strong>Sahip Adı:</strong> {property.ownerName}</p>
                <p><strong>Sahip Telefon:</strong> {property.ownerPhone}</p>
                <p><strong>Kapı Şifresi:</strong> {property.doorCode || '-'}</p>
                {property.privateNote && (
                    <div className="private-note-section">
                        <strong>Özel Not:</strong>
                        <p className="private-note-content">{property.privateNote}</p>
                    </div>
                )}
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