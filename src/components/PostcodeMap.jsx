import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './PostcodeMap.css';
import L from 'leaflet';
import postcodeAreasData from '../data/uk-postcode-areas.geojson';

const PostcodeMap = ({ selectedPostcodes = [], onPostcodeSelect, selectedColour = '#3498db', allDeliveryAreas = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredArea, setHoveredArea] = useState(null);
  const [sortBy, setSortBy] = useState('postcode'); // 'postcode' or 'area'

  // Get delivery area color for a postcode - memoized for performance
  const getPostcodeColor = useMemo(() => {
    return (postcodeArea) => {
      // First check if it's in the currently selected postcodes
      if (selectedPostcodes.includes(postcodeArea)) {
        return selectedColour;
      }
      
      // Then check if it's in any other delivery area
      const deliveryArea = allDeliveryAreas.find(area => 
        area.postcodes && area.postcodes.includes(postcodeArea)
      );
      
      return deliveryArea ? deliveryArea.colour : null;
    };
  }, [selectedPostcodes, selectedColour, allDeliveryAreas]);

  // Filter and sort postcode areas - memoized to avoid recalculation
  const filteredAndSortedPostcodes = useMemo(() => {
    let postcodes = postcodeAreasData.features.map(feature => ({
      postcode: feature.properties.postcode,
      area: feature.properties.area
    }));
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      postcodes = postcodes.filter(({ postcode, area }) =>
        postcode.toLowerCase().includes(search) || area.toLowerCase().includes(search)
      );
    }
    
    // Sort
    postcodes.sort((a, b) => {
      if (sortBy === 'area') {
        return a.area.localeCompare(b.area);
      }
      return a.postcode.localeCompare(b.postcode);
    });
    
    return postcodes;
  }, [searchTerm, sortBy]);

  // Filter features for map display
  const filteredFeatures = useMemo(() => {
    if (!searchTerm) return postcodeAreasData.features;
    
    return postcodeAreasData.features.filter(feature => {
      const postcode = feature.properties.postcode.toLowerCase();
      const area = feature.properties.area.toLowerCase();
      const search = searchTerm.toLowerCase();
      return postcode.includes(search) || area.includes(search);
    });
  }, [searchTerm]);

  // Style function for GeoJSON features
  const style = (feature) => {
    const postcodeArea = feature.properties.postcode;
    const color = getPostcodeColor(postcodeArea);
    
    return {
      fillColor: color || '#e0e0e0',
      weight: 1,
      opacity: 1,
      color: '#666',
      fillOpacity: color ? 0.7 : 0.3
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
        const color = getPostcodeColor(postcodeArea);
        layer.setStyle({
          weight: 1,
          color: '#666',
          fillOpacity: color ? 0.7 : 0.3
        });
        setHoveredArea(null);
      }
    });
  };

  // Memoize GeoJSON key for performance
  const geoJsonKey = useMemo(() => {
    const selectedKey = selectedPostcodes.join('-');
    const areasKey = allDeliveryAreas.map(a => a._id).join('-');
    return `postcodes-${selectedKey}-${areasKey}`;
  }, [selectedPostcodes, allDeliveryAreas]);

  return (
    <div className="postcode-map-wrapper">
      {/* Postcode List Panel */}
      <div className="postcode-list-panel">
        <div className="panel-header">
          <h3>UK Postcode Areas</h3>
          <div className="panel-controls">
            <input
              type="text"
              placeholder="Search postcodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="panel-search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="clear-search-btn"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <div className="panel-sort">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="postcode">Postcode</option>
              <option value="area">Area Name</option>
            </select>
          </div>
          <div className="panel-stats">
            <span className="stat-item">
              Total: {postcodeAreasData.features.length}
            </span>
            <span className="stat-item">
              Selected: {selectedPostcodes.length}
            </span>
          </div>
        </div>
        
        <div className="postcode-list">
          {filteredAndSortedPostcodes.map(({ postcode, area }) => {
            const color = getPostcodeColor(postcode);
            const isSelected = selectedPostcodes.includes(postcode);
            const isInOtherArea = color && !isSelected;
            
            return (
              <div
                key={postcode}
                className={`postcode-list-item ${isSelected ? 'selected' : ''} ${isInOtherArea ? 'in-other-area' : ''} ${hoveredArea === postcode ? 'hovered' : ''}`}
                onClick={() => onPostcodeSelect && onPostcodeSelect(postcode)}
                onMouseEnter={() => setHoveredArea(postcode)}
                onMouseLeave={() => setHoveredArea(null)}
                style={{
                  borderLeftColor: color || 'transparent',
                  borderLeftWidth: color ? '4px' : '0',
                }}
              >
                <div className="postcode-info">
                  <span className="postcode-code">{postcode}</span>
                  <span className="postcode-name">{area}</span>
                </div>
                {color && (
                  <div 
                    className="postcode-color-indicator"
                    style={{ backgroundColor: color }}
                    title={isSelected ? 'In current selection' : 'In another delivery area'}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Container */}
      <div className="map-container-wrapper">
        {/* Selection info */}
        <div className="map-selection-info">
          <span className="selection-count">
            <strong>{selectedPostcodes.length}</strong> area{selectedPostcodes.length !== 1 ? 's' : ''} selected
          </span>
          {hoveredArea && (
            <span className="hovered-info">
              Hovering: <strong>{hoveredArea}</strong>
            </span>
          )}
        </div>

        {/* Map */}
        <MapContainer
          center={[54.5, -2.5]}
          zoom={6}
          minZoom={5}
          maxZoom={10}
          maxBounds={[[49.5, -11], [61, 2.5]]}
          maxBoundsViscosity={0.5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          scrollWheelZoom={true}
          wheelPxPerZoomLevel={180}
          zoomDelta={0.25}
          zoomSnap={0.25}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <GeoJSON
            key={geoJsonKey}
            data={{ type: 'FeatureCollection', features: filteredFeatures }}
            style={style}
            onEachFeature={onEachFeature}
          />
          <ZoomControl position='topright' />
        </MapContainer>
      </div>
    </div>
  );
};

export default PostcodeMap;
