const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// GET /api/stats — chiffres de la section « À propos », calculés côté serveur
//  - years    : années d'expérience = année en cours - CAREER_START_YEAR (défaut : 2023)
//  - products : nombre de projets professionnels (hors "academic") dans la table Projects
//  - clients  : valeur de CLIENTS_COUNT dans .env (0 = la carte est masquée sur le site)
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT COUNT(*) AS total FROM Projects WHERE ISNULL(Category, 'pro') <> 'academic'");

    const startYear = parseInt(process.env.CAREER_START_YEAR || '2023', 10);
    const years = Math.max(0, new Date().getFullYear() - startYear);
    const clients = Math.max(0, parseInt(process.env.CLIENTS_COUNT || '0', 10) || 0);

    res.json({ years, products: result.recordset[0].total, clients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
