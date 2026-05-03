const db = require('../database');
console.log('AuthService: db imported', !!db);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

class AuthService {
    static async signup(userData) {
        const { name, phone, password } = userData;
        
        const hashedPassword = await bcrypt.hash(password, 10);

        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (name, phone, password) VALUES (?, ?, ?)`,
                [name, phone, hashedPassword],
                function(err) {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            return reject(new ApiError(400, 'Phone number already registered'));
                        }
                        return reject(err);
                    }
                    resolve({ id: this.lastID });
                }
            );
        });
    }

    static async login(phone, password) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE phone = ?`, [phone], async (err, user) => {
                if (err) return reject(err);
                if (!user) return reject(new ApiError(401, 'Invalid credentials'));

                const match = await bcrypt.compare(password, user.password);
                if (!match) return reject(new ApiError(401, 'Invalid credentials'));

                const token = jwt.sign(
                    { id: user.id, role: user.role, name: user.name, phone: user.phone },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );

                resolve({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        phone: user.phone,
                        role: user.role,
                        loyalty_points: user.loyalty_points
                    }
                });
            });
        });
    }
}

module.exports = AuthService;
