const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


router.get('/leave-types', authMiddleware(), async (req, res) => {
    try {
        const [types] = await db.query('SELECT * FROM leave_types ORDER BY id');
        res.json(types);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/leave-types', authMiddleware(['admin']), async (req, res) => {
    try {
        const { type_name, max_days_per_year } = req.body;
        
        if (!type_name || !max_days_per_year) {
            return res.status(400).json({ error: 'Type name and max days are required' });
        }
        
        const [result] = await db.query(
            'INSERT INTO leave_types (type_name, max_days_per_year) VALUES (?, ?)',
            [type_name, max_days_per_year]
        );
        
      
        const currentYear = new Date().getFullYear();
        const [employees] = await db.query('SELECT id FROM users WHERE role = "employee"');
        
        for (const employee of employees) {
            await db.query(
                'INSERT INTO leave_balances (employee_id, leave_type_id, year, total_days, used_days) VALUES (?, ?, ?, ?, 0)',
                [employee.id, result.insertId, currentYear, max_days_per_year]
            );
        }
        
        res.status(201).json({ message: 'Leave type added successfully', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.put('/leave-types/:id', authMiddleware(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { type_name, max_days_per_year } = req.body;
        
        if (!type_name || !max_days_per_year) {
            return res.status(400).json({ error: 'Type name and max days are required' });
        }
        
        await db.query(
            'UPDATE leave_types SET type_name = ?, max_days_per_year = ? WHERE id = ?',
            [type_name, max_days_per_year, id]
        );
        
        
        res.json({ message: 'Leave type updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.delete('/leave-types/:id', authMiddleware(['admin']), async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        
        connection = await db.getConnection();
        await connection.beginTransaction();
        
        
        await connection.query('DELETE FROM leave_requests WHERE leave_type_id = ?', [id]);
        
        
        await connection.query('DELETE FROM leave_balances WHERE leave_type_id = ?', [id]);
        
        
        await connection.query('DELETE FROM leave_types WHERE id = ?', [id]);
        
        await connection.commit();
        res.json({ message: 'Leave type and all associated data deleted successfully' });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error during deletion:', error);
        res.status(500).json({ error: 'Server error while deleting leave type' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

module.exports = router;