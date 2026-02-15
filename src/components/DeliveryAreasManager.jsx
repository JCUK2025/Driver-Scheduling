import React, { useState, useEffect } from 'react';
import DeliveryAreaForm from './DeliveryAreaForm';
import './DeliveryAreasManager.css';

const STORAGE_KEY = 'deliveryAreas';

const DeliveryAreasManager = () => {
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchDeliveryAreas();
  }, []);

  const fetchDeliveryAreas = () => {
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
      setDeliveryAreas(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching delivery areas:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = (areas) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(areas));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
      throw new Error('Failed to save data');
    }
  };

  const handleCreateArea = (formData) => {
    try {
      const newArea = {
        ...formData,
        _id: crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}`,
        createdAt: new Date().toISOString(),
      };
      const updatedAreas = [newArea, ...deliveryAreas];
      setDeliveryAreas(updatedAreas);
      saveToLocalStorage(updatedAreas);
      setShowForm(false);
      showSuccessMessage('Delivery area created successfully!');
    } catch (err) {
      console.error('Error creating delivery area:', err);
      throw err;
    }
  };

  const handleUpdateArea = (formData) => {
    try {
      const updatedArea = {
        ...editingArea,
        ...formData,
      };
      const updatedAreas = deliveryAreas.map(area => 
        area._id === updatedArea._id ? updatedArea : area
      );
      setDeliveryAreas(updatedAreas);
      saveToLocalStorage(updatedAreas);
      setEditingArea(null);
      setShowForm(false);
      showSuccessMessage('Delivery area updated successfully!');
    } catch (err) {
      console.error('Error updating delivery area:', err);
      throw err;
    }
  };

  const handleDeleteArea = (areaId) => {
    try {
      const updatedAreas = deliveryAreas.filter(area => area._id !== areaId);
      setDeliveryAreas(updatedAreas);
      saveToLocalStorage(updatedAreas);
      setDeleteConfirm(null);
      showSuccessMessage('Delivery area deleted successfully!');
    } catch (err) {
      setError(err.message);
      console.error('Error deleting delivery area:', err);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingArea(null);
  };

  const handleCreateNew = () => {
    setEditingArea(null);
    setShowForm(true);
  };

  const confirmDelete = (area) => {
    setDeleteConfirm(area);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="delivery-areas-manager">
        <div className="loading">Loading delivery areas...</div>
      </div>
    );
  }

  return (
    <div className="delivery-areas-manager">
      <div className="manager-header">
        <h1>Delivery Areas Management</h1>
        {!showForm && (
          <button onClick={handleCreateNew} className="btn btn-primary">
            + Create New Area
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
          <DeliveryAreaForm
            onSubmit={editingArea ? handleUpdateArea : handleCreateArea}
            onCancel={handleCancelForm}
            initialData={editingArea}
            mode={editingArea ? 'edit' : 'create'}
          />
        </div>
      )}

      {!showForm && (
        <div className="areas-list">
          {deliveryAreas.length === 0 ? (
            <div className="empty-state">
              <p>No delivery areas yet. Create your first one!</p>
            </div>
          ) : (
            <div className="areas-grid">
              {deliveryAreas.map(area => (
                <div key={area._id} className="area-card">
                  <div className="area-header">
                    <div className="area-name-group">
                      <div
                        className="colour-indicator"
                        style={{ backgroundColor: area.colour }}
                      />
                      <h3>{area.name}</h3>
                    </div>
                    <div className="area-actions">
                      <button
                        onClick={() => handleEdit(area)}
                        className="btn-icon btn-edit"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => confirmDelete(area)}
                        className="btn-icon btn-delete"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                  <div className="area-content">
                    <div className="postcodes-section">
                      <h4>Postcodes ({area.postcodes.length})</h4>
                      <div className="postcodes-display">
                        {area.postcodes.map((postcode, idx) => (
                          <span key={idx} className="postcode-badge">
                            {postcode}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="area-details">
                      <div className="detail-item">
                        <strong>Delivery:</strong> {area.deliveryDays || 1} day{(area.deliveryDays || 1) > 1 ? 's' : ''}
                      </div>
                      <div className="detail-item">
                        <strong>Priority:</strong> {area.priority === 2 ? 'Priority 2 (10-15 days)' : 'Priority 1 (5-10 days)'}
                      </div>
                    </div>
                    <div className="area-meta">
                      <small>Created: {new Date(area.createdAt).toLocaleDateString()}</small>
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
              Are you sure you want to delete the delivery area "<strong>{deleteConfirm.name}</strong>"?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => handleDeleteArea(deleteConfirm._id)}
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

export default DeliveryAreasManager;
