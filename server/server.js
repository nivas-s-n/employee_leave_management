const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const leaveRequestRoutes = require('./routes/leaveRequests');
const leaveTypeRoutes = require('./routes/leaveTypes');
const leaveBalanceRoutes = require('./routes/leaveBalances');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', leaveRequestRoutes);
app.use('/api', leaveTypeRoutes);
app.use('/api', leaveBalanceRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});