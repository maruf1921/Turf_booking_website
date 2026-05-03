const express = require('express');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

const isPastDate = (dateStr) => {
    const today = new Date();
    const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    return dateStr < todayStr;
};

const getPrice = (db, date, slot, duration) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM turf_details LIMIT 1`, (err, turf) => {
            if (err || !turf) return resolve(2000); // fallback

            const d = new Date(date);
            const day = d.getDay();
            let basePrice = turf.day_price;
            
            if (day === 5) {
                basePrice = turf.friday_price; // Friday
            } else {
                const isPM = slot.includes('PM') && !slot.startsWith('12PM');
                let hour = parseInt(slot);
                if (isPM) hour += 12;
                if (hour >= 17) basePrice = turf.evening_price; // Evening
            }

            let finalPrice = duration === '3 hours' ? basePrice * 2 : basePrice;
            if (turf.discount_percentage > 0) {
                finalPrice = finalPrice - (finalPrice * (turf.discount_percentage / 100));
            }
            resolve(finalPrice);
        });
    });
};

// Availability
router.get('/availability', (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date required' });
    if (isPastDate(date)) return res.json({ availableSlots: [] });

    req.db.get(`SELECT * FROM blocked_dates WHERE date = ?`, [date], (err, row) => {
        if (row) return res.json({ availableSlots: [] });

        req.db.all(`SELECT slot FROM time_slots WHERE is_active = 1`, (err, allSlots) => {
            req.db.all(`SELECT time_slot FROM bookings WHERE date = ? AND status != 'cancelled' AND status != 'rejected'`, [date], (err, bookings) => {
                const bookedSlots = bookings.map(b => b.time_slot);
                let availableSlots = allSlots.filter(s => !bookedSlots.includes(s.slot)).map(s => s.slot);

                const today = new Date();
                const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
                if (date === todayStr) {
                    const currentHour = today.getHours();
                    availableSlots = availableSlots.filter(slot => {
                        const isPM = slot.includes('PM') && !slot.startsWith('12PM');
                        let startHour = parseInt(slot);
                        if (isPM) startHour += 12;
                        return startHour > currentHour;
                    });
                }
                res.json({ availableSlots });
            });
        });
    });
});

// Create booking
router.post('/', verifyToken, async (req, res) => {
    const { date, time_slot, duration, team_name, bkash_number } = req.body;
    const user_id = req.user.id;
    if (!date || !time_slot || !duration) return res.status(400).json({ error: 'Missing required fields' });

    req.db.get(`SELECT * FROM blocked_dates WHERE date = ?`, [date], (err, row) => {
        if (row) return res.status(400).json({ error: 'This date is blocked' });

        req.db.get(`SELECT * FROM bookings WHERE date = ? AND time_slot = ? AND status != 'cancelled' AND status != 'rejected'`, [date, time_slot], async (err, row) => {
            if (row) return res.status(400).json({ error: 'Slot booked' });
            
            const price = await getPrice(req.db, date, time_slot, duration);
            req.db.run(`INSERT INTO bookings (user_id, date, time_slot, duration, team_name, bkash_number, price) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [user_id, date, time_slot, duration, team_name, bkash_number || null, price], function(err) {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.status(201).json({ message: 'Booking successful', bookingId: this.lastID });
            });
        });
    });
});

// User bookings
router.get('/my-bookings', verifyToken, (req, res) => {
    req.db.all(`SELECT * FROM bookings WHERE user_id = ? ORDER BY date DESC`, [req.user.id], (err, rows) => res.json(rows || []));
});

router.put('/:id/cancel', verifyToken, (req, res) => {
    req.db.run(`UPDATE bookings SET status = 'cancelled' WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id], (err) => res.json({ message: 'Cancelled' }));
});

// Admin routes
router.get('/all', verifyAdmin, (req, res) => {
    req.db.all(`SELECT b.*, u.name, u.phone FROM bookings b JOIN users u ON b.user_id = u.id ORDER BY b.date DESC`, (err, rows) => res.json(rows || []));
});

router.put('/:id/status', verifyAdmin, (req, res) => {
    req.db.run(`UPDATE bookings SET status = ? WHERE id = ?`, [req.body.status, req.params.id], (err) => res.json({ message: 'Updated' }));
});

router.put('/:id/payment', verifyAdmin, (req, res) => {
    const { payment_status, payment_method } = req.body;
    req.db.run(`UPDATE bookings SET payment_status = ?, payment_method = ? WHERE id = ?`, [payment_status, payment_method || 'none', req.params.id], (err) => res.json({ message: 'Updated' }));
});

router.get('/stats', verifyAdmin, (req, res) => {
    const today = new Date();
    const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    
    req.db.get(`SELECT count(*) as todayBookings FROM bookings WHERE date = ? AND status != 'cancelled' AND status != 'rejected'`, [todayStr], (err, row1) => {
        req.db.get(`SELECT SUM(price) as rev FROM bookings WHERE payment_status = 'paid'`, (err, row2) => {
            res.json({ todayBookings: row1?.todayBookings || 0, revenue: row2?.rev || 0 });
        });
    });
});

router.get('/customers', verifyAdmin, (req, res) => {
    req.db.all(`SELECT id, name, phone, loyalty_points, (SELECT count(*) FROM bookings WHERE user_id = users.id) as total_bookings FROM users WHERE role = 'user'`, (err, rows) => res.json(rows || []));
});

// Public config
router.get('/config', (req, res) => {
    req.db.get(`SELECT * FROM turf_details LIMIT 1`, (err, turf) => {
        req.db.all(`SELECT * FROM blocked_dates ORDER BY date ASC`, (err, dates) => {
            res.json({ turf: turf || {}, blockedDates: dates || [] });
        });
    });
});

// Admin Slot Management

router.put('/pricing', verifyAdmin, (req, res) => {
    const { day_price, evening_price, friday_price, discount_percentage } = req.body;
    req.db.run(`UPDATE turf_details SET day_price = ?, evening_price = ?, friday_price = ?, discount_percentage = ? WHERE id = 1`,
    [day_price, evening_price, friday_price, discount_percentage], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Pricing updated' });
    });
});

router.post('/block-date', verifyAdmin, (req, res) => {
    const { date, reason } = req.body;
    req.db.run(`INSERT INTO blocked_dates (date, reason) VALUES (?, ?)`, [date, reason], (err) => {
        if (err) return res.status(500).json({ error: 'Database error or date already blocked' });
        res.json({ message: 'Date blocked' });
    });
});

router.delete('/block-date/:id', verifyAdmin, (req, res) => {
    req.db.run(`DELETE FROM blocked_dates WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Date unblocked' });
    });
});

module.exports = router;
