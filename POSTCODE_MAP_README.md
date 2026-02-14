# Interactive UK Postcode Map Component

A fully-featured, interactive map component for creating and managing delivery areas with visual postcode selection.

## 🌟 Features

### Core Functionality
- **Interactive UK Map**: Full UK coverage with OpenStreetMap tiles via Leaflet.js
- **Visual Postcode Selection**: Click postcodes on the map to select/deselect them
- **Real-time Highlighting**: Selected postcodes are visually highlighted in the chosen delivery area colour
- **Search & Filter**: Search postcodes and areas with instant map filtering
- **Smart Zoom**: Automatic zoom to fit selected postcodes, plus manual zoom controls
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Map Features
- ✅ 44 realistic UK postcodes covering major cities and regions
- ✅ County and country border overlays
- ✅ Interactive postcode markers with hover tooltips
- ✅ Colour-coded selection visualization
- ✅ Selection count and management panel
- ✅ Clear all selection functionality
- ✅ Zoom to selection button
- ✅ Legend showing marker and border types

### Integration with Delivery Areas
- ✅ Seamlessly integrated with DeliveryAreaForm component
- ✅ Two-way sync between map selection and form data
- ✅ Manual postcode entry option alongside map selection
- ✅ Colour picker integration for area visualization
- ✅ Full CRUD operations support

## 📦 Components

### PostcodeMap.jsx
Main interactive map component with:
- Leaflet map container with OpenStreetMap tiles
- GeoJSON postcode markers (circle markers)
- GeoJSON boundary overlays (counties and countries)
- Search bar for filtering postcodes
- Selection info panel showing count and controls
- Interactive legend
- Selected postcodes display panel

**Props:**
- `selectedPostcodes` (array): Array of selected postcode strings
- `onPostcodeSelect` (function): Callback when a postcode is clicked
- `selectedColour` (string): Hex colour for selected postcodes

### PostcodeMap.css
Complete styling including:
- Map container and controls layout
- Search bar and filter styling
- Legend styling
- Selection panel styling
- Responsive breakpoints for mobile/tablet
- Leaflet tooltip customization

### DeliveryAreaForm.jsx (Updated)
Enhanced form with:
- PostcodeMap integration
- Map-based postcode selection
- Manual postcode entry option
- Two-way data synchronization
- Colour picker affecting map visualization

## 📊 Data Files

### uk-postcodes.geojson
GeoJSON FeatureCollection containing 44 UK postcodes:
- **Coverage**: Major cities including London, Manchester, Birmingham, Leeds, Glasgow, Edinburgh, Cardiff, Belfast, Norwich, etc.
- **Data per postcode**:
  - Postcode code (e.g., "NR1", "E1", "M1")
  - Area name (e.g., "Norwich", "East London")
  - County (e.g., "Norfolk", "Greater London")
  - Country (England, Scotland, Wales, Northern Ireland)
  - Region (e.g., "East of England", "London")
  - Coordinates (latitude, longitude)

### uk-boundaries.geojson
GeoJSON FeatureCollection containing:
- UK country boundary
- England, Scotland, Wales, Northern Ireland boundaries
- County boundaries for major counties
- Border type metadata (country vs. county)

## 🚀 Installation

### Dependencies Already Installed
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^3.2.5"
}
```

### Required CSS
The Leaflet CSS is required and should be imported in your application:
```javascript
import 'leaflet/dist/leaflet.css';
```

## 💻 Usage

### Basic Implementation

```javascript
import React, { useState } from 'react';
import PostcodeMap from './components/PostcodeMap';

function App() {
  const [selectedPostcodes, setSelectedPostcodes] = useState([]);
  const [colour, setColour] = useState('#3498db');

  const handlePostcodeSelect = (postcode) => {
    setSelectedPostcodes(prev => {
      if (prev.includes(postcode)) {
        return prev.filter(p => p !== postcode);
      } else {
        return [...prev, postcode];
      }
    });
  };

  return (
    <div>
      <h1>Delivery Area Map</h1>
      <input
        type="color"
        value={colour}
        onChange={(e) => setColour(e.target.value)}
      />
      <PostcodeMap
        selectedPostcodes={selectedPostcodes}
        onPostcodeSelect={handlePostcodeSelect}
        selectedColour={colour}
      />
    </div>
  );
}

export default App;
```

### With DeliveryAreaForm

```javascript
import React from 'react';
import DeliveryAreasManager from './components/DeliveryAreasManager';

function App() {
  return (
    <div className="App">
      <DeliveryAreasManager />
    </div>
  );
}

export default App;
```

## 🎨 Customization

### Changing Map Tiles
Edit `PostcodeMap.jsx` to use different map tiles:

```javascript
<TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
```

### Adjusting Marker Styles
Modify the `postcodeStyle` function in `PostcodeMap.jsx`:

```javascript
const postcodeStyle = (feature) => {
  const isSelected = selectedPostcodes.includes(feature.properties.postcode);
  return {
    radius: 8,              // Marker size
    fillColor: isSelected ? selectedColour : '#95a5a6',
    color: isSelected ? '#2c3e50' : '#7f8c8d',
    weight: isSelected ? 2 : 1,
    opacity: 1,
    fillOpacity: isSelected ? 0.8 : 0.6
  };
};
```

### Adding More Postcodes
Add entries to `src/data/uk-postcodes.geojson`:

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  "properties": {
    "postcode": "AB1",
    "area": "Area Name",
    "county": "County Name",
    "country": "Country",
    "region": "Region"
  }
}
```

## 🎯 User Workflow

1. User opens the delivery areas management interface
2. Clicks "Create New Area" to open the form with integrated map
3. Interactive UK map displays with all postcodes as clickable markers
4. User clicks postcodes on the map to select them (highlighted in chosen colour)
5. Selected postcodes appear in both the selection panel and the form
6. User can:
   - Search/filter postcodes by typing in the search bar
   - Zoom to fit selected postcodes
   - Clear all selections
   - Manually add postcodes via text input
7. User enters delivery area name and selects a colour
8. User clicks "Create Area" to save the delivery area
9. The delivery area is saved with the selected postcodes

## 🎨 Visual Elements

### Map Markers
- **Unselected**: Gray circle markers with low opacity
- **Selected**: Colored circle markers matching the chosen delivery area colour
- **Hover**: Markers enlarge and show tooltip with details

### Boundaries
- **Country Borders**: Solid dark lines
- **County Borders**: Dashed gray lines

### Tooltips
- **Postcode Tooltips**: Show postcode, area, county, and country
- **Boundary Tooltips**: Show boundary name and type

### Controls
- **Search Bar**: Filter postcodes with clear button
- **Selection Count**: Display number of selected postcodes
- **Zoom to Selection**: Button to fit selected postcodes in view
- **Clear All**: Button to deselect all postcodes
- **Legend**: Visual guide to marker and border types

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Design

The map component is fully responsive with breakpoints at:
- **Desktop**: Full-featured layout (> 768px)
- **Tablet**: Adjusted controls and panels (481px - 768px)
- **Mobile**: Compact layout with stacked controls (< 480px)

## 🔧 Technical Details

### Component Structure
```
PostcodeMap.jsx
├── MapContainer (Leaflet)
│   ├── TileLayer (OpenStreetMap)
│   ├── GeoJSON (Boundaries)
│   ├── GeoJSON (Postcodes)
│   └── MapBounds (Auto-zoom helper)
├── Search Bar
├── Selection Info Panel
├── Legend
└── Selected Postcodes Panel
```

### State Management
- Selected postcodes managed via props (controlled component)
- Search term managed internally
- Map reference for programmatic control
- GeoJSON data loaded on mount

### Performance Optimizations
- GeoJSON data loaded once on component mount
- Map re-renders only on selection or search changes
- Circle markers for efficient rendering
- Tooltip binding optimized for large datasets

## 🐛 Known Limitations

1. **Dataset Size**: Currently includes 44 postcodes. For production, consider:
   - Loading postcodes dynamically based on viewport
   - Using clustering for large datasets
   - Implementing server-side filtering

2. **Offline Support**: Requires internet connection for map tiles

3. **Postcode Validation**: Manual entry doesn't validate against UK postcode format

## 🚀 Future Enhancements

- [ ] Add postcode clustering for large datasets
- [ ] Implement draw tools for area selection
- [ ] Add distance calculation between postcodes
- [ ] Support for postcode districts and sectors
- [ ] Import/export delivery area configurations
- [ ] Undo/redo functionality
- [ ] Keyboard shortcuts for map navigation
- [ ] Multi-language support

## 📄 License

This component is part of the Driver-Scheduling application.

## 🤝 Contributing

When adding new postcodes or features:
1. Ensure GeoJSON format is valid
2. Include all required properties (postcode, area, county, country, region, coordinates)
3. Test on multiple screen sizes
4. Update documentation

## 📞 Support

For issues or questions about the interactive map component, please refer to the main project documentation.

---

**Built with ❤️ using React, Leaflet, and GeoJSON**
