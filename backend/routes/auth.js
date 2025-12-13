const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Mock user for demo purposes
const mockUser = {
  id: '1',
  username: 'admin',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // 'password'
};

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== mockUser.username || !await bcrypt.compare(password, mockUser.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: mockUser.id },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: '24h' }
  );

  res.json({ token, user: { id: mockUser.id, username: mockUser.username } });
});

// Verify token
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;