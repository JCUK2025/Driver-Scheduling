import React, { useState, useEffect } from 'react';
import SchedulingGrid from './SchedulingGrid';
import DriversManager from './DriversManager';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { canHandleMultiDayDelivery, canHandleConsecutiveRoute } from '../utils/driverValidation';
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
    // Auto-planning algorithm with consecutive route support
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

    // Helper to group consecutive route areas
    const getConsecutiveRouteGroup = (area) => {
      if (!area.consecutiveWith) return [area];
      
      // Find all areas in this consecutive group
      const group = [];
      const visited = new Set();
      
      const collectGroup = (currentArea) => {
        if (visited.has(currentArea._id)) return;
        visited.add(currentArea._id);
        group.push(currentArea);
        
        // Find areas connected to this one
        sortedAreas.forEach(otherArea => {
          if (otherArea.consecutiveWith === currentArea._id || 
              currentArea.consecutiveWith === otherArea._id) {
            collectGroup(otherArea);
          }
        });
      };
      
      collectGroup(area);
      
      // Sort by routeOrder
      group.sort((a, b) => (a.routeOrder || 999) - (b.routeOrder || 999));
      
      return group;
    };

    // Helper to assign a consecutive route group
    const assignConsecutiveRoute = (routeGroup, targetWeek) => {
      const totalDays = routeGroup.reduce((sum, area) => sum + area.deliveryDays, 0);
      
      // Find drivers who can handle this consecutive route
      for (const driver of sortedDrivers) {
        if (driver.deliveryDayCapability < totalDays) continue;
        
        // Check if driver can handle multi-day and consecutive routes
        const requiredDays = [];
        let currentDayIndex = 0;
        
        // Try each possible start day
        for (let startDayIndex = 0; startDayIndex <= DAYS.length - totalDays; startDayIndex++) {
          // Build required days list
          requiredDays.length = 0;
          currentDayIndex = startDayIndex;
          
          for (let i = 0; i < totalDays; i++) {
            if (currentDayIndex + i < DAYS.length) {
              requiredDays.push(DAYS[currentDayIndex + i]);
            }
          }
          
          // Check if driver can handle this consecutive route
          if (!canHandleConsecutiveRoute(driver, totalDays, routeGroup, requiredDays)) {
            continue;
          }
          
          // Check if driver is available for all days
          if (!isDriverAvailable(driver._id, targetWeek, startDayIndex, totalDays)) {
            continue;
          }
          
          // Assign each area in the route consecutively
          let assignmentDayIndex = startDayIndex;
          let allAssigned = true;
          
          for (const area of routeGroup) {
            if (assignedAreas.has(area._id)) {
              allAssigned = false;
              break;
            }
            assignArea(area, driver._id, targetWeek, assignmentDayIndex);
            assignmentDayIndex += area.deliveryDays;
          }
          
          if (allAssigned) {
            return true; // Successfully assigned
          }
        }
      }
      
      return false; // Could not assign
    };

    // PASS 1: Assign P1 areas without consecutive routes to BOTH weeks
    sortedAreas
      .filter(a => a.priority === 1 && !a.consecutiveWith && (!a.weekAssignment || a.weekAssignment === null))
      .forEach(area => {
        // Find a suitable driver and day that works for BOTH weeks
        let assigned = false;

        for (const driver of sortedDrivers) {
          if (assigned) break;
          if (driver.deliveryDayCapability < area.deliveryDays) continue;
          
          // Check if driver can handle multi-day deliveries
          if (!canHandleMultiDayDelivery(driver, area.deliveryDays)) continue;

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

    // PASS 2: Assign Week 1 consecutive routes (e.g., Northwest England + North Wales)
    const week1ConsecutiveAreas = sortedAreas.filter(a => 
      a.weekAssignment === 1 && a.consecutiveWith
    );
    
    const week1RouteGroups = new Map();
    week1ConsecutiveAreas.forEach(area => {
      const group = getConsecutiveRouteGroup(area);
      const groupKey = group.map(a => a._id).sort().join('-');
      
      if (!week1RouteGroups.has(groupKey)) {
        week1RouteGroups.set(groupKey, group);
      }
    });
    
    week1RouteGroups.forEach(group => {
      assignConsecutiveRoute(group, 1);
    });

    // PASS 3: Assign Week 2 consecutive routes 
    // This includes extending existing P1 routes or new Week 2-only consecutive routes
    const week2ConsecutiveAreas = sortedAreas.filter(a => 
      a.weekAssignment === 2 && a.consecutiveWith
    );
    
    const week2RouteGroups = new Map();
    week2ConsecutiveAreas.forEach(area => {
      const group = getConsecutiveRouteGroup(area);
      const groupKey = group.map(a => a._id).sort().join('-');
      
      if (!week2RouteGroups.has(groupKey)) {
        week2RouteGroups.set(groupKey, group);
      }
    });
    
    week2RouteGroups.forEach(group => {
      assignConsecutiveRoute(group, 2);
    });

    // PASS 4: Assign remaining P2 areas (non-consecutive)
    // Use deterministic logic to balance workload between weeks
    let p2AreaIndex = 0;
    sortedAreas
      .filter(a => 
        a.priority === 2 && 
        !a.consecutiveWith && 
        !assignedAreas.has(a._id)
      )
      .forEach(area => {
        // P2 areas are delivered fortnightly, so pick one week
        // Respect weekAssignment if set, otherwise alternate
        let targetWeek;
        if (area.weekAssignment) {
          targetWeek = area.weekAssignment;
        } else {
          targetWeek = (p2AreaIndex % 2) + 1;
          p2AreaIndex++;
        }

        for (const driver of sortedDrivers) {
          if (assignedAreas.has(area._id)) break;
          if (driver.deliveryDayCapability < area.deliveryDays) continue;
          
          // Check if driver can handle multi-day deliveries
          if (!canHandleMultiDayDelivery(driver, area.deliveryDays)) continue;

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
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Driver Delivery Schedule', margin, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, margin, 27);

    let yPosition = 35;

    // Generate schedule for each week
    [1, 2].forEach((week, weekIndex) => {
      if (weekIndex > 0) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Week ${week}`, margin, yPosition);
      yPosition += 8;

      // Prepare table data
      const tableData = drivers.map(driver => {
        const row = [driver.name];
        
        DAYS.forEach(day => {
          const assignment = schedule.assignments.find(a => {
            if (a.driverId !== driver._id || a.week !== week) return false;
            const startIndex = DAYS.indexOf(a.startDay);
            const endIndex = DAYS.indexOf(a.endDay);
            const currentIndex = DAYS.indexOf(day);
            return currentIndex >= startIndex && currentIndex <= endIndex;
          });

          if (assignment) {
            const area = deliveryAreas.find(a => a._id === assignment.deliveryAreaId);
            if (area) {
              const startIndex = DAYS.indexOf(assignment.startDay);
              const currentIndex = DAYS.indexOf(day);
              if (currentIndex === startIndex) {
                row.push(`${area.name}\n(P${area.priority}, ${area.deliveryDays}d)`);
              } else {
                row.push('→');
              }
            } else {
              row.push('');
            }
          } else {
            row.push('');
          }
        });

        return row;
      });

      // Create table
      doc.autoTable({
        startY: yPosition,
        head: [['Driver', ...DAYS]],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [102, 126, 234],
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 3,
          minCellHeight: 12
        },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: 'bold' },
          1: { cellWidth: 'auto', halign: 'center' },
          2: { cellWidth: 'auto', halign: 'center' },
          3: { cellWidth: 'auto', halign: 'center' },
          4: { cellWidth: 'auto', halign: 'center' },
          5: { cellWidth: 'auto', halign: 'center' }
        },
        didParseCell: function(data) {
          // Color code cells based on delivery area
          if (data.section === 'body' && data.column.index > 0) {
            const cellText = data.cell.text[0];
            if (cellText && cellText !== '' && cellText !== '→') {
              // Find matching area for this cell
              const driver = drivers[data.row.index];
              const day = DAYS[data.column.index - 1];
              const assignment = schedule.assignments.find(a => {
                if (a.driverId !== driver._id || a.week !== week) return false;
                const startIndex = DAYS.indexOf(a.startDay);
                const currentIndex = DAYS.indexOf(day);
                return currentIndex === startIndex;
              });
              
              if (assignment) {
                const area = deliveryAreas.find(a => a._id === assignment.deliveryAreaId);
                if (area && area.colour) {
                  // Convert hex to RGB
                  const hex = area.colour.replace('#', '');
                  const r = parseInt(hex.substring(0, 2), 16);
                  const g = parseInt(hex.substring(2, 4), 16);
                  const b = parseInt(hex.substring(4, 6), 16);
                  data.cell.styles.fillColor = [r, g, b];
                  data.cell.styles.textColor = [255, 255, 255];
                  data.cell.styles.fontStyle = 'bold';
                }
              }
            } else if (cellText === '→') {
              data.cell.styles.fillColor = [240, 240, 240];
              data.cell.styles.halign = 'center';
              data.cell.styles.fontSize = 12;
            }
          }
        },
        margin: { left: margin, right: margin }
      });

      // Add unassigned areas list
      yPosition = doc.lastAutoTable.finalY + 10;
      
      const unassignedAreas = deliveryAreas.filter(area => {
        return !schedule.assignments.some(a => a.week === week && a.deliveryAreaId === area._id);
      });

      if (unassignedAreas.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Unassigned Areas:', margin, yPosition);
        yPosition += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        unassignedAreas.forEach(area => {
          doc.text(`• ${area.name} (P${area.priority}, ${area.deliveryDays} day${area.deliveryDays > 1 ? 's' : ''})`, margin + 5, yPosition);
          yPosition += 5;
        });
      }
    });

    // Add legend on last page
    yPosition = doc.lastAutoTable.finalY + 15;
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Legend:', margin, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('P1 = Priority 1 (Same day each week)', margin + 5, yPosition);
    yPosition += 5;
    doc.text('P2 = Priority 2 (Fortnightly delivery)', margin + 5, yPosition);
    yPosition += 5;
    doc.text('→ = Continuation of multi-day delivery', margin + 5, yPosition);
    yPosition += 5;
    doc.text('Xd = Number of days required for delivery', margin + 5, yPosition);

    // Save the PDF
    doc.save(`delivery-schedule-${new Date().toISOString().split('T')[0]}.pdf`);
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
