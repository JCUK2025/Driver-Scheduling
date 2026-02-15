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
