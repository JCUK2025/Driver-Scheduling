import React, { useState } from 'react';
import './App.css';
import DeliveryAreasManager from './components/DeliveryAreasManager';
import TradeCustomersManager from './components/TradeCustomersManager';
import SchedulingManager from './components/SchedulingManager';

function App() {
  const [activeTab, setActiveTab] = useState('delivery-areas');

  return (
    <div className="App">
      <header className="App-header">
        <h1>🗺️ Driver Scheduling - Delivery Management</h1>
        <p>Manage delivery areas, trade customers, and schedules</p>
      </header>
      <nav className="App-nav">
        <button 
          className={`nav-tab ${activeTab === 'delivery-areas' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivery-areas')}
        >
          📦 Delivery Areas
        </button>
        <button 
          className={`nav-tab ${activeTab === 'trade-customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('trade-customers')}
        >
          👥 Customer Management
        </button>
        <button 
          className={`nav-tab ${activeTab === 'scheduling' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduling')}
        >
          📅 Scheduling
        </button>
      </nav>
      <main className="App-main">
        {activeTab === 'delivery-areas' && <DeliveryAreasManager />}
        {activeTab === 'trade-customers' && <TradeCustomersManager />}
        {activeTab === 'scheduling' && <SchedulingManager />}
      </main>
    </div>
  );
}

export default App;
