import React, { useState, useEffect } from 'react';
import PostcodeMap from './PostcodeMap';
import './TradeCustomerForm.css';

const TradeCustomerForm = ({ onSubmit, onCancel, initialData, mode = 'create', allTradeCustomers = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    postcodes: [],
    priority: 'P1',
    notes: ''
  });
  const [postcodeInput, setPostcodeInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        postcodes: initialData.postcodes || [],
        priority: initialData.priority || 'P1',
        notes: initialData.notes || ''
      });
    }
  }, [initialData, mode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    }

    if (formData.postcodes.length === 0) {
      newErrors.postcodes = 'At least one postcode area is required';
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
      setErrors({ submit: 'Failed to save trade customer. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="trade-customer-form">
      <h2>{mode === 'edit' ? 'Edit Trade Customer' : 'Add New Trade Customer'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            Customer Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Elevate Doors"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">
            Delivery Priority <span className="required">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className={errors.priority ? 'error' : ''}
          >
            <option value="P1">P1 - Deliver Every Week</option>
            <option value="P2">P2 - Deliver Fortnightly</option>
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
            selectedColour="#3498db"
            allDeliveryAreas={[]}
            allTradeCustomers={allTradeCustomers.filter(customer => 
              mode === 'edit' ? customer._id !== initialData?._id : true
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
            Delivery Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="e.g., Don't deliver on Fridays, Prefers morning deliveries"
            rows="4"
            className={errors.notes ? 'error' : ''}
          />
          <small className="help-text">
            Add any special delivery instructions (e.g., preferred delivery times, days to avoid)
          </small>
          {errors.notes && <span className="error-message">{errors.notes}</span>}
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
            {isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Update Customer' : 'Add Customer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TradeCustomerForm;
