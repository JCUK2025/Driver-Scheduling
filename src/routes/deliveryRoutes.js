const express = require('express');
const router = express.Router();

// Mock Data for Delivery Groups
let deliveryGroups = [];

// Create a Delivery Group
router.post('/deliveryGroups', (req, res) => {
    const newGroup = req.body;
    deliveryGroups.push(newGroup);
    res.status(201).send(newGroup);
});

// Get all Delivery Groups
router.get('/deliveryGroups', (req, res) => {
    res.send(deliveryGroups);
});

// Get a Delivery Group by ID
router.get('/deliveryGroups/:id', (req, res) => {
    const group = deliveryGroups.find(g => g.id === req.params.id);
    if (!group) return res.status(404).send('Group not found');
    res.send(group);
});

// Update a Delivery Group
router.put('/deliveryGroups/:id', (req, res) => {
    const groupIndex = deliveryGroups.findIndex(g => g.id === req.params.id);
    if (groupIndex === -1) return res.status(404).send('Group not found');
    deliveryGroups[groupIndex] = req.body;
    res.send(deliveryGroups[groupIndex]);
});

// Delete a Delivery Group
router.delete('/deliveryGroups/:id', (req, res) => {
    const groupIndex = deliveryGroups.findIndex(g => g.id === req.params.id);
    if (groupIndex === -1) return res.status(404).send('Group not found');
    const deletedGroup = deliveryGroups.splice(groupIndex, 1);
    res.send(deletedGroup);
});

// Export Delivery Groups
router.get('/deliveryGroups/export', (req, res) => {
    const csvData = deliveryGroups.map(g => `${g.id},${g.name},${g.description}`).join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment('deliveryGroups.csv');
    res.send(csvData);
});

// Import Delivery Groups
router.post('/deliveryGroups/import', (req, res) => {
    const importedGroups = req.body;
    deliveryGroups = [...deliveryGroups, ...importedGroups];
    res.status(200).send(deliveryGroups);
});

module.exports = router;