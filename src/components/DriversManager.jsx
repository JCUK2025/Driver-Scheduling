import React, { useState, useEffect } from 'react';
import DriverForm from './DriverForm';
import './DriversManager.css';

const STORAGE_KEY = 'drivers';

const DriversManager = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = () => {
    try {
      setLoading(true);
      setError(null);
      const stored = localStorage.getItem(STORAGE_KEY);
      let data = [];
      if (stored) {
        try {
          data = JSON.parse(stored);
          if (!Array.isArray(data)) {
            data = [];
          }
        } catch (parseError) {
          console.error('Error parsing stored data:', parseError);
          data = [];
        }
      }
      setDrivers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = (driversList) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(driversList));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
      throw new Error('Failed to save data');
    }
  };

  const handleCreateDriver = (formData) => {
    try {
      const newDriver = {
        ...formData,
        _id: crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).substring(2)}`,
        createdAt: new Date().toISOString(),
      };
      const updatedDrivers = [newDriver, ...drivers];
      setDrivers(updatedDrivers);
      saveToLocalStorage(updatedDrivers);
      setShowForm(false);
      showSuccessMessage('Driver added successfully!');
    } catch (err) {
      console.error('Error creating driver:', err);
      throw err;
    }
  };

  const handleUpdateDriver = (formData) => {
    try {
      const updatedDriver = {
        ...editingDriver,
        ...formData,
      };
      const updatedDrivers = drivers.map(driver => 
        driver._id === updatedDriver._id ? updatedDriver : driver
      );
      setDrivers(updatedDrivers);
      saveToLocalStorage(updatedDrivers);
      setEditingDriver(null);
      setShowForm(false);
      showSuccessMessage('Driver updated successfully!');
    } catch (err) {
      console.error('Error updating driver:', err);
      throw err;
    }
  };

  const handleDeleteDriver = (driverId) => {
    try {
      const updatedDrivers = drivers.filter(driver => driver._id !== driverId);
      setDrivers(updatedDrivers);
      saveToLocalStorage(updatedDrivers);
      setDeleteConfirm(null);
      showSuccessMessage('Driver deleted successfully!');
    } catch (err) {
      setError(err.message);
      console.error('Error deleting driver:', err);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingDriver(null);
  };

  const handleCreateNew = () => {
    setEditingDriver(null);
    setShowForm(true);
  };

  const confirmDelete = (driver) => {
    setDeleteConfirm(driver);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="drivers-manager">
        <div className="loading">Loading drivers...</div>
      </div>
    );
  }

  return (
    <div className="drivers-manager">
      <div className="manager-header">
        <h1>Driver Management</h1>
        {!showForm && (
          <button onClick={handleCreateNew} className="btn btn-primary">
            + Add New Driver
          </button>
        )}
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <div className="form-container">
          <DriverForm
            onSubmit={editingDriver ? handleUpdateDriver : handleCreateDriver}
            onCancel={handleCancelForm}
            initialData={editingDriver}
            mode={editingDriver ? 'edit' : 'create'}
          />
        </div>
      )}

      {!showForm && (
        <div className="drivers-list">
          {drivers.length === 0 ? (
            <div className="empty-state">
              <p>No drivers yet. Add your first driver!</p>
            </div>
          ) : (
            <div className="drivers-grid">
              {drivers.map(driver => (
                <div key={driver._id} className="driver-card">
                  <div className="driver-header">
                    <div className="driver-name-group">
                      <span className={`priority-badge priority-${driver.priority.toLowerCase()}`}>
                        {driver.priority}
                      </span>
                      <h3>{driver.name}</h3>
                    </div>
                    <div className="driver-actions">
                      <button
                        onClick={() => handleEdit(driver)}
                        className="btn-icon btn-edit"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => confirmDelete(driver)}
                        className="btn-icon btn-delete"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                  <div className="driver-content">
                    <div className="driver-details">
                      <div className="detail-item">
                        <strong>Capability:</strong> {driver.deliveryDayCapability} day{driver.deliveryDayCapability > 1 ? 's' : ''}
                      </div>
                      <div className="detail-item">
                        <strong>Available Days:</strong>
                        <div className="days-display">
                          {driver.availableDays.map((day, idx) => (
                            <span key={idx} className="day-badge">
                              {day.substring(0, 3)}
                            </span>
                          ))}
                        </div>
                      </div>
                      {driver.notes && (
                        <div className="detail-item notes">
                          <strong>Notes:</strong>
                          <p>{driver.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="driver-meta">
                      <small>Added: {new Date(driver.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete driver "<strong>{deleteConfirm.name}</strong>"?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDriver(deleteConfirm._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversManager;
