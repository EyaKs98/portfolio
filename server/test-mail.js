// Test d'envoi d'email : lance « node test-mail.js » dans le dossier server
require('dotenv').config();
const nodemailer = require('nodemailer');
const { SMTP_USER, SMTP_PASS } = process.env;
if (!SMTP_USER || !SMTP_PASS) { console.log('❌ SMTP_USER / SMTP_PASS manquants dans .env'); process.exit(1); }
const port = Number(process.env.SMTP_PORT || 465);
console.log('Hôte:', process.env.SMTP_HOST || 'smtp.gmail.com', '| port:', port, '| utilisateur:', SMTP_USER, '| mot de passe:', SMTP_PASS.replace(/\s+/g, '').length, 'caractères');
const tr = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com', port, secure: port === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS.replace(/\s+/g, '') },
  tls: { rejectUnauthorized: false, checkServerIdentity: () => undefined }, connectionTimeout: 15000,
});
tr.sendMail({ from: SMTP_USER, to: process.env.MAIL_TO || SMTP_USER, subject: 'Test portfolio', text: 'Si tu lis ceci, l’envoi d’email fonctionne ✅' })
  .then((i) => console.log('✅ Email envoyé :', i.response))
  .catch((e) => console.log('❌ Échec :', e.message, '| code:', e.code, '| commande:', e.command || '-'));
