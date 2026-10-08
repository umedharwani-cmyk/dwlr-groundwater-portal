require('dotenv').config();
const express = require('express');
const cors = require('cors');
const farmerRoutes = require('./routes/farmer');
const govRoutes = require('./routes/gov');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/farmer', farmerRoutes);
app.use('/api/gov', govRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));