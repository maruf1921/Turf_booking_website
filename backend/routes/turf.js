const express = require('express');
const { verifyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Get turf details
router.get('/', (req, res) => {
    req.db.get(`SELECT * FROM turf_details LIMIT 1`, (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(404).json({ error: 'Turf not found' });
        try {
            row.facilities = JSON.parse(row.facilities);
        } catch (e) {
            row.facilities = [];
        }
        res.json(row);
    });
});

// Admin: Update turf details
router.put('/', verifyAdmin, (req, res) => {
    const { name, location, price_per_hour, facilities } = req.body;
    
    req.db.run(`
        UPDATE turf_details 
        SET name = ?, location = ?, price_per_hour = ?, facilities = ?
        WHERE id = (SELECT id FROM turf_details LIMIT 1)
    `, [name, location, price_per_hour, JSON.stringify(facilities)], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Turf details updated' });
    });
});

module.exports = router;
