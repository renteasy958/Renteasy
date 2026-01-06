import L from 'leaflet';

export const isabelaBoundary = [
  [10.2150, 122.9800],
  [10.2150, 123.0200],
  [10.1850, 123.0200],
  [10.1850, 122.9800],
];

export const BOUNDARY_LIMITS = {
  latMin: 10.1800,
  latMax: 10.2200,
  lngMin: 122.9750,
  lngMax: 123.0250
};

export const isWithinBoundary = (lat, lng) => {
  return (
    lat >= BOUNDARY_LIMITS.latMin && 
    lat <= BOUNDARY_LIMITS.latMax && 
    lng >= BOUNDARY_LIMITS.lngMin && 
    lng <= BOUNDARY_LIMITS.lngMax
  );
};

export const initializeLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

export const getIsabelaCenter = () => {
  return {
    latitude: (BOUNDARY_LIMITS.latMin + BOUNDARY_LIMITS.latMax) / 2,
    longitude: (BOUNDARY_LIMITS.lngMin + BOUNDARY_LIMITS.lngMax) / 2
  };
};

export const createCustomIcon = (color = 'red') => {
  const iconUrls = {
    red: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    blue: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    green: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    orange: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    yellow: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    violet: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    grey: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    black: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png'
  };

  return L.icon({
    iconUrl: iconUrls[color] || iconUrls.red,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};