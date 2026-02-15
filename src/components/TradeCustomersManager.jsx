import React, { useState, useEffect } from 'react';
import TradeCustomerForm from './TradeCustomerForm';
import './TradeCustomersManager.css';

const STORAGE_KEY = 'tradeCustomers';

const TradeCustomersManager = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
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
      setCustomers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching trade customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = (customersList) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customersList));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
      throw new Error('Failed to save data');
    }
  };

  const handleCreateCustomer = (formData) => {
    try {
      const newCustomer = {
        ...formData,
        _id: crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).substring(2)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updatedCustomers = [newCustomer, ...customers];
      setCustomers(updatedCustomers);
      saveToLocalStorage(updatedCustomers);
      setShowForm(false);
      showSuccessMessage('Trade customer added successfully!');
    } catch (err) {
      console.error('Error creating trade customer:', err);
      throw err;
    }
  };

  const handleUpdateCustomer = (formData) => {
    try {
      const updatedCustomer = {
        ...editingCustomer,
        ...formData,
        updatedAt: new Date().toISOString()
      };
      const updatedCustomers = customers.map(customer => 
        customer._id === updatedCustomer._id ? updatedCustomer : customer
      );
      setCustomers(updatedCustomers);
      saveToLocalStorage(updatedCustomers);
      setEditingCustomer(null);
      setShowForm(false);
      showSuccessMessage('Trade customer updated successfully!');
    } catch (err) {
      console.error('Error updating trade customer:', err);
      throw err;
    }
  };

  const handleDeleteCustomer = (customerId) => {
    try {
      const updatedCustomers = customers.filter(customer => customer._id !== customerId);
      setCustomers(updatedCustomers);
      saveToLocalStorage(updatedCustomers);
      setDeleteConfirm(null);
      showSuccessMessage('Trade customer deleted successfully!');
    } catch (err) {
      setError(err.message);
      console.error('Error deleting trade customer:', err);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleCreateNew = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const confirmDelete = (customer) => {
    setDeleteConfirm(customer);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const getPriorityLabel = (priority) => {
    return priority === 'P1' ? 'P1 - Weekly' : 'P2 - Fortnightly';
  };

  const getPriorityBadgeClass = (priority) => {
    return priority === 'P1' ? 'priority-badge p1' : 'priority-badge p2';
  };

  if (loading) {
    return (
      <div className="trade-customers-manager">
        <div className="loading">Loading trade customers...</div>
      </div>
    );
  }

  return (
    <div className="trade-customers-manager">
      <div className="manager-header">
        <h1>Trade Customers</h1>
        {!showForm && (
          <button onClick={handleCreateNew} className="btn btn-primary">
            + Add Trade Customer
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
          <TradeCustomerForm
            onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
            onCancel={handleCancelForm}
            initialData={editingCustomer}
            mode={editingCustomer ? 'edit' : 'create'}
            allTradeCustomers={customers}
          />
        </div>
      )}

      {!showForm && (
        <div className="customers-list">
          {customers.length === 0 ? (
            <div className="empty-state">
              <p>No trade customers yet. Add your first one!</p>
            </div>
          ) : (
            <div className="customers-grid">
              {customers.map(customer => (
                <div key={customer._id} className="customer-card">
                  <div className="customer-header">
                    <div className="customer-name-group">
                      <h3>{customer.name}</h3>
                      <span className={getPriorityBadgeClass(customer.priority)}>
                        {getPriorityLabel(customer.priority)}
                      </span>
                    </div>
                    <div className="customer-actions">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="btn-icon btn-edit"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => confirmDelete(customer)}
                        className="btn-icon btn-delete"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                  <div className="customer-content">
                    <div className="customer-detail">
                      <strong>📍 Postcode Areas:</strong>
                      <div className="postcodes-display">
                        {customer.postcodes && customer.postcodes.length > 0 ? (
                          customer.postcodes.map((postcode, idx) => (
                            <span key={idx} className="postcode-badge">
                              {postcode}
                            </span>
                          ))
                        ) : (
                          <span className="no-postcodes">No postcodes assigned</span>
                        )}
                      </div>
                    </div>
                    {customer.notes && (
                      <div className="customer-notes">
                        <strong>📝 Notes:</strong>
                        <p>{customer.notes}</p>
                      </div>
                    )}
                    <div className="customer-meta">
                      <small>Added: {new Date(customer.createdAt).toLocaleDateString()}</small>
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
              Are you sure you want to delete the trade customer "<strong>{deleteConfirm.name}</strong>"?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCustomer(deleteConfirm._id)}
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

export default TradeCustomersManager;
