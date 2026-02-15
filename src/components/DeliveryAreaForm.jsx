import React, { useState, useEffect } from 'react';
import PostcodeMap from './PostcodeMap';
import { calculateColorFromPostcodes, getRegionDescription, calculateAverageLatitude } from '../utils/colorUtils';
import './DeliveryAreaForm.css';

const DeliveryAreaForm = ({ onSubmit, onCancel, initialData, mode = 'create', allDeliveryAreas = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    colour: '#3498db',
    postcodes: [],
    deliveryDays: 1,
    priority: 1,
    weekAssignment: null,
    consecutiveWith: null,
    routeOrder: null,
    notes: ''
  });
  const [autoColor, setAutoColor] = useState('#3498db');
  const [colorOverridden, setColorOverridden] = useState(false);
  const [postcodeInput, setPostcodeInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        colour: initialData.colour || '#3498db',
        postcodes: initialData.postcodes || [],
        deliveryDays: initialData.deliveryDays || 1,
        priority: initialData.priority || 1,
        weekAssignment: initialData.weekAssignment || null,
        consecutiveWith: initialData.consecutiveWith || null,
        routeOrder: initialData.routeOrder || null,
        notes: initialData.notes || ''
      });
      // When editing, assume color may have been manually set
      setColorOverridden(true);
    }
  }, [initialData, mode]);

  // Auto-calculate color when postcodes change
  useEffect(() => {
    if (formData.postcodes.length > 0 && !colorOverridden) {
      const calculatedColor = calculateColorFromPostcodes(formData.postcodes);
      setAutoColor(calculatedColor);
      setFormData(prev => ({
        ...prev,
        colour: calculatedColor
      }));
    }
  }, [formData.postcodes, colorOverridden]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Delivery area name is required';
    }

    if (formData.postcodes.length === 0) {
      newErrors.postcodes = 'At least one postcode area is required';
    }

    if (!/^#[0-9A-F]{6}$/i.test(formData.colour)) {
      newErrors.colour = 'Please enter a valid hex colour code (e.g., #3498db)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert numeric fields to numbers
    let processedValue = value;
    if (name === 'deliveryDays' || name === 'priority' || name === 'weekAssignment' || name === 'routeOrder') {
      processedValue = value === '' || value === 'null' ? null : parseInt(value, 10);
    }
    
    // If color is manually changed, mark it as overridden
    if (name === 'colour') {
      setColorOverridden(true);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleResetColor = () => {
    setColorOverridden(false);
    if (formData.postcodes.length > 0) {
      const calculatedColor = calculateColorFromPostcodes(formData.postcodes);
      setAutoColor(calculatedColor);
      setFormData(prev => ({
        ...prev,
        colour: calculatedColor
      }));
    }
  };

  const handlePostcodeSelect = (postcode) => {
    setFormData(prev => {
      const isSelected = prev.postcodes.includes(postcode);
      
      if (isSelected) {
        // Remove postcode
        return {
          ...prev,
          postcodes: prev.postcodes.filter(p => p !== postcode)
        };
      } else {
        // Add postcode
        return {
          ...prev,
          postcodes: [...prev.postcodes, postcode]
        };
      }
    });
    
    // Clear postcode error when user selects from map
    if (errors.postcodes) {
      setErrors(prev => ({
        ...prev,
        postcodes: undefined
      }));
    }
  };

  const handleAddPostcode = () => {
    if (!postcodeInput.trim()) return;

    const upperPostcode = postcodeInput.trim().toUpperCase();
    
    // Check for duplicates
    if (formData.postcodes.includes(upperPostcode)) {
      setErrors(prev => ({
        ...prev,
        postcodes: 'This postcode has already been added'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      postcodes: [...prev.postcodes, upperPostcode]
    }));
    setPostcodeInput('');
    
    // Clear postcode error
    if (errors.postcodes) {
      setErrors(prev => ({
        ...prev,
        postcodes: undefined
      }));
    }
  };

  const handleRemovePostcode = (index) => {
    setFormData(prev => ({
      ...prev,
      postcodes: prev.postcodes.filter((_, i) => i !== index)
    }));
  };

  const handlePostcodeKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPostcode();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to save delivery area. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="delivery-area-form">
      <h2>{mode === 'edit' ? 'Edit Delivery Area' : 'Create New Delivery Area'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            Area Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Norwich, London"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="colour">
            Colour <span className="required">*</span>
          </label>
          <div className="colour-input-group">
            <input
              type="color"
              id="colour"
              name="colour"
              value={formData.colour}
              onChange={handleInputChange}
              className="colour-picker"
            />
            <input
              type="text"
              name="colour"
              value={formData.colour}
              onChange={handleInputChange}
              placeholder="#3498db"
              className={`colour-text ${errors.colour ? 'error' : ''}`}
              maxLength="7"
            />
            {colorOverridden && formData.postcodes.length > 0 && (
              <button
                type="button"
                onClick={handleResetColor}
                className="btn-reset-color"
                title="Reset to auto-calculated color"
              >
                Reset
              </button>
            )}
          </div>
          {formData.postcodes.length > 0 && (
            <small className="help-text">
              {colorOverridden ? (
                <>Color manually overridden. Auto-suggested: <span style={{ color: autoColor }}>●</span> {autoColor}</>
              ) : (
                <>Auto-calculated from postcodes ({getRegionDescription(calculateAverageLatitude(formData.postcodes))})</>
              )}
            </small>
          )}
          {errors.colour && <span className="error-message">{errors.colour}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="deliveryDays">
            Delivery Route Duration <span className="required">*</span>
          </label>
          <select
            id="deliveryDays"
            name="deliveryDays"
            value={formData.deliveryDays}
            onChange={handleInputChange}
            className={errors.deliveryDays ? 'error' : ''}
          >
            <option value={1}>1 Day Delivery</option>
            <option value={2}>2 Day Delivery</option>
            <option value={3}>3 Day Delivery</option>
          </select>
          {errors.deliveryDays && <span className="error-message">{errors.deliveryDays}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">
            Priority <span className="required">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className={errors.priority ? 'error' : ''}
          >
            <option value={1}>Priority 1 (Weekly - runs every week)</option>
            <option value={2}>Priority 2 (Fortnightly - runs every 2 weeks)</option>
          </select>
          {errors.priority && <span className="error-message">{errors.priority}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="weekAssignment">
            Week Assignment
          </label>
          <select
            id="weekAssignment"
            name="weekAssignment"
            value={formData.weekAssignment === null ? 'null' : formData.weekAssignment}
            onChange={handleInputChange}
          >
            <option value="null">Both weeks (default)</option>
            <option value={1}>Week 1 only</option>
            <option value={2}>Week 2 only</option>
          </select>
          <small className="help-text">
            Specify if this area should only be delivered in a specific week of the 2-week rotation
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="consecutiveWith">
            Consecutive Route Partner
          </label>
          <select
            id="consecutiveWith"
            name="consecutiveWith"
            value={formData.consecutiveWith || ''}
            onChange={handleInputChange}
          >
            <option value="">None (standalone route)</option>
            {allDeliveryAreas
              .filter(area => mode === 'edit' ? area._id !== initialData?._id : true)
              .map(area => (
                <option key={area._id} value={area._id}>
                  {area.name}
                </option>
              ))}
          </select>
          <small className="help-text">
            Select another delivery area that runs consecutively with this one
          </small>
        </div>

        {formData.consecutiveWith && (
          <div className="form-group">
            <label htmlFor="routeOrder">
              Route Order
            </label>
            <select
              id="routeOrder"
              name="routeOrder"
              value={formData.routeOrder === null ? 'null' : formData.routeOrder}
              onChange={handleInputChange}
            >
              <option value="null">Not specified</option>
              <option value={1}>First (Day 1)</option>
              <option value={2}>Second (Day 2)</option>
              <option value={3}>Third (Day 3)</option>
            </select>
            <small className="help-text">
              Order in the consecutive route sequence
            </small>
          </div>
        )}

        <div className="form-group">
          <label>
            Select Postcode Areas on Map or Add Manually <span className="required">*</span>
          </label>
          <PostcodeMap
            selectedPostcodes={formData.postcodes}
            onPostcodeSelect={handlePostcodeSelect}
            selectedColour={formData.colour}
            allDeliveryAreas={allDeliveryAreas.filter(area => 
              mode === 'edit' ? area._id !== initialData?._id : true
            )}
          />
          {errors.postcodes && <span className="error-message">{errors.postcodes}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="postcode-input">
            Add Postcode Areas Manually
          </label>
          <div className="postcode-input-group">
            <input
              type="text"
              id="postcode-input"
              value={postcodeInput}
              onChange={(e) => setPostcodeInput(e.target.value)}
              onKeyPress={handlePostcodeKeyPress}
              placeholder="Enter postcode area (e.g., SW, NR, B, E)"
            />
            <button
              type="button"
              onClick={handleAddPostcode}
              className="btn-add-postcode"
            >
              Add
            </button>
          </div>
          
          {formData.postcodes.length > 0 && (
            <div className="postcodes-list">
              {formData.postcodes.map((postcode, index) => (
                <span key={index} className="postcode-tag">
                  {postcode}
                  <button
                    type="button"
                    onClick={() => handleRemovePostcode(index)}
                    className="btn-remove-postcode"
                    aria-label="Remove postcode"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="notes">
            Delivery Area Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="4"
            placeholder="e.g., Geographic location notes, special delivery considerations, proximity to other areas, etc."
          />
          <small className="help-text">
            Any special notes about this delivery area (geographic location, delivery restrictions, etc.)
          </small>
        </div>

        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Update Area' : 'Create Area')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryAreaForm;
