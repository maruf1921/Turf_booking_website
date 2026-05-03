const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

router.post('/signup', async (req, res) => {
    const { name, phone, password, otp } = req.body;
    if (!name || !phone || !password || !otp) return res.status(400).json({ error: 'All fields required including OTP' });

    if (otp !== '1234') { // Mock OTP
        return res.status(400).json({ error: 'Invalid OTP. Use 1234 for testing.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        req.db.run(`INSERT INTO users (name, phone, password) VALUES (?, ?, ?)`, [name, phone, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Phone number already registered' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'User created successfully', userId: this.lastID });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', (req, res) => {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ error: 'Phone and password required' });

    req.db.get(`SELECT * FROM users WHERE phone = ?`, [phone], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, role: user.role, loyalty_points: user.loyalty_points } });
    });
});

module.exports = router;
