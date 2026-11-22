const express = require('express');
const dns = require('dns').promises;
const nodemailer = require('nodemailer');
const router = express.Router();
const { sql, getPool } = require('../db');
const requireAdmin = require('../middleware/requireAdmin');

// --- Envoi d'email (Gmail par défaut) -------------------------------------------------
// Variables du fichier .env : SMTP_USER (ton adresse Gmail), SMTP_PASS (mot de passe d'application Gmail),
// MAIL_TO (adresse qui reçoit les messages, par défaut SMTP_USER). Voir .env.example.
let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return null;
  const port = Number(process.env.SMTP_PORT || 465);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS.replace(/\s+/g, '') },
    // Antivirus / réseau qui inspecte le HTTPS -> « self-signed certificate in certificate chain ».
    // Par défaut on tolère ce certificat (usage local). Mets SMTP_VERIFY_CERT=true dans .env pour l'exiger.
    tls: { rejectUnauthorized: process.env.SMTP_VERIFY_CERT === 'true', checkServerIdentity: process.env.SMTP_VERIFY_CERT === 'true' ? undefined : () => undefined },
    connectionTimeout: 15000,
  });
  return transporter;
}

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function sendMail({ name, email, subject, message }) {
  const tr = getTransporter();
  if (!tr) throw new Error('SMTP non configuré (SMTP_USER / SMTP_PASS manquants dans .env)');
  const to = process.env.MAIL_TO || process.env.SMTP_USER;
  const title = subject ? `Portfolio — ${subject}` : `Portfolio — nouveau message de ${name}`;
  return tr.sendMail({
    from: `"Portfolio d'Eya" <${process.env.SMTP_USER}>`,
    to,
    replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
    subject: title,
    text: `Nouveau message depuis ton portfolio\n\nNom : ${name}\nEmail : ${email}\n${subject ? `Objet : ${subject}\n` : ''}\n${message}\n`,
    html:
      `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #d7e3e8;border-radius:14px;overflow:hidden">` +
      `<div style="background:#0f766e;color:#fff;padding:16px 22px;font-weight:700">Nouveau message depuis ton portfolio</div>` +
      `<div style="padding:22px;color:#0b1a24;line-height:1.6">` +
      `<p style="margin:0 0 6px"><b>Nom :</b> ${esc(name)}</p>` +
      `<p style="margin:0 0 6px"><b>Email :</b> <a href="mailto:${esc(email)}">${esc(email)}</a></p>` +
      (subject ? `<p style="margin:0 0 6px"><b>Objet :</b> ${esc(subject)}</p>` : '') +
      `<hr style="border:none;border-top:1px solid #e2ecef;margin:16px 0">` +
      `<p style="white-space:pre-wrap;margin:0">${esc(message)}</p></div>` +
      `<div style="background:#f1f7f8;padding:12px 22px;font-size:12px;color:#5b7480">Réponds directement à cet email : il ira à ${esc(email)}.</div></div>`,
  });
}


// --- Vérification de l'email : format strict + le domaine existe vraiment (enregistrement MX/A) ---
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
const TYPOS = { 'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'gamil.com': 'gmail.com',
  'hotmial.com': 'hotmail.com', 'hotmail.con': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'yahoo.con': 'yahoo.com', 'yaho.com': 'yahoo.com',
  'outlok.com': 'outlook.com', 'outlook.con': 'outlook.com' };
async function checkEmail(email) {
  if (email.length > 150 || email.includes('..') || !EMAIL_RE.test(email)) return 'Adresse email invalide.';
  const domain = email.split('@')[1].toLowerCase();
  if (TYPOS[domain]) return `Adresse email invalide : vouliez-vous écrire @${TYPOS[domain]} ?`;
  try {
    const mx = await dns.resolveMx(domain);
    if (mx && mx.length) return null;
  } catch (e) {
    if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') return null; // DNS indisponible : on ne bloque pas
  }
  try {
    const a = await dns.resolve4(domain);
    if (a && a.length) return null;
  } catch (e) {
    if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') return null;
  }
  return `Le domaine « ${domain} » n’existe pas. Vérifiez votre adresse email.`;
}

// anti-spam simple : 5 messages max par heure et par adresse IP
const hits = new Map();
function tooMany(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 3600 * 1000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

// POST /api/contact — public, un visiteur envoie un message
router.post('/', async (req, res) => {
  const body = req.body || {};
  // champ piège (invisible pour un humain) : si rempli, c'est un robot -> on répond OK sans rien faire
  if (body.website) return res.status(201).json({ success: true });

  const name = String(body.name || '').trim().slice(0, 100);
  const email = String(body.email || '').trim().slice(0, 150);
  const subject = String(body.subject || '').trim().slice(0, 150);
  const message = String(body.message || '').trim().slice(0, 4000);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Merci de remplir le nom, l’email et le message.' });
  }
  const emailErr = await checkEmail(email);
  if (emailErr) return res.status(400).json({ error: emailErr });
  if (tooMany(req.ip)) {
    return res.status(429).json({ error: 'Trop de messages envoyés. Réessayez plus tard.' });
  }

  console.log(`📩 Nouveau message reçu de ${name} <${email}>`);

  // 1) sauvegarde en base (si SQL Server est disponible)
  let saved = false;
  try {
    const pool = await getPool();
    await pool
      .request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('message', sql.NVarChar, subject ? `[${subject}] ${message}` : message)
      .query('INSERT INTO ContactMessages (Name, Email, Message) VALUES (@name, @email, @message)');
    saved = true;
  } catch (err) {
    console.error('⚠️ Message non enregistré en base :', err.message);
  }

  // 2) email de notification
  let mailed = false;
  try {
    const info = await sendMail({ name, email, subject, message });
    mailed = true;
    console.log('✅ Email envoyé à', process.env.MAIL_TO || process.env.SMTP_USER, '|', (info && info.response) || '');
  } catch (err) {
    console.error('⚠️ Email non envoyé :', err.message, '| code:', err.code || '-', '| Vérif. certificat:', process.env.SMTP_VERIFY_CERT === 'true', '| hôte:', process.env.SMTP_HOST || 'smtp.gmail.com', '| port:', process.env.SMTP_PORT || 465);
  }

  if (saved || mailed) return res.status(201).json({ success: true, emailSent: mailed });
  res.status(500).json({ error: "Le message n'a pas pu être envoyé. Écrivez-moi directement par email." });
});

// GET /api/contact — admin uniquement, liste des messages reçus
router.get('/', requireAdmin, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM ContactMessages ORDER BY CreatedAt DESC');
    const messages = result.recordset.map((row) => ({
      id: row.Id,
      name: row.Name,
      email: row.Email,
      message: row.Message,
      createdAt: row.CreatedAt,
    }));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
