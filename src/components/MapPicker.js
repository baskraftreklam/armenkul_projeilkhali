import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function MapPicker({ onLocationSelect }) {
  const [position, setPosition] = useState({ lat: 41.33, lng: 36.25 });

  useEffect(() => {
    if (position) {
      onLocationSelect(position);
    }
  }, [position, onLocationSelect]);

  const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';


  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url={darkTileUrl}
        attribution={tileAttribution}
      />
      <LocationMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
}
export default MapPicker;