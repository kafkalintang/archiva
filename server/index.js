require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  const noteCount = db.prepare('SELECT COUNT(*) as c FROM notes').get().c;
  res.json({
    status: 'ARCHIVA Backend is running',
    timestamp: new Date().toISOString(),
    db: { users: userCount, notes: noteCount },
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/notes', require('./routes/notes')); // Tahap 4

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[SERVER] ARCHIVA Backend berjalan di http://localhost:${PORT}`);
});