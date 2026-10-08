const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

// LOGIN ONLY — no self-registration for government accounts
router.post('/login', async (req, res) => {
  try {
    const { employee_id, password } = req.body;

    if (!employee_id || employee_id.trim().length < 3) {
      return res.status(400).json({ error: 'Enter your official Employee / Officer ID.' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM gov_officials WHERE employee_id = ?',
      [employee_id.trim().toUpperCase()]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Unrecognized Employee ID. Contact your department admin.' });
    }

    const officer = rows[0];
    const match = await bcrypt.compare(password, officer.password);
    if (!match) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    res.json({
      message: 'Login successful',
      user: {
        name: officer.name,
        employee_id: officer.employee_id,
        department: officer.department
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

module.exports = router;