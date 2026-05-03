const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'turf.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            phone TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'user',
            loyalty_points INTEGER DEFAULT 0
        )`, async (err) => {
            if (!err) {
                // Default admin
                db.get(`SELECT * FROM users WHERE role = 'admin'`, async (err, row) => {
                    if (!row) {
                        const hashed = await bcrypt.hash('admin123', 10);
                        db.run(`INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)`, ['Admin', '01000000000', hashed, 'admin']);
                    }
                });
            }
        });

        // Turf Details
        db.run(`CREATE TABLE IF NOT EXISTS turf_details (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            location TEXT,
            day_price REAL DEFAULT 2000,
            evening_price REAL DEFAULT 3000,
            friday_price REAL DEFAULT 3500,
            discount_percentage REAL DEFAULT 0,
            facilities TEXT
        )`, (err) => {
            if (!err) {
                db.get(`SELECT count(*) as count FROM turf_details`, (err, row) => {
                    if (row && row.count === 0) {
                        db.run(`INSERT INTO turf_details (name, location, facilities) VALUES (?, ?, ?)`,
                        ['Demra Turf Ground', 'Demra, Signboard, Dhaka', JSON.stringify(['LED Floodlights', 'Changing Room', 'Washroom', 'Parking Area'])]);
                    }
                });
            }
        });

        // Bookings
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            date TEXT,
            time_slot TEXT,
            duration TEXT,
            team_name TEXT,
            status TEXT DEFAULT 'pending',
            payment_status TEXT DEFAULT 'pending',
            payment_method TEXT DEFAULT 'none',
            bkash_number TEXT,
            price REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            UNIQUE(date, time_slot)
        )`);

        // Blocked Dates
        db.run(`CREATE TABLE IF NOT EXISTS blocked_dates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT UNIQUE,
            reason TEXT
        )`);

        // Time slots
        db.run(`CREATE TABLE IF NOT EXISTS time_slots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slot TEXT,
            is_active INTEGER DEFAULT 1
        )`, (err) => {
            if (!err) {
                db.get(`SELECT count(*) as count FROM time_slots`, (err, row) => {
                    if (row && row.count === 0) {
                        const defaultSlots = [
                            '7AM', '9AM', '11AM', '1PM', '3PM', '5PM', '7PM', '9PM'
                        ];
                        const stmt = db.prepare(`INSERT INTO time_slots (slot) VALUES (?)`);
                        defaultSlots.forEach(s => stmt.run(s));
                        stmt.finalize();
                    }
                });
            }
        });
    }
});

console.log('Database instance created.');
module.exports = db;
