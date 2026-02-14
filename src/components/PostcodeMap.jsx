import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PostcodeMap.css';
import ukPostcodesData from '../data/uk-postcodes.geojson';
import ukBoundariesData from '../data/uk-boundaries.geojson';

// Component to handle map bounds
const MapBounds = ({ selectedPostcodes, postcodes }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPostcodes.length > 0) {
      const selectedFeatures = postcodes.features.filter(f => 
        selectedPostcodes.includes(f.properties.postcode)
      );
      
      if (selectedFeatures.length > 0) {
        const bounds = L.latLngBounds(
          selectedFeatures.map(f => [
            f.geometry.coordinates[1],
            f.geometry.coordinates[0]
          ])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } else {
      // Default view of UK
      map.setView([54.5, -3.5], 6);
    }
  }, [selectedPostcodes, postcodes, map]);

  return null;
};

const PostcodeMap = ({ selectedPostcodes = [], onPostcodeSelect, selectedColour = '#3498db' }) => {
  const [postcodes, setPostcodes] = useState({ type: 'FeatureCollection', features: [] });
  const [boundaries, setBoundaries] = useState({ type: 'FeatureCollection', features: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    // Load GeoJSON data
    setPostcodes(ukPostcodesData);
    setBoundaries(ukBoundariesData);
  }, []);

  const handlePostcodeClick = (postcode) => {
    if (onPostcodeSelect) {
      onPostcodeSelect(postcode);
    }
  };

  const handleClearSelection = () => {
    if (onPostcodeSelect) {
      selectedPostcodes.forEach(postcode => {
        onPostcodeSelect(postcode);
      });
    }
  };

  const handleZoomToSelection = () => {
    if (selectedPostcodes.length > 0 && mapRef.current) {
      const selectedFeatures = postcodes.features.filter(f => 
        selectedPostcodes.includes(f.properties.postcode)
      );
      
      if (selectedFeatures.length > 0) {
        const bounds = L.latLngBounds(
          selectedFeatures.map(f => [
            f.geometry.coordinates[1],
            f.geometry.coordinates[0]
          ])
        );
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };

  // Style for postcode markers
  const postcodeStyle = (feature) => {
    const isSelected = selectedPostcodes.includes(feature.properties.postcode);
    return {
      radius: 8,
      fillColor: isSelected ? selectedColour : '#95a5a6',
      color: isSelected ? '#2c3e50' : '#7f8c8d',
      weight: isSelected ? 2 : 1,
      opacity: 1,
      fillOpacity: isSelected ? 0.8 : 0.6
    };
  };

  // Style for boundaries
  const boundaryStyle = (feature) => {
    return {
      color: feature.properties.type === 'country' ? '#2c3e50' : '#95a5a6',
      weight: feature.properties.type === 'country' ? 2 : 1,
      opacity: 0.6,
      fillOpacity: 0,
      dashArray: feature.properties.type === 'county' ? '5, 5' : null
    };
  };

  // Convert point to circle marker
  const pointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, postcodeStyle(feature));
  };

  // Handle feature interactions
  const onEachFeature = (feature, layer) => {
    if (feature.properties.postcode) {
      const postcode = feature.properties.postcode;
      const props = feature.properties;
      
      layer.bindTooltip(
        `<strong>${postcode}</strong><br/>
         ${props.area}<br/>
         ${props.county}, ${props.country}`,
        { 
          permanent: false,
          direction: 'top',
          className: 'postcode-tooltip'
        }
      );

      layer.on({
        click: () => handlePostcodeClick(postcode),
        mouseover: (e) => {
          const target = e.target;
          target.setStyle({
            radius: 10,
            weight: 3
          });
        },
        mouseout: (e) => {
          const target = e.target;
          target.setStyle(postcodeStyle(feature));
        }
      });
    }
  };

  // Handle boundary feature interactions
  const onEachBoundary = (feature, layer) => {
    if (feature.properties.name) {
      layer.bindTooltip(
        `<strong>${feature.properties.name}</strong><br/>
         ${feature.properties.type}`,
        { 
          permanent: false,
          direction: 'center',
          className: 'boundary-tooltip'
        }
      );
    }
  };

  const filteredPostcodes = searchTerm
    ? {
        type: 'FeatureCollection',
        features: postcodes.features.filter(f =>
          f.properties.postcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.properties.area.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
    : postcodes;

  return (
    <div className="postcode-map-container">
      <div className="map-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search postcodes or areas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="clear-search-btn"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="selection-info">
          <div className="selection-count">
            <strong>{selectedPostcodes.length}</strong> postcode{selectedPostcodes.length !== 1 ? 's' : ''} selected
          </div>
          {selectedPostcodes.length > 0 && (
            <div className="selection-actions">
              <button
                onClick={handleZoomToSelection}
                className="btn-zoom"
                title="Zoom to selection"
              >
                🔍 Zoom to Selection
              </button>
              <button
                onClick={handleClearSelection}
                className="btn-clear"
                title="Clear selection"
              >
                ✕ Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="map-legend">
        <h4>Legend</h4>
        <div className="legend-item">
          <span className="legend-marker selected" style={{ backgroundColor: selectedColour }}></span>
          <span>Selected Postcode</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker unselected"></span>
          <span>Unselected Postcode</span>
        </div>
        <div className="legend-item">
          <span className="legend-line country"></span>
          <span>Country Border</span>
        </div>
        <div className="legend-item">
          <span className="legend-line county"></span>
          <span>County Border</span>
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={[54.5, -3.5]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Boundaries layer */}
          <GeoJSON
            data={boundaries}
            style={boundaryStyle}
            onEachFeature={onEachBoundary}
          />
          
          {/* Postcodes layer */}
          <GeoJSON
            key={JSON.stringify(selectedPostcodes) + searchTerm}
            data={filteredPostcodes}
            pointToLayer={pointToLayer}
            onEachFeature={onEachFeature}
          />

          <MapBounds selectedPostcodes={selectedPostcodes} postcodes={postcodes} />
        </MapContainer>
      </div>

      {selectedPostcodes.length > 0 && (
        <div className="selected-postcodes-panel">
          <h4>Selected Postcodes</h4>
          <div className="selected-postcodes-list">
            {selectedPostcodes.map(postcode => (
              <span
                key={postcode}
                className="selected-postcode-tag"
                style={{ backgroundColor: selectedColour }}
              >
                {postcode}
                <button
                  onClick={() => handlePostcodeClick(postcode)}
                  className="remove-postcode-btn"
                  title="Deselect postcode"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostcodeMap;
