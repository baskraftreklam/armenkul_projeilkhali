import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Leaflet'i import ediyoruz

// Kırmızı pin ikonu için özel ayar
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function DisplayMap({ position }) {
  if (!position || !position.lat || !position.lng) {
    return <div>Konum bilgisi bulunamadı.</div>;
  }
  
  const mapPosition = [position.lat, position.lng];

  // Koyu tema URL'si
  const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  return (
    // attributionControl={false} ile tüm yazılar kaldırıldı
    <MapContainer center={mapPosition} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} attributionControl={false}>
      <TileLayer
        url={darkTileUrl}
      />
      {/* Marker'a kırmızı ikon eklendi */}
      <Marker position={mapPosition} icon={redIcon}>
        <Popup>
          Portföyün konumu
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default DisplayMap;