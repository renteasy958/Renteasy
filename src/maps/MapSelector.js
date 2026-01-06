import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { isabelaBoundary, isWithinBoundary, initializeLeafletIcons, createCustomIcon } from './MapUtils';

const MapSelector = ({ onLocationSelect, initialLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      try {
        initializeLeafletIcons();

        const isMapMounted = (m) => {
          try {
            return !!(m && m.getContainer && document.body.contains(m.getContainer()));
          } catch (e) {
            return false;
          }
        };

        const map = L.map(mapRef.current, {
        maxBounds: L.latLngBounds(
          [10.1800, 122.9750],
          [10.2200, 123.0250]
        ),
        maxBoundsViscosity: 1.0,
        minZoom: 14,
        maxZoom: 18
      }).setView([10.2000, 123.0000], 15, { animate: false });
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      const boundary = L.polygon(isabelaBoundary, {
        color: '#19398a',
        weight: 3,
        fillColor: '#19398a',
        fillOpacity: 0.1,
        dashArray: '10, 10'
      }).addTo(map);

      const center = boundary.getBounds().getCenter();
      L.marker(center, {
        icon: L.divIcon({
          className: 'boundary-label',
          html: '<div style="background: white; padding: 5px 10px; border-radius: 5px; border: 2px solid #19398a; font-weight: bold; white-space: nowrap;">Isabela Brgy 1-9 Area</div>',
          iconSize: [150, 40],
          iconAnchor: [75, 20]
        })
      }).addTo(map);

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        if (!isWithinBoundary(lat, lng)) {
          alert('Please place the marker within Isabela Barangays 1-9 area (highlighted on the map).');
          return;
        }
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }
        const marker = L.marker([lat, lng], {
          draggable: true,
          icon: createCustomIcon('red')
        }).addTo(map);
        marker.bindPopup(
          `<b>Boarding House Location</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}<br><small>Isabela, Negros Occidental</small>`
        ).openPopup();
        marker.on('dragend', (event) => {
          const position = event.target.getLatLng();
          if (!isWithinBoundary(position.lat, position.lng)) {
            alert('Marker must stay within Isabela Barangays 1-9 area. Reverting to previous position.');
            marker.setLatLng([lat, lng]);
            return;
          }
          onLocationSelect({
            latitude: position.lat,
            longitude: position.lng,
            markerPlaced: true
          });
          marker.setPopupContent(
            `<b>Boarding House Location</b><br>Lat: ${position.lat.toFixed(6)}<br>Lng: ${position.lng.toFixed(6)}<br><small>Isabela, Negros Occidental</small>`
          );
        });
        markerRef.current = marker;
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          markerPlaced: true
        });
      });

      mapInstanceRef.current = map;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            if (isWithinBoundary(latitude, longitude)) {
              if (isMapMounted(map)) {
                map.setView([latitude, longitude], 16, { animate: false });

                L.marker([latitude, longitude], {
                icon: L.icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })
                }).addTo(map).bindPopup('Your current location').openPopup();
              }
            }
          },
          (error) => {
            console.log('Geolocation error:', error);
          }
        );
      }

      if (initialLocation && initialLocation.markerPlaced) {
        const marker = L.marker([initialLocation.latitude, initialLocation.longitude], {
          draggable: true
        }).addTo(map);
        
        marker.bindPopup(
          `<b>Boarding House Location</b><br>Lat: ${initialLocation.latitude.toFixed(6)}<br>Lng: ${initialLocation.longitude.toFixed(6)}<br><small>Isabela, Negros Occidental</small>`
        ).openPopup();
        
        marker.on('dragend', (event) => {
          const position = event.target.getLatLng();
          
          if (!isWithinBoundary(position.lat, position.lng)) {
            alert('Marker must stay within Isabela Barangays 1-9 area. Reverting to previous position.');
            marker.setLatLng([initialLocation.latitude, initialLocation.longitude]);
            return;
          }
          
          onLocationSelect({
            latitude: position.lat,
            longitude: position.lng
          });
          
          marker.setPopupContent(
            `<b>Boarding House Location</b><br>Lat: ${position.lat.toFixed(6)}<br>Lng: ${position.lng.toFixed(6)}<br><small>Isabela, Negros Occidental</small>`
          );
        });
        
        markerRef.current = marker;
        if (isMapMounted(map)) {
          map.setView([initialLocation.latitude, initialLocation.longitude], 16, { animate: false });
        }
      }

      mapInstanceRef.current = map;
      } catch (mapErr) {
        console.error('Error initializing map:', mapErr);
      }
    }

    return () => {
      isMountedRef.current = false;
      if (mapInstanceRef.current) {
        try {
          // remove all event listeners
          try { mapInstanceRef.current.off(); } catch(e) {}
          // stop any running animations (internal API)
          try { if (mapInstanceRef.current._stop) mapInstanceRef.current._stop(); } catch(e) {}
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error cleaning up map:', e);
        }
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [onLocationSelect, initialLocation]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <div>
      <h3 className="add-location-title">
        <MapPin size={20} style={{ display: 'inline', marginRight: '8px' }} />
        Mark Your Boarding House Location
      </h3>
      <p className="add-location-instruction">
        Click on the map within the highlighted area (Isabela Barangays 1-9) to place a marker at your boarding house location. You can drag the marker to adjust its position.
      </p>
      <div className="add-map-container">
        <div ref={mapRef} className="add-map" style={{ height: '500px', width: '100%' }}></div>
      </div>
      {initialLocation && initialLocation.markerPlaced && (
        <div className="add-location-info">
          <p><strong>Coordinates:</strong></p>
          <p>Latitude: {initialLocation.latitude?.toFixed(6)}</p>
          <p>Longitude: {initialLocation.longitude?.toFixed(6)}</p>
          <p>Location: Isabela, Negros Occidental</p>
        </div>
      )}
    </div>
  );
};

export default MapSelector;