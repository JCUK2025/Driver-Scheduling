import React, { useState, useEffect } from 'react';
import PostcodeMap from './PostcodeMap';
import './DeliveryAreaForm.css';

const DeliveryAreaForm = ({ onSubmit, onCancel, initialData, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    colour: '#3498db',
    postcodes: [],
    deliveryDays: 1,
    priority: 1
  });
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
        priority: initialData.priority || 1
      });
    }
  }, [initialData, mode]);

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
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
          </div>
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
            <option value={1}>Priority 1 (5-10 day delivery)</option>
            <option value={2}>Priority 2 (10-15 day delivery)</option>
          </select>
          {errors.priority && <span className="error-message">{errors.priority}</span>}
        </div>

        <div className="form-group">
          <label>
            Select Postcode Areas on Map or Add Manually <span className="required">*</span>
          </label>
          <PostcodeMap
            selectedPostcodes={formData.postcodes}
            onPostcodeSelect={handlePostcodeSelect}
            selectedColour={formData.colour}
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
