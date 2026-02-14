const express = require('express');
const mongoose = require('mongoose');
const deliveryAreaRoutes = require('./src/routes/deliveryAreaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database Connection
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/driver-scheduling';
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully!'))
    .catch(err => console.error('Database connection error:', err));

// API Routes
app.get('/api/drivers', (req, res) => {
    res.send('Drivers route');
});

// Delivery Area Routes
app.use('/api', deliveryAreaRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});