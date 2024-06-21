// routes/sql.js
const express = require('express');
const mysql = require('mysql2/promise');
const dbConfig = require('../db-config');

const router = express.Router();

const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// POST route for adding plant details
router.post('/plants', async (req, res) => {
  try {
    const { plant_type, image, description, time_to_water, time_to_fertilize } = req.body;
    const query = 'INSERT INTO plants (plant_type, image, description, time_to_water, time_to_fertilize) VALUES (?, ?, ?, ?, ?)';
    const [result] = await pool.query(query, [plant_type, image, description, time_to_water, time_to_fertilize]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET route for fetching plant details
// GET route for fetching plant details
router.get('/plants', async (req, res) => {
  try {
    const query = 'SELECT * FROM plants';
    const [results] = await pool.query(query);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
