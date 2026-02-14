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

// Database Connection
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/driver-scheduling';
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✓ Database connected successfully!'))
    .catch(err => console.error('✗ Database connection error:', err));

// API Routes
app.use('/api', deliveryAreaRoutes);

// Fallback to index.html for client-side routing (React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✓ Server is running on http://localhost:${PORT}`);
    console.log(`✓ Ready to serve the Driver Scheduling App`);
});