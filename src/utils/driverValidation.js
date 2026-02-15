/**
 * Driver validation utilities
 */

// Authorized drivers who can handle multi-day deliveries (2+ days)
export const AUTHORIZED_MULTI_DAY_DRIVERS = ['Johnnie West', 'Colin Brown'];

/**
 * Check if a driver can handle multi-day deliveries
 * According to business rules, only specific drivers can handle 2-day and 3-day deliveries.
 * 
 * @param {Object} driver - The driver object with name and deliveryDayCapability
 * @param {number} deliveryDays - Number of days required for the delivery
 * @returns {boolean} - True if driver can handle the delivery, false otherwise
 */
export const canHandleMultiDayDelivery = (driver, deliveryDays) => {
  // Validate inputs
  if (!driver || !driver.name || typeof deliveryDays !== 'number') {
    return false;
  }

  // All drivers can handle 1-day deliveries
  if (deliveryDays === 1) {
    return true;
  }
  
  // Only specific drivers can handle 2-day and 3-day deliveries
  if (deliveryDays >= 2) {
    return AUTHORIZED_MULTI_DAY_DRIVERS.includes(driver.name);
  }
  
  // Fallback for unexpected values (should not happen in normal operation)
  return false;
};

/**
 * Check if a driver can handle a consecutive multi-area route
 * Validates that the driver can handle the total number of days and is authorized for multi-day routes
 * 
 * @param {Object} driver - The driver object with name, deliveryDayCapability, and availableDays
 * @param {number} totalDays - Total number of consecutive days for the route
 * @param {Array<Object>} areas - Array of delivery area objects that make up the consecutive route
 * @param {Array<string>} requiredDays - Array of day names that must be available (e.g., ['Monday', 'Tuesday'])
 * @returns {boolean} - True if driver can handle the consecutive route, false otherwise
 */
export const canHandleConsecutiveRoute = (driver, totalDays, areas = [], requiredDays = []) => {
  // Validate inputs
  if (!driver || typeof totalDays !== 'number' || totalDays < 1) {
    return false;
  }

  // Check if driver has sufficient delivery day capability
  if (driver.deliveryDayCapability < totalDays) {
    return false;
  }

  // For multi-day routes, check if driver is authorized
  if (totalDays >= 2 && !AUTHORIZED_MULTI_DAY_DRIVERS.includes(driver.name)) {
    return false;
  }

  // Check if driver is available for all required days
  if (requiredDays && requiredDays.length > 0) {
    const hasAllDays = requiredDays.every(day => 
      driver.availableDays && driver.availableDays.includes(day)
    );
    if (!hasAllDays) {
      return false;
    }
  }

  return true;
};
