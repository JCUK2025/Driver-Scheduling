const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database Connection
const DB_URI = 'your_database_connection_string_here'; // Replace with your MongoDB connection string
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully!'))
    .catch(err => console.error('Database connection error:', err));

// Sample API Route
app.get('/api/drivers', (req, res) => {
    res.send('Drivers route');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});