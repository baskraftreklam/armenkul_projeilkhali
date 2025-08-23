import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PortfolioCard from '../components/PortfolioCard';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './PortfolioList.css';

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const atakumNeighborhoods = [ "Aksu", "Alanlı", "Atakent", "Balaç", "Beypınar", "Büyükkolpınar", "Cumhuriyet", "Çamlıyazı", "Çatalçam", "Denizevleri", "Elmaçukuru", "Erikli", "Esenevler", "Güzelyalı", "İncesu", "İstiklal", "Karakavuk", "Kamalı", "Kesilli", "Körfez", "Küçükkolpınar", "Mevlana", "Mimar Sinan", "Taflan", "Yeni Mahalle", "Yeşiltepe" ];
atakumNeighborhoods.sort();

function PortfolioList({ properties, onDeletePortfolio }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFiltersOpen, setIsFiltersOpen] = useState(window.innerWidth > 992);
  const maxPrice = useMemo(() => properties.length ? Math.max(...properties.map(p => p.price)) : 5000000, [properties]);
  const maxLoan = useMemo(() => properties.length ? Math.max(...properties.map(p => p.loanAmount)) : 3000000, [properties]);

  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [loanRange, setLoanRange] = useState([0, maxLoan]);
  const [roomFilter, setRoomFilter] = useState('');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('');
  const [ensuiteFilter, setEnsuiteFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [hasFiltered, setHasFiltered] = useState(false);
  
  useEffect(() => {
    if (location.state?.neighborhood) {
      setIsFiltersOpen(true);
      setNeighborhoodFilter(location.state.neighborhood);
      setHasFiltered(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
  
  useEffect(() => { setPriceRange(currentRange => [currentRange[0], maxPrice]); }, [maxPrice]);
  useEffect(() => { setLoanRange(currentRange => [currentRange[0], maxLoan]); }, [maxLoan]);
  
  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setLoanRange([0, maxLoan]);
    setRoomFilter('');
    setNeighborhoodFilter('');
    setEnsuiteFilter('');
    setAgeFilter('');
    setHasFiltered(false);
  };

  const filteredProperties = properties.filter(p => {
    const ageMatches = () => {
      if (!ageFilter) return true;
      const [min, max] = ageFilter.split('-').map(Number);
      if (max) return p.buildingAge >= min && p.buildingAge <= max;
      return p.buildingAge >= min;
    };
    return (
      (p.price >= priceRange[0] && p.price <= priceRange[1]) &&
      (p.loanAmount >= loanRange[0] && p.loanAmount <= loanRange[1]) &&
      (roomFilter ? p.roomCount === roomFilter : true) &&
      (neighborhoodFilter ? p.neighborhood === neighborhoodFilter : true) &&
      (ensuiteFilter ? String(p.ensuiteBathroom) === ensuiteFilter : true) &&
      ageMatches()
    );
  });
  
  const formatPrice = (price) => new Intl.NumberFormat('tr-TR').format(price);

  const handlePriceChange = (value) => { setPriceRange(value); setHasFiltered(true); };
  const handleLoanChange = (value) => { setLoanRange(value); setHasFiltered(true); };
  const handleRoomChange = (e) => { setRoomFilter(e.target.value); setHasFiltered(true); };
  const handleNeighborhoodChange = (e) => { setNeighborhoodFilter(e.target.value); setHasFiltered(true); };
  const handleAgeChange = (e) => { setAgeFilter(e.target.value); setHasFiltered(true); };
  const handleEnsuiteChange = (e) => { setEnsuiteFilter(e.target.value); setHasFiltered(true); };

  return (
    <div className="portfolio-list-page">
      <div className={isFiltersOpen ? 'filters-wrapper' : 'filters-wrapper filters-wrapper--closed'}>
        <div className="filters">
          <div className="filter-header">
              <h2>Detaylı Arama</h2>
              <button onClick={() => setIsFiltersOpen(false)} className="filter-collapse-button" title="Filtreleri Gizle">
                <ChevronLeftIcon />
              </button>
          </div>
          <div className="filter-group">
            <label>Fiyat Aralığı (₺)</label>
            <div className="range-labels">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
            <Slider range min={0} max={maxPrice} step={50000} value={priceRange} onChange={handlePriceChange} />
          </div>
          <div className="filter-group">
            <label>Kredi Limiti (₺)</label>
            <div className="range-labels">
              <span>{formatPrice(loanRange[0])}</span>
              <span>{formatPrice(loanRange[1])}</span>
            </div>
            <Slider range min={0} max={maxLoan} step={25000} value={loanRange} onChange={handleLoanChange} />
          </div>
          <div className="filter-group">
              <label htmlFor="neighborhood-filter">Konum (Atakum)</label>
              <select id="neighborhood-filter" value={neighborhoodFilter} onChange={handleNeighborhoodChange}>
                  <option value="">Tüm Mahalleler</option>
                  {atakumNeighborhoods.map(hood => <option key={hood} value={hood}>{hood}</option>)}
              </select>
          </div>
          <div className="filter-group">
            <label htmlFor="room-filter">Oda Sayısı</label>
            <select id="room-filter" value={roomFilter} onChange={handleRoomChange}>
              <option value="">Tümü</option> <option value="1+1">1+1</option> <option value="2+1">2+1</option> <option value="3+1">3+1</option> <option value="4+1">4+1 ve üzeri</option>
            </select>
          </div>
          <div className="filter-group">
              <label htmlFor="age-filter">Bina Yaşı</label>
              <select id="age-filter" value={ageFilter} onChange={handleAgeChange}>
                  <option value="">Farketmez</option> <option value="0-0">Sıfır Bina</option> <option value="1-5">1-5 Yaş</option> <option value="6-10">6-10 Yaş</option> <option value="11-15">11-15 Yaş</option> <option value="16">16+ Yaş</option>
              </select>
          </div>
          <div className="filter-group">
              <label>Ebeveyn Banyosu?</label>
              <select value={ensuiteFilter} onChange={handleEnsuiteChange}>
                  <option value="">Farketmez</option> <option value="true">Var</option> <option value="false">Yok</option>
              </select>
          </div>
          <button onClick={resetFilters} className="reset-button-inside">Filtreleri Temizle</button>
        </div>
      </div>
      <button onClick={() => setIsFiltersOpen(true)} className={isFiltersOpen ? 'filter-expand-button is-hidden' : 'filter-expand-button'} title="Filtreleri Göster">
        <ChevronRightIcon />
      </button>
      <div className="property-list-container">
        <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="mobile-filter-toggle-button">
          {isFiltersOpen ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
        </button>
        
        {hasFiltered && (
          <div className="list-summary">
              <strong>{filteredProperties.length}</strong> adet portföy bulundu.
          </div>
        )}

        <div className="property-grid">
            {filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
                <PortfolioCard 
                  key={property.id} 
                  property={property}
                  onDeletePortfolio={onDeletePortfolio} 
                />
            ))
            ) : (
            <p className="no-results">Bu kriterlere uygun portföy bulunamadı.</p>
            )}
        </div>
      </div>
    </div>
  );
}
export default PortfolioList;