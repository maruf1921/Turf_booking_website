const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    const tokenPart = token.split(' ')[1]; // Bearer <token>
    if (!tokenPart) return res.status(403).json({ error: 'Malformed token' });

    jwt.verify(tokenPart, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.user = decoded;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Require Admin Role' });
        }
        next();
    });
};

module.exports = { verifyToken, verifyAdmin };
