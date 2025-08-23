import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function DisplayMap({ position }) {
  if (!position || !position.lat || !position.lng) {
    return <div>Konum bilgisi bulunamadı.</div>;
  }
  
  const mapPosition = [position.lat, position.lng];

  const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <MapContainer center={mapPosition} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url={darkTileUrl}
        attribution={tileAttribution}
      />
      <Marker position={mapPosition}>
        <Popup>
          Portföyün konumu
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default DisplayMap;