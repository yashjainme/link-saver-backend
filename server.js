require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { initDB } = require('./utils/db');
const authRoutes = require('./routes/auth');
const bookmarkRoutes = require('./routes/bookmarks');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);


app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Service Status</title></head>
      <body style="font-family:sans-serif;text-align:center;margin-top:2rem;">
        <h1>🚀 Link Saver API is running</h1>
        <p>Backend server is active and listening on port ${PORT}</p>
      </body>
    </html>
  `);
});


// Initialize database and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});