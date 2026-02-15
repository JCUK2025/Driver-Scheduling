import React, { useState, useEffect } from 'react';
import './TradeCustomerForm.css';

const TradeCustomerForm = ({ onSubmit, onCancel, initialData, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    postcodeArea: '',
    priority: 'P1',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        postcodeArea: initialData.postcodeArea || '',
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

    if (!formData.postcodeArea.trim()) {
      newErrors.postcodeArea = 'Postcode area is required';
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
          <label htmlFor="postcodeArea">
            Postcode Area <span className="required">*</span>
          </label>
          <input
            type="text"
            id="postcodeArea"
            name="postcodeArea"
            value={formData.postcodeArea}
            onChange={handleInputChange}
            placeholder="e.g., Bristol, BS, London"
            className={errors.postcodeArea ? 'error' : ''}
          />
          {errors.postcodeArea && <span className="error-message">{errors.postcodeArea}</span>}
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
