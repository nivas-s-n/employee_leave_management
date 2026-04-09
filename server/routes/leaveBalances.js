const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


router.get('/leave-balances/:employeeId', authMiddleware(), async (req, res) => {
    try {
        const employeeId = req.params.employeeId;
        
        
        if (req.user.role === 'employee' && req.user.id != employeeId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const currentYear = new Date().getFullYear();
        
        const [balances] = await db.query(
            `SELECT lb.*, lt.type_name, lt.max_days_per_year,
             (lb.total_days - lb.used_days) as remaining_days
             FROM leave_balances lb
             JOIN leave_types lt ON lb.leave_type_id = lt.id
             WHERE lb.employee_id = ? AND lb.year = ?
             ORDER BY lt.id`,
            [employeeId, currentYear]
        );
        
        res.json(balances);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;