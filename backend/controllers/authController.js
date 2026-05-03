const AuthService = require('../services/authService');
const ApiError = require('../utils/ApiError');

class AuthController {
    static async signup(req, res) {
        const { name, phone, password } = req.body;
        if (!name || !phone || !password) {
            throw new ApiError(400, 'All fields required');
        }

        const result = await AuthService.signup({ name, phone, password });
        res.status(201).json({
            message: 'User created successfully',
            userId: result.id
        });
    }

    static async login(req, res) {
        const { phone, password } = req.body;
        if (!phone || !password) {
            throw new ApiError(400, 'Phone and password required');
        }

        const result = await AuthService.login(phone, password);
        res.json(result);
    }
}

module.exports = AuthController;
