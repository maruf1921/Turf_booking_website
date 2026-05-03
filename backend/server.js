const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./database');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Make db available in routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/turf', require('./routes/turf'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
