require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./db');

async function seed() {
  const passwordHash = await bcrypt.hash('demo1234', 10);
  await pool.query(
    `INSERT INTO gov_officials (employee_id, name, department, password)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE password = VALUES(password)`,
    ['GWD-DEMO-001', 'Demo Officer', 'Groundwater Department', passwordHash]
  );
  console.log('Seeded government account -> Employee ID: GWD-DEMO-001  Password: demo1234');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});