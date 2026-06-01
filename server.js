const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes for HTML pages
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

// Added routes for navigation completeness
app.get('/flights', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'flights.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/membership', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'membership.html'));
});

// Catch-all route for any unmatched routes
const fs = require('fs');
app.get('*', (req, res) => {
    let url = req.originalUrl.split('?')[0];
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 