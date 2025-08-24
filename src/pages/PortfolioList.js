import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PortfolioCard from '../components/PortfolioCard';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './PortfolioList.css';

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

const atakumNeighborhoods = [ "Aksu", "Alanlı", "Atakent", "Balaç", "Beypınar", "Büyükkolpınar", "Cumhuriyet", "Çamlıyazı", "Çatalçam", "Denizevleri", "Elmaçukuru", "Erikli", "Esenevler", "Güzelyalı", "İncesu", "İstiklal", "Karakavuk", "Kamalı", "Kesilli", "Körfez", "Küçükkolpınar", "Mevlana", "Mimar Sinan", "Taflan", "Yeni Mahalle", "Yeşiltepe" ];
atakumNeighborhoods.sort();

function PortfolioList({ properties, onDeletePortfolio }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFiltersOpen, setIsFiltersOpen] = useState(window.innerWidth > 992);

  // Dinamik maksimum değerler için
  const maxPrice = useMemo(() => properties.length ? Math.max(...properties.map(p => p.price)) : 10000000, [properties]);
  const maxSquareMeters = useMemo(() => properties.length ? Math.max(...properties.map(p => p.squareMeters)) : 500, [properties]);

  const initialFilters = {
    listingStatus: 'Tümü',
    propertyType: 'Tümü',
    neighborhood: '',
    roomCount: '',
    priceRange: [0, maxPrice],
    squareMetersRange: [0, maxSquareMeters],
    furnished: 'Tümü',
    heatingType: 'Tümü',
    deedStatus: 'Tümü',
    tradeable: 'Tümü',
    parking: 'Tümü',
  };
  
  const [filters, setFilters] = useState(initialFilters);
  const [hasFiltered, setHasFiltered] = useState(false);
  
  useEffect(() => {
    if (location.state?.neighborhood) {
      setIsFiltersOpen(true);
      handleFilterChange('neighborhood', location.state.neighborhood);
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, navigate]);
  
  // Slider'ların max değerlerini güncelle
  useEffect(() => { setFilters(f => ({...f, priceRange: [f.priceRange[0], maxPrice]})); }, [maxPrice]);
  useEffect(() => { setFilters(f => ({...f, squareMetersRange: [f.squareMetersRange[0], maxSquareMeters]})); }, [maxSquareMeters]);
  
  const handleFilterChange = (name, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    setHasFiltered(true);
  };

  const resetFilters = () => {
    setFilters({...initialFilters, priceRange: [0, maxPrice], squareMetersRange: [0, maxSquareMeters]});
    setHasFiltered(false);
  };

  const filteredProperties = properties.filter(p => {
    return (
      (filters.listingStatus === 'Tümü' || p.listingStatus === filters.listingStatus) &&
      (filters.propertyType === 'Tümü' || p.propertyType === filters.propertyType) &&
      (p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]) &&
      (p.squareMeters >= filters.squareMetersRange[0] && p.squareMeters <= filters.squareMetersRange[1]) &&
      (filters.neighborhood ? p.neighborhood === filters.neighborhood : true) &&
      (filters.roomCount ? p.roomCount === filters.roomCount : true) &&
      (filters.furnished === 'Tümü' || String(p.furnished) === filters.furnished) &&
      (filters.heatingType === 'Tümü' || p.heatingType === filters.heatingType) &&
      (filters.deedStatus === 'Tümü' || p.deedStatus === filters.deedStatus) &&
      (filters.tradeable === 'Tümü' || String(p.tradeable) === filters.tradeable) &&
      (filters.parking === 'Tümü' || String(p.parking) === filters.parking)
    );
  });
  
  const formatPrice = (price) => new Intl.NumberFormat('tr-TR').format(price);

  return (
    <div className="portfolio-list-page">
      <div className={isFiltersOpen ? 'filters-wrapper' : 'filters-wrapper filters-wrapper--closed'}>
        <div className="filters">
           <div className="filter-header">
              <h2>Detaylı Arama</h2>
              <button onClick={() => setIsFiltersOpen(false)} className="filter-collapse-button" title="Filtreleri Gizle"><ChevronLeftIcon /></button>
           </div>
            <div className="filter-buttons">
              <button className={filters.listingStatus === 'Satılık' ? 'active' : ''} onClick={() => handleFilterChange('listingStatus', 'Satılık')}>Satılık</button>
              <button className={filters.listingStatus === 'Kiralık' ? 'active' : ''} onClick={() => handleFilterChange('listingStatus', 'Kiralık')}>Kiralık</button>
            </div>
             <div className="filter-group">
                <label>Portföy Tipi</label>
                <select name="propertyType" value={filters.propertyType} onChange={e => handleFilterChange('propertyType', e.target.value)}>
                    <option value="Tümü">Tümü</option><option value="Daire">Daire</option><option value="Villa">Villa</option><option value="Arsa">Arsa</option>
                </select>
            </div>
          <div className="filter-group">
            <label>Fiyat Aralığı (₺)</label>
            <div className="range-labels"><span>{formatPrice(filters.priceRange[0])}</span><span>{formatPrice(filters.priceRange[1])}</span></div>
            <Slider range min={0} max={maxPrice} step={50000} value={filters.priceRange} onChange={value => handleFilterChange('priceRange', value)} />
          </div>
          <div className="filter-group">
            <label>Metrekare Aralığı (m²)</label>
            <div className="range-labels"><span>{filters.squareMetersRange[0]} m²</span><span>{filters.squareMetersRange[1]} m²</span></div>
            <Slider range min={0} max={maxSquareMeters} step={5} value={filters.squareMetersRange} onChange={value => handleFilterChange('squareMetersRange', value)} />
          </div>
          <div className="filter-group">
             <label htmlFor="neighborhood-filter">Konum (Atakum)</label>
              <select id="neighborhood-filter" value={filters.neighborhood} onChange={e => handleFilterChange('neighborhood', e.target.value)}>
                  <option value="">Tüm Mahalleler</option>
                  {atakumNeighborhoods.map(hood => <option key={hood} value={hood}>{hood}</option>)}
              </select>
           </div>
          <div className="filter-group">
            <label>Oda Sayısı</label>
            <select value={filters.roomCount} onChange={e => handleFilterChange('roomCount', e.target.value)}>
              <option value="">Tümü</option><option value="1+1">1+1</option><option value="2+1">2+1</option><option value="3+1">3+1</option><option value="4+1">4+1</option><option value="Diğer">Diğer</option>
            </select>
          </div>
          <div className="filter-group">
              <label>Isıtma Tipi</label>
              <select value={filters.heatingType} onChange={e => handleFilterChange('heatingType', e.target.value)}>
                 <option value="Tümü">Tümü</option><option>Doğalgaz</option><option>Yerden Isıtma</option><option>Merkezi Sistem</option>
              </select>
          </div>
          <div className="filter-group">
              <label>Eşya Durumu</label>
              <select value={filters.furnished} onChange={e => handleFilterChange('furnished', e.target.value)}>
                 <option value="Tümü">Farketmez</option><option value="true">Eşyalı</option><option value="false">Eşyasız</option>
              </select>
          </div>
          <div className="filter-group">
              <label>Takas</label>
              <select value={filters.tradeable} onChange={e => handleFilterChange('tradeable', e.target.value)}>
                 <option value="Tümü">Farketmez</option><option value="true">Evet</option><option value="false">Hayır</option>
              </select>
          </div>
          <div className="filter-group">
              <label>Otopark</label>
              <select value={filters.parking} onChange={e => handleFilterChange('parking', e.target.value)}>
                 <option value="Tümü">Farketmez</option><option value="true">Var</option><option value="false">Yok</option>
              </select>
          </div>
          <button onClick={resetFilters} className="reset-button-inside">Filtreleri Temizle</button>
        </div>
      </div>
      <button onClick={() => setIsFiltersOpen(true)} className={isFiltersOpen ? 'filter-expand-button is-hidden' : 'filter-expand-button'} title="Filtreleri Göster"><ChevronRightIcon /></button>
      <div className="property-list-container">
        <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="mobile-filter-toggle-button">{isFiltersOpen ? 'Filtreleri Gizle' : 'Filtreleri Göster'}</button>
        {(hasFiltered) && (<div className="list-summary"><strong>{filteredProperties.length}</strong> adet portföy bulundu.</div>)}
        <div className="property-grid">
            {filteredProperties.length > 0 ? (
             filteredProperties.map(property => (<PortfolioCard key={property.id} property={property} onDeletePortfolio={onDeletePortfolio} />))
            ) : (
            <p className="no-results">Bu kriterlere uygun portföy bulunamadı.</p>
            )}
         </div>
      </div>
    </div>
  );
}
export default PortfolioList;