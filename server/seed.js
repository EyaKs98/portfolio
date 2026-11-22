// seed.js — remplit la table Projects avec les projets de départ.
// Exécuter avec : npm run seed
// ATTENTION : la table est vidée avant l'insertion (les projets ajoutés depuis /admin sont effacés).
require('dotenv').config();
const { sql, getPool } = require('./db');

const projects = [
  {
    title: 'Générateur de résumés & emails',
    description: "Résume, reformule ou transforme un texte en email professionnel via l'API Groq (IA générative).",
    tags: 'Angular,Node.js,Groq API',
    githubUrl: 'https://github.com/EyaKs98/resume-generator-app',
    imageUrl: 'assets/projects/resume-generator-ia.jpg',
    demoUrl: '',
    category: 'pro',
    order: 1,
  },
  {
    title: 'Analyseur de sentiment',
    description: 'Classe automatiquement des avis clients ou tickets support en positif / neutre / négatif via Hugging Face.',
    tags: 'Angular,Node.js,Hugging Face',
    githubUrl: 'https://github.com/EyaKs98/sentiment-analyzer-app',
    imageUrl: 'assets/projects/sentiment-analyzer-ia.jpg',
    demoUrl: '',
    category: 'pro',
    order: 2,
  },
  {
    title: 'Chatbot FAQ',
    description: "Assistant conversationnel qui répond à partir d'une base de connaissances définie, sans base vectorielle.",
    tags: 'Angular,Node.js,Groq API',
    githubUrl: 'https://github.com/EyaKs98/faq-chatbot-app',
    imageUrl: 'assets/projects/faq-chatbot-ia.jpg',
    demoUrl: '',
    category: 'pro',
    order: 3,
  },
  {
    title: 'Smart Delivery',
    description: "Application qui aide les entreprises à gagner en efficacité opérationnelle et à améliorer la qualité du service client, en optimisant les itinéraires et les séquences de livraison que les chauffeurs doivent suivre.",
    tags: 'React,Node.js,MongoDB',
    githubUrl: 'https://github.com/EyaKs98/SmartDelivery',
    imageUrl: 'assets/projects/smart-delivery-1.jpg',
    demoUrl: '',
    category: 'academic',
    order: 4,
  },
  {
    title: 'My School',
    description: "Système de gestion scolaire destiné aux élèves et à l'administration : une application desktop, web et mobile pour gérer les écoles.",
    tags: 'Java,JavaFX,Symfony,Codename One,MySQL',
    githubUrl: 'https://github.com/EyaKs98/gestion-d-ecole-',
    imageUrl: 'assets/projects/my-school-1.jpg',
    demoUrl: '',
    category: 'academic',
    order: 5,
  },
  {
    title: 'Wapi',
    description: "Site de commerce électronique spécialisé dans le mobilier, développé en PHP, HTML5, CSS3 et JavaScript, selon une architecture MVC.",
    tags: 'PHP,HTML5,CSS3,JavaScript,MVC',
    githubUrl: 'https://github.com/EyaKs98/wapi-ecommerce-website',
    imageUrl: 'assets/projects/wapi-1.jpg',
    demoUrl: '',
    category: 'academic',
    order: 6,
  },
];

async function seed() {
  const pool = await getPool();
  await pool.request().query('DELETE FROM Projects');

  let order = 1;
  for (const p of projects) {
    await pool
      .request()
      .input('title', sql.NVarChar, p.title)
      .input('description', sql.NVarChar, p.description)
      .input('tags', sql.NVarChar, p.tags)
      .input('githubUrl', sql.NVarChar, p.githubUrl)
      .input('imageUrl', sql.NVarChar, p.imageUrl)
      .input('demoUrl', sql.NVarChar, p.demoUrl)
      .input('category', sql.NVarChar, p.category)
      .input('order', sql.Int, p.order)
      .query(`
        INSERT INTO Projects (Title, Description, Tags, GithubUrl, ImageUrl, DemoUrl, Category, SortOrder)
        VALUES (@title, @description, @tags, @githubUrl, @imageUrl, @demoUrl, @category, @order)
      `);
  }

  console.log(`✅ ${projects.length} projets insérés dans la base.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Erreur pendant le seed :', err.message);
  process.exit(1);
});
