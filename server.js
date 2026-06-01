require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

// Initialize Express
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyluxe')
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session configuration
app.use(session({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // false for localhost HTTP
}));

// Initialize Passport
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Mount API routes (supporting both legacy /api and Next.js /api/v1 prefixes)
const authRouter = require('./routes/auth');
const flightsRouter = require('./routes/flights');
const conciergeRouter = require('./routes/concierge');
const membershipRouter = require('./routes/membership');

app.use('/api/auth', authRouter);
app.use('/api/v1/auth', authRouter);

app.use('/api/flights', flightsRouter);
app.use('/api/v1/flights', flightsRouter);

app.use('/api/concierge', conciergeRouter);
app.use('/api/v1/concierge', conciergeRouter);
app.use('/api/v1/ai/concierge-requests', conciergeRouter);

app.use('/api/membership', membershipRouter);
app.use('/api/v1/membership', membershipRouter);
app.use('/api/v1/memberships', membershipRouter);

// Catch-all route for undefined API endpoints
app.use((req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});