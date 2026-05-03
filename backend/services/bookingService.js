const db = require('../database');
const ApiError = require('../utils/ApiError');
const PricingService = require('./pricingService');

class BookingService {
    static async isDateBlocked(date) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM blocked_dates WHERE date = ?`, [date], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });
    }

    static async getAvailableSlots(date) {
        const isBlocked = await this.isDateBlocked(date);
        if (isBlocked) return [];

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        if (date < todayStr) return [];

        const allSlots = await new Promise((resolve, reject) => {
            db.all(`SELECT slot FROM time_slots WHERE is_active = 1`, (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(r => r.slot));
            });
        });

        const bookedSlots = await new Promise((resolve, reject) => {
            db.all(`SELECT time_slot FROM bookings WHERE date = ? AND status NOT IN ('cancelled', 'rejected')`, [date], (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(r => r.time_slot));
            });
        });

        let availableSlots = allSlots.filter(s => !bookedSlots.includes(s));

        if (date === todayStr) {
            const currentHour = today.getHours();
            availableSlots = availableSlots.filter(slot => {
                const isPM = slot.includes('PM') && !slot.startsWith('12PM');
                let startHour = parseInt(slot);
                if (isPM) startHour += 12;
                return startHour > currentHour;
            });
        }

        return availableSlots;
    }

    static async createBooking(bookingData) {
        const { user_id, date, time_slot, duration, team_name, bkash_number } = bookingData;

        const isBlocked = await this.isDateBlocked(date);
        if (isBlocked) throw new ApiError(400, 'This date is blocked');

        const price = await PricingService.calculatePrice(date, time_slot, duration);

        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO bookings (user_id, date, time_slot, duration, team_name, bkash_number, price) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user_id, date, time_slot, duration, team_name, bkash_number, price],
                function(err) {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            return reject(new ApiError(400, 'This slot is already booked'));
                        }
                        return reject(err);
                    }
                    resolve({ id: this.lastID, price });
                }
            );
        });
    }

    static async getUserBookings(userId) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM bookings WHERE user_id = ? ORDER BY date DESC`, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async getAllBookings() {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT b.*, u.name, u.phone FROM bookings b JOIN users u ON b.user_id = u.id ORDER BY b.date DESC`,
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                }
            );
        });
    }

    static async updateBookingStatus(id, status) {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE bookings SET status = ? WHERE id = ?`, [status, id], function(err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    static async updatePayment(id, payment_status, payment_method) {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE bookings SET payment_status = ?, payment_method = ? WHERE id = ?`, [payment_status, payment_method, id], function(err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    static async getStats() {
        const todayStr = new Date().toISOString().split('T')[0];
        
        const todayBookings = await new Promise((resolve, reject) => {
            db.get(`SELECT count(*) as count FROM bookings WHERE date = ? AND status NOT IN ('cancelled', 'rejected')`, [todayStr], (err, row) => {
                if (err) return reject(err);
                resolve(row?.count || 0);
            });
        });

        const revenue = await new Promise((resolve, reject) => {
            db.get(`SELECT SUM(price) as rev FROM bookings WHERE payment_status = 'paid'`, (err, row) => {
                if (err) return reject(err);
                resolve(row?.rev || 0);
            });
        });

        return { todayBookings, revenue };
    }

    static async getCustomers() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT id, name, phone, loyalty_points, (SELECT count(*) FROM bookings WHERE user_id = users.id) as total_bookings FROM users WHERE role = 'user'`, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async updatePricing(pricing) {
        const { day_price, evening_price, friday_price, discount_percentage } = pricing;
        return new Promise((resolve, reject) => {
            db.run(`UPDATE turf_details SET day_price = ?, evening_price = ?, friday_price = ?, discount_percentage = ? WHERE id = 1`,
            [day_price, evening_price, friday_price, discount_percentage], function(err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    static async blockDate(date, reason) {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO blocked_dates (date, reason) VALUES (?, ?)`, [date, reason], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return reject(new ApiError(400, 'Date already blocked'));
                    }
                    return reject(err);
                }
                resolve();
            });
        });
    }

    static async unblockDate(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM blocked_dates WHERE id = ?`, [id], function(err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports = BookingService;
