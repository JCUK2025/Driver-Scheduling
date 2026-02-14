import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet-images/marker-icon-2x.png',
  iconUrl: '/leaflet-images/marker-icon.png',
  shadowUrl: '/leaflet-images/marker-shadow.png',
});

// Replace this with your actual postcode data
const postcodeData = [
  { postcode: 'SW1A 1AA', lat: 51.5014, lng: -0.1419 },
  { postcode: 'W1A 1AA', lat: 51.5074, lng: -0.1278 }
  // Add more postcodes
];

const PostcodeMap = () => {
  const [selectedPostcode, setSelectedPostcode] = useState(null);

  return (
    <MapContainer center={[55.3781, -3.4360]} zoom={6} style={{ height: '100vh', width: '100%' }} zoomControl={false}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {postcodeData.map((postcode) => (
        <Marker
          key={postcode.postcode}
          position={[postcode.lat, postcode.lng]}
          eventHandlers={{
            click: () => {
              setSelectedPostcode(postcode.postcode);
            },
          }}
        >
          <Popup>
            {postcode.postcode}
          </Popup>
        </Marker>
      ))}
      <ZoomControl position='topright' />
      {/* Search functionality should be implemented here */}
    </MapContainer>
  );
};

export default PostcodeMap;
