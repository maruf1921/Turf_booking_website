const express = require('express');
const BookingController = require('../controllers/bookingController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const PricingService = require('../services/pricingService');
const db = require('../database');

const router = express.Router();

// Public routes
router.get('/availability', BookingController.getAvailability);
router.get('/config', async (req, res) => {
    const turf = await PricingService.getTurfConfig();
    const blockedDates = await new Promise((resolve, reject) => {
        db.all(`SELECT * FROM blocked_dates ORDER BY date ASC`, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
    res.json({ turf, blockedDates });
});

// User routes
router.post('/', verifyToken, BookingController.createBooking);
router.get('/my-bookings', verifyToken, BookingController.getMyBookings);

// Admin routes
router.get('/all', verifyAdmin, BookingController.getAllBookings);
router.put('/:id/status', verifyAdmin, BookingController.updateStatus);
router.put('/:id/payment', verifyAdmin, BookingController.updatePayment);
router.get('/stats', verifyAdmin, BookingController.getStats);
router.get('/customers', verifyAdmin, BookingController.getCustomers);
router.put('/pricing', verifyAdmin, BookingController.updatePricing);
router.post('/block-date', verifyAdmin, BookingController.blockDate);
router.delete('/block-date/:id', verifyAdmin, BookingController.unblockDate);

module.exports = router;
