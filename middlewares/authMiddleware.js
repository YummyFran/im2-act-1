const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
    const token = req.cookies.auth_token

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthenticated'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            token,
            err: err.message
        });
    }
}

module.exports = authenticate;
