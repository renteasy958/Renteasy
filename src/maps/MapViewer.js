import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { isabelaBoundary, initializeLeafletIcons } from './MapUtils';

const MapViewer = ({ location, title = 'Boarding House Location', showBoundary = true }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current && location) {
      initializeLeafletIcons();

      const map = L.map(mapRef.current, {
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        zoomControl: true
      }).setView([location.latitude, location.longitude], 16);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      if (showBoundary) {
        L.polygon(isabelaBoundary, {
          color: '#19398a',
          weight: 2,
          fillColor: '#19398a',
          fillOpacity: 0.05,
          dashArray: '5, 5'
        }).addTo(map);
      }

      const marker = L.marker([location.latitude, location.longitude], {
        draggable: false
      }).addTo(map);
      
      marker.bindPopup(
        `<b>${title}</b><br>Lat: ${location.latitude.toFixed(6)}<br>Lng: ${location.longitude.toFixed(6)}<br><small>Isabela, Negros Occidental</small>`
      ).openPopup();

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location, title, showBoundary]);

  if (!location || !location.latitude || !location.longitude) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        <MapPin size={40} style={{ marginBottom: '10px' }} />
        <p>Location not available</p>
      </div>
    );
  }

  return (
    <div>
      <div ref={mapRef} style={{ height: '400px', width: '100%', borderRadius: '8px' }}></div>
      <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        <p><strong>Address:</strong> Isabela, Negros Occidental</p>
        <p><strong>Coordinates:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
      </div>
    </div>
  );
};

export default MapViewer;