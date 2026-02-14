import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './PostcodeMap.css';
import L from 'leaflet';
import postcodeAreasData from '../data/uk-postcode-areas.geojson';

const PostcodeMap = ({ selectedPostcodes = [], onPostcodeSelect, selectedColour = '#3498db' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredArea, setHoveredArea] = useState(null);

  // Filter postcode areas based on search term
  const filteredFeatures = searchTerm
    ? postcodeAreasData.features.filter(feature => {
        const postcode = feature.properties.postcode.toLowerCase();
        const area = feature.properties.area.toLowerCase();
        const search = searchTerm.toLowerCase();
        return postcode.includes(search) || area.includes(search);
      })
    : postcodeAreasData.features;

  // Style function for GeoJSON features
  const style = (feature) => {
    const postcodeArea = feature.properties.postcode;
    const isSelected = selectedPostcodes.includes(postcodeArea);
    
    return {
      fillColor: isSelected ? selectedColour : '#e0e0e0',
      weight: 1,
      opacity: 1,
      color: '#666',
      fillOpacity: isSelected ? 0.7 : 0.3
    };
  };

  // Handle click on postcode area
  const onEachFeature = (feature, layer) => {
    const postcodeArea = feature.properties.postcode;
    const areaName = feature.properties.area;

    // Bind tooltip
    layer.bindTooltip(`${postcodeArea} - ${areaName}`, {
      permanent: false,
      direction: 'center',
      className: 'postcode-tooltip'
    });

    // Click handler
    layer.on({
      click: () => {
        if (onPostcodeSelect) {
          onPostcodeSelect(postcodeArea);
        }
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#333',
          fillOpacity: 0.8
        });
        setHoveredArea(postcodeArea);
      },
      mouseout: (e) => {
        const layer = e.target;
        const isSelected = selectedPostcodes.includes(postcodeArea);
        layer.setStyle({
          weight: 1,
          color: '#666',
          fillOpacity: isSelected ? 0.7 : 0.3
        });
        setHoveredArea(null);
      }
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
      {/* Search bar */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50px',
        zIndex: 1000,
        background: 'white',
        padding: '10px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        <input
          type="text"
          placeholder="Search postcode areas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '250px',
            fontSize: '14px'
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{
              marginLeft: '8px',
              padding: '8px 12px',
              background: '#e0e0e0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Selection info */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '50px',
        zIndex: 1000,
        background: 'white',
        padding: '10px 15px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        Selected: {selectedPostcodes.length} area{selectedPostcodes.length !== 1 ? 's' : ''}
      </div>

      {/* Map */}
      <MapContainer
        center={[54.5, -3.5]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <GeoJSON
          key={`${selectedPostcodes.join(',')}-${searchTerm}`}
          data={{ type: 'FeatureCollection', features: filteredFeatures }}
          style={style}
          onEachFeature={onEachFeature}
        />
        <ZoomControl position='topright' />
      </MapContainer>
    </div>
  );
};

export default PostcodeMap;
