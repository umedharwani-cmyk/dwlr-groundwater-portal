const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { full_name, mobile_number, state, district, password } = req.body;

    if (!full_name || !mobile_number || !state || !district || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!/^\d{10}$/.test(mobile_number)) {
      return res.status(400).json({ error: 'Enter a valid 10-digit mobile number.' });
    }

    const [existing] = await pool.query(
      'SELECT mobile_number FROM farmer_details WHERE mobile_number = ?',
      [mobile_number]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'This mobile number is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO farmer_details (full_name, mobile_number, state, district, password) VALUES (?, ?, ?, ?, ?)',
      [full_name, mobile_number, state, district, hashedPassword]
    );

    res.status(201).json({
      message: 'Registered successfully',
      user: { full_name, mobile_number, state, district }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { mobile_number, password } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM farmer_details WHERE mobile_number = ?',
      [mobile_number]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'No account found for this number.' });
    }

    const farmer = rows[0];
    const match = await bcrypt.compare(password, farmer.password);
    if (!match) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    res.json({
      message: 'Login successful',
      user: {
        full_name: farmer.full_name,
        mobile_number: farmer.mobile_number,
        state: farmer.state,
        district: farmer.district
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

module.exports = router;