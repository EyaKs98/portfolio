// Configuration d'environnement (aucune clé secrète ici).
// - En local (localhost) : le site utilise ton serveur Node + SQL Server.
// - En ligne (GitHub Pages) : pas de serveur, donc les projets viennent de assets/projects.json
//   et le formulaire de contact passe par Web3Forms (gratuit).

export const IS_LOCAL = ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const API_URL = 'http://localhost:4000/api';

// Clé publique Web3Forms (pas secrète, prévue pour être visible dans le site).
// Obtenir la tienne gratuitement sur https://web3forms.com (elle arrive par e-mail), puis la coller ici.
export const WEB3FORMS_KEY = 'f13f9c4e-4b3f-4c85-be9d-61b52f7966eb';
