const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4173'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB (fallback to in-memory if no connection)
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected');
    } else {
      console.log('No MongoDB URI provided, using in-memory storage');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Using in-memory storage as fallback');
  }
};

// Routes
app.use('/api/services', require('./routes/services'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/business', require('./routes/business'));
app.use('/api/stripe', require('./routes/stripe'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Agendou API is running', version: '1.0.0' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Server started successfully');
  });
  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}).catch((err) => {
  console.error('DB connection failed:', err);
});