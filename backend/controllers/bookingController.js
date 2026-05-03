const BookingService = require('../services/bookingService');
const ApiError = require('../utils/ApiError');

class BookingController {
    static async getAvailability(req, res) {
        const { date } = req.query;
        if (!date) throw new ApiError(400, 'Date required');
        
        const availableSlots = await BookingService.getAvailableSlots(date);
        res.json({ availableSlots });
    }

    static async createBooking(req, res) {
        const { date, time_slot, duration, team_name, bkash_number } = req.body;
        if (!date || !time_slot || !duration) {
            throw new ApiError(400, 'Missing required fields');
        }

        const booking = await BookingService.createBooking({
            user_id: req.user.id,
            date,
            time_slot,
            duration,
            team_name,
            bkash_number
        });

        res.status(201).json({
            status: 'success',
            message: 'Booking successful',
            data: booking
        });
    }

    static async getMyBookings(req, res) {
        const bookings = await BookingService.getUserBookings(req.user.id);
        res.json(bookings);
    }

    static async getAllBookings(req, res) {
        const bookings = await BookingService.getAllBookings();
        res.json(bookings);
    }

    static async updateStatus(req, res) {
        const { status } = req.body;
        await BookingService.updateBookingStatus(req.params.id, status);
        res.json({ message: 'Status updated' });
    }

    static async updatePayment(req, res) {
        const { payment_status, payment_method } = req.body;
        await BookingService.updatePayment(req.params.id, payment_status, payment_method);
        res.json({ message: 'Payment updated' });
    }

    static async getStats(req, res) {
        const stats = await BookingService.getStats();
        res.json(stats);
    }

    static async getCustomers(req, res) {
        const customers = await BookingService.getCustomers();
        res.json(customers);
    }

    static async updatePricing(req, res) {
        await BookingService.updatePricing(req.body);
        res.json({ message: 'Pricing updated' });
    }

    static async blockDate(req, res) {
        const { date, reason } = req.body;
        await BookingService.blockDate(date, reason);
        res.json({ message: 'Date blocked' });
    }

    static async unblockDate(req, res) {
        await BookingService.unblockDate(req.params.id);
        res.json({ message: 'Date unblocked' });
    }
}

module.exports = BookingController;
