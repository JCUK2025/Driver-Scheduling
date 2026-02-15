import React, { useState, useEffect } from 'react';
import SchedulingGrid from './SchedulingGrid';
import DriversManager from './DriversManager';
import './SchedulingManager.css';

const STORAGE_KEYS = {
  drivers: 'drivers',
  deliveryAreas: 'deliveryAreas',
  schedule: 'schedule'
};

const SchedulingManager = () => {
  const [activeView, setActiveView] = useState('schedule'); // 'schedule' or 'drivers'
  const [drivers, setDrivers] = useState([]);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [schedule, setSchedule] = useState({ assignments: [] });
  const [showPlanDialog, setShowPlanDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load drivers
    const driversData = localStorage.getItem(STORAGE_KEYS.drivers);
    if (driversData) {
      try {
        setDrivers(JSON.parse(driversData));
      } catch (e) {
        console.error('Error loading drivers:', e);
      }
    }

    // Load delivery areas
    const areasData = localStorage.getItem(STORAGE_KEYS.deliveryAreas);
    if (areasData) {
      try {
        setDeliveryAreas(JSON.parse(areasData));
      } catch (e) {
        console.error('Error loading delivery areas:', e);
      }
    }

    // Load schedule
    const scheduleData = localStorage.getItem(STORAGE_KEYS.schedule);
    if (scheduleData) {
      try {
        setSchedule(JSON.parse(scheduleData));
      } catch (e) {
        console.error('Error loading schedule:', e);
      }
    }
  };

  const handleScheduleChange = (assignments) => {
    const updatedSchedule = {
      ...schedule,
      assignments,
      updatedAt: new Date().toISOString()
    };
    setSchedule(updatedSchedule);
    localStorage.setItem(STORAGE_KEYS.schedule, JSON.stringify(updatedSchedule));
  };

  const handlePlanSchedules = () => {
    setShowPlanDialog(true);
  };

  const executePlanning = () => {
    // Auto-planning algorithm
    const newAssignments = [];
    
    // Sort drivers: P1 first, then by delivery day capability (higher first)
    const sortedDrivers = [...drivers].sort((a, b) => {
      if (a.priority === 'P1' && b.priority === 'P2') return -1;
      if (a.priority === 'P2' && b.priority === 'P1') return 1;
      return b.deliveryDayCapability - a.deliveryDayCapability;
    });

    // Sort delivery areas: P1 first, then by delivery days (longer first for better placement)
    const sortedAreas = [...deliveryAreas].sort((a, b) => {
      if (a.priority === 1 && b.priority === 2) return -1;
      if (a.priority === 2 && b.priority === 1) return 1;
      return b.deliveryDays - a.deliveryDays;
    });

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Track what's been assigned
    const assignedAreas = new Set();
    const driverSchedule = {}; // driverId -> week -> day -> assigned area

    // Initialize driver schedule tracking
    sortedDrivers.forEach(driver => {
      driverSchedule[driver._id] = {
        1: {},
        2: {}
      };
      DAYS.forEach(day => {
        driverSchedule[driver._id][1][day] = null;
        driverSchedule[driver._id][2][day] = null;
      });
    });

    // Helper to check if driver is available for a range of days
    const isDriverAvailable = (driverId, week, startDayIndex, numDays) => {
      for (let i = 0; i < numDays; i++) {
        const dayIndex = startDayIndex + i;
        if (dayIndex >= DAYS.length) return false;
        
        const day = DAYS[dayIndex];
        const driver = drivers.find(d => d._id === driverId);
        
        if (!driver.availableDays.includes(day)) return false;
        if (driverSchedule[driverId][week][day] !== null) return false;
      }
      return true;
    };

    // Helper to assign an area to a driver
    const assignArea = (area, driverId, week, startDayIndex) => {
      const startDay = DAYS[startDayIndex];
      const endDayIndex = startDayIndex + area.deliveryDays - 1;
      const endDay = DAYS[endDayIndex];

      newAssignments.push({
        driverId,
        deliveryAreaId: area._id,
        week,
        day: startDay,
        startDay,
        endDay,
        deliveryDays: area.deliveryDays
      });

      // Mark days as occupied
      for (let i = 0; i < area.deliveryDays; i++) {
        const day = DAYS[startDayIndex + i];
        driverSchedule[driverId][week][day] = area._id;
      }

      assignedAreas.add(area._id);
    };

    // First pass: Assign P1 areas to both weeks (same day each week)
    sortedAreas.filter(a => a.priority === 1).forEach(area => {
      // Find a suitable driver and day that works for BOTH weeks
      let assigned = false;

      for (const driver of sortedDrivers) {
        if (assigned) break;
        if (driver.deliveryDayCapability < area.deliveryDays) continue;

        // Try each day
        for (let dayIndex = 0; dayIndex <= DAYS.length - area.deliveryDays; dayIndex++) {
          // For 3-day deliveries, must start by Wednesday
          if (area.deliveryDays === 3 && dayIndex > 2) break;

          // Check if available in BOTH weeks
          if (isDriverAvailable(driver._id, 1, dayIndex, area.deliveryDays) &&
              isDriverAvailable(driver._id, 2, dayIndex, area.deliveryDays)) {
            // Assign to both weeks
            assignArea(area, driver._id, 1, dayIndex);
            assignArea(area, driver._id, 2, dayIndex);
            assigned = true;
            break;
          }
        }
      }
    });

    // Second pass: Assign P2 areas (can vary between weeks, fortnightly)
    sortedAreas.filter(a => a.priority === 2).forEach(area => {
      if (assignedAreas.has(area._id)) return;

      // P2 areas are delivered fortnightly, so pick one week
      const targetWeek = (Math.random() > 0.5) ? 1 : 2; // Could use more logic here

      for (const driver of sortedDrivers) {
        if (assignedAreas.has(area._id)) break;
        if (driver.deliveryDayCapability < area.deliveryDays) continue;

        for (let dayIndex = 0; dayIndex <= DAYS.length - area.deliveryDays; dayIndex++) {
          // For 3-day deliveries, must start by Wednesday
          if (area.deliveryDays === 3 && dayIndex > 2) break;

          if (isDriverAvailable(driver._id, targetWeek, dayIndex, area.deliveryDays)) {
            assignArea(area, driver._id, targetWeek, dayIndex);
            break;
          }
        }
      }
    });

    // Update the schedule
    handleScheduleChange(newAssignments);
    setShowPlanDialog(false);
  };

  const handleClearSchedule = () => {
    if (window.confirm('Are you sure you want to clear the entire schedule?')) {
      handleScheduleChange([]);
    }
  };

  const handleGeneratePDF = async () => {
    // We'll implement PDF generation using jsPDF
    alert('PDF generation will be implemented in the next phase. For now, you can use your browser\'s print functionality (Ctrl+P or Cmd+P) to save as PDF.');
    window.print();
  };

  // Reload data when switching views to pick up any changes
  useEffect(() => {
    loadData();
  }, [activeView]);

  return (
    <div className="scheduling-manager">
      <div className="manager-header">
        <h1>📅 Scheduling Management</h1>
        <div className="header-actions">
          <button
            className={`view-toggle ${activeView === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveView('schedule')}
          >
            📅 View Schedule
          </button>
          <button
            className={`view-toggle ${activeView === 'drivers' ? 'active' : ''}`}
            onClick={() => setActiveView('drivers')}
          >
            👤 Manage Drivers
          </button>
        </div>
      </div>

      {activeView === 'drivers' && <DriversManager />}

      {activeView === 'schedule' && (
        <>
          <div className="schedule-toolbar">
            <div className="toolbar-left">
              <button 
                onClick={handlePlanSchedules} 
                className="btn btn-primary"
                disabled={drivers.length === 0 || deliveryAreas.length === 0}
              >
                🤖 Auto-Plan Schedules
              </button>
              <button 
                onClick={handleClearSchedule} 
                className="btn btn-secondary"
                disabled={schedule.assignments.length === 0}
              >
                🗑️ Clear Schedule
              </button>
            </div>
            <div className="toolbar-right">
              <button 
                onClick={handleGeneratePDF} 
                className="btn btn-success"
                disabled={schedule.assignments.length === 0}
              >
                📄 Generate PDF
              </button>
            </div>
          </div>

          {drivers.length === 0 || deliveryAreas.length === 0 ? (
            <div className="empty-state">
              <h3>Setup Required</h3>
              <p>
                {drivers.length === 0 && 'Please add drivers first. '}
                {deliveryAreas.length === 0 && 'Please add delivery areas first. '}
              </p>
              <p>
                {drivers.length === 0 && (
                  <button 
                    onClick={() => setActiveView('drivers')} 
                    className="btn btn-primary"
                  >
                    Add Drivers
                  </button>
                )}
              </p>
            </div>
          ) : (
            <>
              <div className="schedule-info">
                <div className="info-card">
                  <strong>Drivers:</strong> {drivers.length}
                </div>
                <div className="info-card">
                  <strong>Delivery Areas:</strong> {deliveryAreas.length}
                </div>
                <div className="info-card">
                  <strong>Assignments:</strong> {schedule.assignments.length}
                </div>
              </div>

              <SchedulingGrid
                drivers={drivers}
                deliveryAreas={deliveryAreas}
                schedule={schedule}
                onScheduleChange={handleScheduleChange}
              />
            </>
          )}
        </>
      )}

      {showPlanDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Auto-Plan Schedules</h3>
            <p>
              This will automatically plan delivery schedules based on:
            </p>
            <ul>
              <li>Driver priorities (P1 drivers scheduled first)</li>
              <li>Driver capabilities and availability</li>
              <li>Delivery area priorities (P1 areas same day each week)</li>
              <li>Multi-day delivery constraints</li>
            </ul>
            <p className="warning">
              ⚠️ This will replace any existing schedule assignments.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowPlanDialog(false)} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={executePlanning} 
                className="btn btn-primary"
              >
                Plan Schedules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingManager;
