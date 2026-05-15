// middleware/authMiddleware.js
let secretKey = process.env.SECRET_KEY || 'defaultSecretKey'
const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization') || ''
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader

    if (!token) return res.status(401).json({ error: 'Access denied' });
    console.log('Authorization header:', authHeader);
    try {
        const decoded = jwt.verify(token, secretKey);
        console.log("decoded:", decoded);

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Token verify error:', error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;