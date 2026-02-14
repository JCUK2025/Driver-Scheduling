const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const deliveryAreaRoutes = require('./src/routes/deliveryAreaRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection (optional for development)
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/driver-scheduling';

// Don't wait for connection - let it connect in background
mongoose.connect(DB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
}).catch(() => {}); // Suppress connection errors

// Handle Mongoose connection events
mongoose.connection.on('connected', () => {
    console.log('✓ Database connected successfully!');
});

mongoose.connection.on('error', (err) => {
    console.warn('⚠ Database connection failed:', err.message);
    console.warn('⚠ Using in-memory storage - data will not persist');
    console.warn('⚠ To fix: Install and start MongoDB, or set MONGODB_URI env variable');
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠ Database disconnected - using in-memory storage');
});

// API Routes
app.use('/api', deliveryAreaRoutes);

// Fallback to index.html for client-side routing (React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✓ Server is running on http://localhost:${PORT}`);
    console.log(`✓ Ready to serve the Driver Scheduling App`);
    if (mongoose.connection.readyState !== 1) {
        console.log('ℹ Using in-memory storage (MongoDB not connected)');
    }
});