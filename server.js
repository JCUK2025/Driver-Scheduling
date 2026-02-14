const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());

// Middleware for parsing JSON bodies
app.use(express.json());

// MongoDB connection with error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/driver-scheduling';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✓ Connected to MongoDB successfully');
})
.catch((err) => {
    const sanitizedUri = MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.warn('⚠ Database connection failed:', err.message);
    console.warn(`⚠ Attempted to connect to: ${sanitizedUri}`);
    console.warn('⚠ Running without database - API operations will use in-memory storage');
});

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

// Define API routes
app.use('/api', require('./src/routes/deliveryAreaRoutes'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// The "catchall" handler: for any request that doesn't match one above, send back index.html.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✓ Server is running on port ${PORT}`);
    console.log(`✓ Open http://localhost:${PORT} in your browser`);
});