import React from 'react';
import './App.css';
import DeliveryAreasManager from './components/DeliveryAreasManager';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🗺️ Driver Scheduling - Delivery Areas Management</h1>
        <p>Manage delivery areas with interactive UK postcode map</p>
      </header>
      <main className="App-main">
        <DeliveryAreasManager />
      </main>
    </div>
  );
}

export default App;
