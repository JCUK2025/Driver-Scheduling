/**
 * Color utility functions for automatic geographic color assignment
 * Based on latitude from postcode data
 */

// Import postcode data from existing data files
// These files are part of the repository's geographic data
import postcodeData from '../data/uk-postcodes.json';
import postcodeAreasData from '../data/postcode-areas.json';

/**
 * Calculate average latitude from an array of postcodes
 * @param {Array<string>} postcodes - Array of postcode strings or postcode areas
 * @returns {number|null} - Average latitude or null if no valid postcodes
 */
export const calculateAverageLatitude = (postcodes) => {
  if (!postcodes || postcodes.length === 0) {
    return null;
  }

  // Create maps for quick lookup
  const postcodeMap = new Map();
  const postcodeAreaMap = new Map();
  
  // Load full postcode data
  postcodeData.forEach(entry => {
    const normalizedPostcode = entry.postcode.toUpperCase().replace(/\s+/g, '');
    postcodeMap.set(normalizedPostcode, entry);
  });

  // Load postcode area data (this is more complete)
  if (postcodeAreasData && postcodeAreasData.postcode_areas) {
    postcodeAreasData.postcode_areas.forEach(entry => {
      postcodeAreaMap.set(entry.area.toUpperCase(), entry.coordinates);
    });
  }

  let totalLatitude = 0;
  let validCount = 0;

  postcodes.forEach(postcode => {
    // Normalize the postcode
    const normalizedPostcode = postcode.toUpperCase().replace(/\s+/g, '');
    
    // Try exact match in full postcode data first
    let postcodeEntry = postcodeMap.get(normalizedPostcode);
    
    if (postcodeEntry && postcodeEntry.latitude) {
      totalLatitude += postcodeEntry.latitude;
      validCount++;
      return;
    }

    // Try matching as postcode area (e.g., "NR", "SW", "EH")
    const postcodeAreaMatch = normalizedPostcode.match(/^([A-Z]{1,2})/)?.[1];
    
    if (postcodeAreaMatch && postcodeAreaMap.has(postcodeAreaMatch)) {
      const coords = postcodeAreaMap.get(postcodeAreaMatch);
      if (coords && coords.latitude) {
        totalLatitude += coords.latitude;
        validCount++;
        return;
      }
    }
  });

  if (validCount === 0) {
    return null;
  }

  return totalLatitude / validCount;
};

/**
 * Map latitude to color using a gradient
 * Higher latitude (Scotland) = Darker colors
 * Lower latitude (South England) = Lighter colors
 * 
 * @param {number} latitude - Latitude value
 * @returns {string} - Hex color code
 */
export const latitudeToColor = (latitude) => {
  if (latitude === null || latitude === undefined) {
    return '#3498db'; // Default blue
  }

  // Color gradient mapping based on latitude ranges
  // Scotland (55-59°N) → Dark blue/purple
  // Northern England (53-55°N) → Medium blue
  // Midlands (52-53°N) → Blue-teal
  // South England/Wales (50-52°N) → Light teal/green
  // Cornwall/Southwest (49-50°N) → Light green

  if (latitude >= 57) {
    return '#1a237e'; // Very dark blue (Higher Scotland)
  } else if (latitude >= 55) {
    return '#3f51b5'; // Dark blue (Lower Scotland)
  } else if (latitude >= 54) {
    return '#5c6bc0'; // Medium blue (Northern England)
  } else if (latitude >= 53) {
    return '#7986cb'; // Medium-light blue (North/Upper England)
  } else if (latitude >= 52) {
    return '#90caf9'; // Light blue (Midlands)
  } else if (latitude >= 51) {
    return '#4db6ac'; // Teal (Southeast England)
  } else if (latitude >= 50) {
    return '#80cbc4'; // Light teal (South/Southwest)
  } else {
    return '#81c784'; // Green (Cornwall/Southwest tip)
  }
};

/**
 * Calculate automatic color assignment based on geographic latitude
 * Uses postcode data from delivery area
 * 
 * @param {Array<string>} postcodes - Array of postcode strings
 * @returns {string} - Hex color code
 */
export const calculateColorFromPostcodes = (postcodes) => {
  const avgLatitude = calculateAverageLatitude(postcodes);
  
  if (avgLatitude === null) {
    return '#3498db'; // Default blue if no valid postcodes
  }
  
  return latitudeToColor(avgLatitude);
};

/**
 * Get a human-readable description of the geographic region based on latitude
 * 
 * @param {number} latitude - Latitude value
 * @returns {string} - Region description
 */
export const getRegionDescription = (latitude) => {
  if (latitude === null || latitude === undefined) {
    return 'Unknown';
  }

  if (latitude >= 57) {
    return 'Higher Scotland';
  } else if (latitude >= 55) {
    return 'Lower Scotland';
  } else if (latitude >= 54) {
    return 'Northern England';
  } else if (latitude >= 53) {
    return 'Upper England';
  } else if (latitude >= 52) {
    return 'Midlands';
  } else if (latitude >= 51) {
    return 'Southeast England';
  } else if (latitude >= 50) {
    return 'South England / Wales';
  } else {
    return 'Southwest England';
  }
};
