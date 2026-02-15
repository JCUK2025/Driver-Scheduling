import React, { useState, useEffect } from 'react';
import { canHandleMultiDayDelivery, AUTHORIZED_MULTI_DAY_DRIVERS } from '../utils/driverValidation';
import './SchedulingGrid.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const WEEKS = [1, 2];

const SchedulingGrid = ({ drivers, deliveryAreas, schedule, onScheduleChange }) => {
  const [draggedArea, setDraggedArea] = useState(null);
  const [assignments, setAssignments] = useState(schedule?.assignments || []);

  useEffect(() => {
    if (schedule?.assignments) {
      setAssignments(schedule.assignments);
    }
  }, [schedule]);

  const handleDragStart = (e, area) => {
    setDraggedArea(area);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, driverId, day, week) => {
    e.preventDefault();
    
    if (!draggedArea) return;

    const driver = drivers.find(d => d._id === driverId);
    if (!driver) return;

    // Check if driver is available on this day
    if (!driver.availableDays.includes(day)) {
      alert(`${driver.name} is not available on ${day}`);
      setDraggedArea(null);
      return;
    }

    // Check if driver can handle this delivery area's duration
    if (driver.deliveryDayCapability < draggedArea.deliveryDays) {
      alert(`${driver.name} can only handle ${driver.deliveryDayCapability}-day deliveries, but ${draggedArea.name} requires ${draggedArea.deliveryDays} days`);
      setDraggedArea(null);
      return;
    }

    // Check if driver can handle multi-day deliveries
    if (!canHandleMultiDayDelivery(driver, draggedArea.deliveryDays)) {
      const authorizedDriverNames = AUTHORIZED_MULTI_DAY_DRIVERS.join(' and ');
      alert(`Only ${authorizedDriverNames} can handle ${draggedArea.deliveryDays}-day deliveries.`);
      setDraggedArea(null);
      return;
    }

    // For multi-day deliveries, ensure there are enough days remaining
    const dayIndex = DAYS.indexOf(day);
    const daysRemaining = DAYS.length - dayIndex;
    if (draggedArea.deliveryDays > daysRemaining) {
      alert(`Not enough days remaining in the week to schedule a ${draggedArea.deliveryDays}-day delivery starting on ${day}`);
      setDraggedArea(null);
      return;
    }

    // Remove any existing assignment for this delivery area in this week
    const filteredAssignments = assignments.filter(
      a => !(a.deliveryAreaId === draggedArea._id && a.week === week)
    );

    // Calculate start and end days for multi-day deliveries
    const endDayIndex = dayIndex + draggedArea.deliveryDays - 1;
    const endDay = DAYS[endDayIndex];

    // Create new assignment
    const newAssignment = {
      driverId,
      deliveryAreaId: draggedArea._id,
      week,
      day,
      startDay: day,
      endDay: endDay,
      deliveryDays: draggedArea.deliveryDays
    };

    const updatedAssignments = [...filteredAssignments, newAssignment];
    setAssignments(updatedAssignments);
    onScheduleChange(updatedAssignments);
    setDraggedArea(null);
  };

  const handleRemoveAssignment = (assignment) => {
    const updatedAssignments = assignments.filter(a => 
      !(a.driverId === assignment.driverId && 
        a.deliveryAreaId === assignment.deliveryAreaId && 
        a.week === assignment.week)
    );
    setAssignments(updatedAssignments);
    onScheduleChange(updatedAssignments);
  };

  const getAssignmentsForCell = (driverId, day, week) => {
    return assignments.filter(a => {
      if (a.driverId !== driverId || a.week !== week) return false;
      
      // For multi-day deliveries, check if this day is within the range
      const startIndex = DAYS.indexOf(a.startDay);
      const endIndex = DAYS.indexOf(a.endDay);
      const currentIndex = DAYS.indexOf(day);
      
      return currentIndex >= startIndex && currentIndex <= endIndex;
    });
  };

  const getCellClass = (driverId, day, week, cellAssignments) => {
    if (cellAssignments.length === 0) return '';
    
    const assignment = cellAssignments[0];
    const startIndex = DAYS.indexOf(assignment.startDay);
    const currentIndex = DAYS.indexOf(day);
    
    if (currentIndex === startIndex) {
      return 'assignment-start';
    } else {
      return 'assignment-continue';
    }
  };

  const renderAssignmentCell = (assignment, driverId, day, week) => {
    const area = deliveryAreas.find(a => a._id === assignment.deliveryAreaId);
    if (!area) return null;

    const startIndex = DAYS.indexOf(assignment.startDay);
    const currentIndex = DAYS.indexOf(day);
    
    // Only show the full card on the start day
    if (currentIndex !== startIndex) {
      return null;
    }

    return (
      <div 
        className="assignment-card"
        style={{ 
          backgroundColor: area.colour
        }}
      >
        <div className="assignment-content">
          <span className="assignment-name">{area.name}</span>
          <button
            className="remove-assignment"
            onClick={() => handleRemoveAssignment(assignment)}
            title="Remove assignment"
          >
            ×
          </button>
        </div>
        <div className="assignment-info">
          {assignment.deliveryDays > 1 && (
            <small>{assignment.deliveryDays} days</small>
          )}
        </div>
      </div>
    );
  };

  const getUnassignedAreas = (week) => {
    const assignedAreaIds = new Set(
      assignments
        .filter(a => a.week === week)
        .map(a => a.deliveryAreaId)
    );
    return deliveryAreas.filter(area => !assignedAreaIds.has(area._id));
  };

  return (
    <div className="scheduling-grid-container">
      {WEEKS.map(week => (
        <div key={week} className="week-section">
          <h2 className="week-title">Week {week}</h2>
          
          <div className="grid-wrapper">
            <table className="scheduling-grid">
              <thead>
                <tr>
                  <th className="driver-column">Driver</th>
                  {DAYS.map(day => (
                    <th key={day} className="day-column">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drivers.map(driver => {
                  // Track which day indices to skip for this row
                  const skipDays = new Set();
                  
                  return (
                    <tr key={driver._id}>
                      <td className="driver-cell">
                        <div className="driver-info">
                          <span className="driver-name">{driver.name}</span>
                          <span className={`driver-priority priority-${driver.priority.toLowerCase()}`}>
                            {driver.priority}
                          </span>
                        </div>
                      </td>
                      {DAYS.map((day, dayIndex) => {
                        // Skip cells that are part of a multi-day assignment
                        if (skipDays.has(dayIndex)) {
                          return null;
                        }
                        
                        const cellAssignments = getAssignmentsForCell(driver._id, day, week);
                        const cellClass = getCellClass(driver._id, day, week, cellAssignments);
                        const isAvailable = driver.availableDays.includes(day);
                        
                        // Calculate colspan for multi-day assignments
                        let colspan = 1;
                        if (cellAssignments.length > 0) {
                          const assignment = cellAssignments[0];
                          const startIndex = DAYS.indexOf(assignment.startDay);
                          
                          // Only apply colspan on the starting day (and validate startDay is valid)
                          if (startIndex >= 0 && dayIndex === startIndex) {
                            colspan = assignment.deliveryDays;
                            
                            // Mark subsequent days as skip
                            for (let i = 1; i < assignment.deliveryDays; i++) {
                              skipDays.add(dayIndex + i);
                            }
                          }
                        }
                        
                        return (
                          <td
                            key={day}
                            colSpan={colspan}
                            className={`schedule-cell ${cellClass} ${!isAvailable ? 'unavailable' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, driver._id, day, week)}
                          >
                            {cellAssignments.length > 0 && renderAssignmentCell(cellAssignments[0], driver._id, day, week)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="unassigned-areas">
            <h3>Unassigned Areas (Week {week})</h3>
            <div className="areas-list">
              {getUnassignedAreas(week).map(area => (
                <div
                  key={area._id}
                  className="area-badge"
                  style={{ backgroundColor: area.colour }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, area)}
                >
                  <span className="area-name">{area.name}</span>
                  <span className="area-days">{area.deliveryDays}d</span>
                  <span className="area-priority">P{area.priority}</span>
                </div>
              ))}
              {getUnassignedAreas(week).length === 0 && (
                <p className="no-areas">All areas assigned for this week</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchedulingGrid;
