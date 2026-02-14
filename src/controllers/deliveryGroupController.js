const fs = require('fs');
const path = require('path');

let deliveryGroups = [];

// Create a new delivery group
const createDeliveryGroup = (group) => {
    deliveryGroups.push(group);
    return group;
};

// Read all delivery groups
const getDeliveryGroups = () => {
    return deliveryGroups;
};

// Update an existing delivery group
const updateDeliveryGroup = (id, updatedGroup) => {
    const index = deliveryGroups.findIndex(group => group.id === id);
    if (index !== -1) {
        deliveryGroups[index] = { ...deliveryGroups[index], ...updatedGroup };
        return deliveryGroups[index];
    }
    return null;
};

// Delete a delivery group
const deleteDeliveryGroup = (id) => {
    const index = deliveryGroups.findIndex(group => group.id === id);
    if (index !== -1) {
        return deliveryGroups.splice(index, 1);
    }
    return null;
};

// Export delivery groups to CSV
const exportToCSV = () => {
    const csv = deliveryGroups.map(group => Object.values(group).join(',')).join('\n');
    fs.writeFileSync(path.join(__dirname, 'deliveryGroups.csv'), csv);
};

// Export delivery groups to JSON
const exportToJSON = () => {
    fs.writeFileSync(path.join(__dirname, 'deliveryGroups.json'), JSON.stringify(deliveryGroups));
};

// Import delivery groups from CSV
const importFromCSV = () => {
    const csvData = fs.readFileSync(path.join(__dirname, 'deliveryGroups.csv'), 'utf8');
    const lines = csvData.split('\n');
    lines.forEach(line => {
        const values = line.split(',');
        deliveryGroups.push({ id: values[0], name: values[1], ... }); // Adjust parsing as needed
    });
};

// Import delivery groups from JSON
const importFromJSON = () => {
    const jsonData = fs.readFileSync(path.join(__dirname, 'deliveryGroups.json'), 'utf8');
    deliveryGroups = JSON.parse(jsonData);
};

module.exports = {
    createDeliveryGroup,
    getDeliveryGroups,
    updateDeliveryGroup,
    deleteDeliveryGroup,
    exportToCSV,
    exportToJSON,
    importFromCSV,
    importFromJSON
};