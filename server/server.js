require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getPool } = require('./db');

const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

getPool()
  .then(() => {
    console.log('✅ Connecté à SQL Server');
    app.listen(PORT, () => console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion à SQL Server :', err.message);
  });
