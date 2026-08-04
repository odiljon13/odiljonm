// Uzum Market Full Production Node.js + Express REST API Server
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Mount API Routes
const productsHandler = require('./api/products');
const authHandler = require('./api/auth');
const ordersHandler = require('./api/orders');
const telegramHandler = require('./api/telegram');
const paymentHandler = require('./api/payment');

app.all('/api/products', (req, res) => productsHandler(req, res));
app.all('/api/auth', (req, res) => authHandler(req, res));
app.all('/api/orders', (req, res) => ordersHandler(req, res));
app.all('/api/telegram', (req, res) => telegramHandler(req, res));
app.all('/api/payment', (req, res) => paymentHandler(req, res));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: "OK",
    system: "Uzum Market Backend Node.js Engine",
    time: new Date().toISOString()
  });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Uzum Market Node.js Backend Server running on http://localhost:${PORT}`);
});
