const jwt = require('jsonwebtoken');

const authMiddleware = (requiredRoles = []) => {
    return (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            
            if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Insufficient permissions.' });
            }
            
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token.' });
        }
    };
};

module.exports = authMiddleware;