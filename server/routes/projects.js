const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../db');
const requireAdmin = require('../middleware/requireAdmin');

function formatProject(row) {
  return {
    _id: row.Id,
    title: row.Title,
    description: row.Description,
    tags: row.Tags ? row.Tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    githubUrl: row.GithubUrl,
    imageUrl: row.ImageUrl,
    demoUrl: row.DemoUrl || '',
    category: row.Category || 'pro',
  };
}

// GET /api/projects — public, liste tout
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Projects ORDER BY SortOrder, CreatedAt');
    res.json(result.recordset.map(formatProject));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id — public, un seul projet (page de détail)
router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().input('id', sql.Int, req.params.id).query('SELECT * FROM Projects WHERE Id = @id');
    if (result.recordset.length === 0) return res.status(404).json({ error: 'Projet introuvable.' });
    res.json(formatProject(result.recordset[0]));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/projects — admin uniquement
router.post('/', requireAdmin, async (req, res) => {
  const { title, description, tags = [], githubUrl, imageUrl = '', demoUrl = '', category = 'pro' } = req.body;
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('tags', sql.NVarChar, Array.isArray(tags) ? tags.join(',') : tags)
      .input('githubUrl', sql.NVarChar, githubUrl || '')
      .input('imageUrl', sql.NVarChar, imageUrl)
      .input('demoUrl', sql.NVarChar, demoUrl)
      .input('category', sql.NVarChar, category)
      .query(`
        INSERT INTO Projects (Title, Description, Tags, GithubUrl, ImageUrl, DemoUrl, Category)
        OUTPUT INSERTED.*
        VALUES (@title, @description, @tags, @githubUrl, @imageUrl, @demoUrl, @category)
      `);
    res.status(201).json(formatProject(result.recordset[0]));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/projects/:id — admin uniquement
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request().input('id', sql.Int, req.params.id).query('DELETE FROM Projects WHERE Id = @id');
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
