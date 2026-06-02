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
const { seedDatabase } = require('./config/seeder');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyluxe')
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    await seedDatabase();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Rate Limiter for API Security
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 10000 requests per window (increased for local development/HMR)
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Middleware
app.use(cors());
app.use('/api/', apiLimiter);
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
const walletRouter = require('./routes/wallet');
const rewardsRouter = require('./routes/rewards');
const bookingsRouter = require('./routes/bookings');
const jetsRouter = require('./routes/jets');
const notificationsRouter = require('./routes/notifications');
const usersRouter = require('./routes/users');

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

app.use('/api/wallet', walletRouter);
app.use('/api/v1/wallet', walletRouter);

app.use('/api/rewards', rewardsRouter);
app.use('/api/v1/rewards', rewardsRouter);

app.use('/api/bookings', bookingsRouter);
app.use('/api/v1/bookings', bookingsRouter);

app.use('/api/jets', jetsRouter);
app.use('/api/v1/jets', jetsRouter);

app.use('/api/notifications', notificationsRouter);
app.use('/api/v1/notifications', notificationsRouter);

app.use('/api/users', usersRouter);
app.use('/api/v1/users', usersRouter);

const paymentsRouter = require('./routes/payments');
const invoicesRouter = require('./routes/invoices');
const adminRouter = require('./routes/admin');
const adminAirlinesRouter = require('./routes/admin-airlines');

app.use('/api/payments', paymentsRouter);
app.use('/api/v1/payments', paymentsRouter);

app.use('/api/invoices', invoicesRouter);
app.use('/api/v1/invoices', invoicesRouter);

app.use('/api/admin', adminRouter);
app.use('/api/v1/admin', adminRouter);

app.use('/api/admin/airlines', adminAirlinesRouter);
app.use('/api/v1/admin/airlines', adminAirlinesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

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