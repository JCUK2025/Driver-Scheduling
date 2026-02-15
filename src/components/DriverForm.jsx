import React, { useState, useEffect } from 'react';
import './DriverForm.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const DriverForm = ({ onSubmit, onCancel, initialData, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    availableDays: [...DAYS],
    deliveryDayCapability: 1,
    priority: 'P1',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        availableDays: initialData.availableDays || [...DAYS],
        deliveryDayCapability: initialData.deliveryDayCapability || 1,
        priority: initialData.priority || 'P1',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDayToggle = (day) => {
    setFormData(prev => {
      const isSelected = prev.availableDays.includes(day);
      return {
        ...prev,
        availableDays: isSelected
          ? prev.availableDays.filter(d => d !== day)
          : [...prev.availableDays, day]
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Driver name is required';
    }

    if (formData.availableDays.length === 0) {
      newErrors.availableDays = 'At least one available day is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="driver-form">
      <h2>{mode === 'edit' ? 'Edit Driver' : 'Add New Driver'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Driver Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter driver name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Available Days *</label>
          <div className="days-selector">
            {DAYS.map(day => (
              <button
                key={day}
                type="button"
                className={`day-button ${formData.availableDays.includes(day) ? 'selected' : ''}`}
                onClick={() => handleDayToggle(day)}
              >
                {day}
              </button>
            ))}
          </div>
          {errors.availableDays && <span className="error-message">{errors.availableDays}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="deliveryDayCapability">Delivery Day Capability *</label>
          <select
            id="deliveryDayCapability"
            name="deliveryDayCapability"
            value={formData.deliveryDayCapability}
            onChange={handleChange}
          >
            <option value={1}>1 Day Deliveries</option>
            <option value={2}>2 Day Deliveries</option>
            <option value={3}>3 Day Deliveries</option>
          </select>
          <small className="help-text">
            Maximum consecutive days this driver can handle for a single delivery area
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Driver Priority *</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="P1">P1 - Schedule runs first</option>
            <option value="P2">P2 - Schedule only if not enough P1 drivers</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Driver Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="e.g., Cannot deliver to Fortress doors, prefers morning deliveries, etc."
          />
          <small className="help-text">
            Any special notes about this driver's capabilities or restrictions
          </small>
        </div>

        {errors.submit && (
          <div className="error-message submit-error">
            {errors.submit}
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : mode === 'edit' ? 'Update Driver' : 'Add Driver'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverForm;
