const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


const calculateDays = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
};


router.post('/leave-requests', authMiddleware(['employee', 'manager', 'admin']), async (req, res) => {
    try {
        const { leave_type_id, from_date, to_date, reason } = req.body;
        const employee_id = req.user.id;
        
        const days = calculateDays(from_date, to_date);
        
        const [result] = await db.query(
            'INSERT INTO leave_requests (employee_id, leave_type_id, from_date, to_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
            [employee_id, leave_type_id, from_date, to_date, reason, 'pending']
        );
        
        res.status(201).json({ message: 'Leave request submitted successfully', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/leave-requests/my', authMiddleware(), async (req, res) => {
    try {
        const [requests] = await db.query(
            `SELECT lr.*, lt.type_name, 
             DATEDIFF(lr.to_date, lr.from_date) + 1 as days_requested
             FROM leave_requests lr 
             JOIN leave_types lt ON lr.leave_type_id = lt.id 
             WHERE lr.employee_id = ? 
             ORDER BY lr.created_at DESC`,
            [req.user.id]
        );
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/leave-requests/team', authMiddleware(['manager', 'admin']), async (req, res) => {
    try {
        let query = `
            SELECT lr.*, lt.type_name, u.name as employee_name, u.dept,
            DATEDIFF(lr.to_date, lr.from_date) + 1 as days_requested
            FROM leave_requests lr 
            JOIN leave_types lt ON lr.leave_type_id = lt.id 
            JOIN users u ON lr.employee_id = u.id
        `;
        
        const params = [];
        
       
        if (req.user.role === 'manager') {
            query += ` WHERE u.dept = ?`;
            params.push(req.user.dept);
        }
        
        query += ` ORDER BY lr.created_at DESC`;
        
        const [requests] = await db.query(query, params);
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/leave-requests/all', authMiddleware(['admin']), async (req, res) => {
    try {
        const [requests] = await db.query(
            `SELECT lr.*, lt.type_name, u.name as employee_name, u.dept,
             DATEDIFF(lr.to_date, lr.from_date) + 1 as days_requested
             FROM leave_requests lr 
             JOIN leave_types lt ON lr.leave_type_id = lt.id 
             JOIN users u ON lr.employee_id = u.id
             ORDER BY lr.created_at DESC`
        );
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.put('/leave-requests/:id/approve', authMiddleware(['manager', 'admin']), async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const [request] = await connection.query(
            `SELECT lr.*, lt.type_name, lt.max_days_per_year, u.dept as employee_dept
             FROM leave_requests lr
             JOIN leave_types lt ON lr.leave_type_id = lt.id
             JOIN users u ON lr.employee_id = u.id
             WHERE lr.id = ? AND lr.status = 'pending'`,
            [req.params.id]
        );
        
        if (request.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Request not found or already processed' });
        }
        
        
        if (req.user.role === 'manager' && request[0].employee_dept !== req.user.dept) {
            await connection.rollback();
            return res.status(403).json({ error: 'Cannot approve requests from other departments' });
        }
        
        const leaveRequest = request[0];
        const days = calculateDays(leaveRequest.from_date, leaveRequest.to_date);
        const currentYear = new Date().getFullYear();
        
        
        const [balance] = await connection.query(
            'SELECT * FROM leave_balances WHERE employee_id = ? AND leave_type_id = ? AND year = ?',
            [leaveRequest.employee_id, leaveRequest.leave_type_id, currentYear]
        );
        
        if (balance.length === 0) {
            
            await connection.query(
                'INSERT INTO leave_balances (employee_id, leave_type_id, year, total_days, used_days) VALUES (?, ?, ?, ?, 0)',
                [leaveRequest.employee_id, leaveRequest.leave_type_id, currentYear, leaveRequest.max_days_per_year]
            );
            var currentBalance = { total_days: leaveRequest.max_days_per_year, used_days: 0 };
        } else {
            var currentBalance = balance[0];
        }
        
        
        if (currentBalance.used_days + days > currentBalance.total_days) {
            await connection.rollback();
            return res.status(400).json({ error: 'Insufficient leave balance' });
        }
        
        
        await connection.query(
            'UPDATE leave_requests SET status = "approved", approved_by = ? WHERE id = ?',
            [req.user.id, req.params.id]
        );
        
        
        await connection.query(
            'UPDATE leave_balances SET used_days = used_days + ? WHERE employee_id = ? AND leave_type_id = ? AND year = ?',
            [days, leaveRequest.employee_id, leaveRequest.leave_type_id, currentYear]
        );
        
        await connection.commit();
        res.json({ message: 'Leave request approved successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        connection.release();
    }
});


router.put('/leave-requests/:id/reject', authMiddleware(['manager', 'admin']), async (req, res) => {
    try {
        const [request] = await db.query(
            `SELECT lr.*, u.dept as employee_dept
             FROM leave_requests lr
             JOIN users u ON lr.employee_id = u.id
             WHERE lr.id = ? AND lr.status = 'pending'`,
            [req.params.id]
        );
        
        if (request.length === 0) {
            return res.status(404).json({ error: 'Request not found or already processed' });
        }
        
        
        if (req.user.role === 'manager' && request[0].employee_dept !== req.user.dept) {
            return res.status(403).json({ error: 'Cannot reject requests from other departments' });
        }
        
        await db.query(
            'UPDATE leave_requests SET status = "rejected", approved_by = ? WHERE id = ?',
            [req.user.id, req.params.id]
        );
        
        res.json({ message: 'Leave request rejected successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.delete('/leave-requests/:id', authMiddleware(), async (req, res) => {
    try {
        const [request] = await db.query(
            'SELECT * FROM leave_requests WHERE id = ? AND employee_id = ? AND status = "pending"',
            [req.params.id, req.user.id]
        );
        
        if (request.length === 0) {
            return res.status(404).json({ error: 'Request not found or cannot be cancelled' });
        }
        
        await db.query(
            'UPDATE leave_requests SET status = "cancelled" WHERE id = ?',
            [req.params.id]
        );
        
        res.json({ message: 'Leave request cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;