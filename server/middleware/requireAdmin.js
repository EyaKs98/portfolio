// Vérifie un mot de passe admin simple envoyé dans l'en-tête "x-admin-key".
// Suffisant pour un projet portfolio personnel — pas un vrai système d'authentification.
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Accès non autorisé.' });
  }
  next();
}

module.exports = requireAdmin;
