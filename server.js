require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const fs = require('fs');

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

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

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

// Serve HTML pages on specific clean URLs
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/private-jets', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'private-jets.html'));
});

app.get('/membership', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'membership.html'));
});

app.get('/concierge', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'concierge.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/flights', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'flights.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Catch-all route for other assets or redirects
app.get('*', (req, res) => {
    let url = req.originalUrl.split('?')[0];
    
    // Ignore API routes
    if (url.startsWith('/api')) {
        return res.status(404).json({ message: 'API endpoint not found' });
    }
    
    // If requesting an HTML file directly
    if (url.endsWith('.html')) {
        const htmlPath = path.join(__dirname, 'public', url);
        if (fs.existsSync(htmlPath)) {
            res.sendFile(htmlPath);
            return;
        }
    }
    // If requesting a route that matches an HTML file (e.g., /flights)
    const htmlFile = path.join(__dirname, 'public', url + '.html');
    if (fs.existsSync(htmlFile)) {
        res.sendFile(htmlFile);
        return;
    }
    // Otherwise, redirect to home
    res.redirect('/');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});