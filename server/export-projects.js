// export-projects.js — écrit client/src/assets/projects.json à partir de la base SQL Server.
// Usage : npm run export   (puis git add/commit/push pour mettre à jour le site en ligne)
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { getPool } = require('./db');

const OUT = path.join(__dirname, '..', 'client', 'src', 'assets', 'projects.json');

(async () => {
  try {
    const pool = await getPool();
    const r = await pool.request().query('SELECT * FROM Projects ORDER BY SortOrder, CreatedAt');
    const list = r.recordset.map((row) => ({
      _id: row.Id,
      title: row.Title,
      description: row.Description,
      tags: row.Tags ? row.Tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      githubUrl: row.GithubUrl,
      imageUrl: row.ImageUrl,
      demoUrl: row.DemoUrl || '',
      category: row.Category || 'pro',
    }));
    fs.writeFileSync(OUT, JSON.stringify(list, null, 2) + '\n', 'utf8');
    console.log(`✅ ${list.length} projets exportés vers ${OUT}`);
    process.exit(0);
  } catch (e) {
    console.error('❌ Export impossible :', e.message);
    process.exit(1);
  }
})();
