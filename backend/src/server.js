const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectMySQL } = require('./config/mysql');
const { connectMongoDB } = require('./config/mongodb');
const indexRoute = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors({
  origin: 'http://localhost:3000', // React dev server
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder untuk file upload
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ===== ROUTES =====
app.use('/api', indexRoute);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/air-quality', require('./routes/airQuality'));
app.use('/api/traffic', require('./routes/traffic'));
app.use('/api/transport', require('./routes/transport'));
app.use('/api/facilities', require('./routes/facilities'));
app.use('/api/city-services', require('./routes/cityServices'));
app.use('/api/public-services', require('./routes/publicServices'));
app.use('/api/admin', require('./routes/admin'));

// ===== SERVE REACT BUILD (untuk mode demo/production) =====
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
  });
}

// ===== START SERVER =====
const startServer = async () => {
  await connectMySQL();
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
