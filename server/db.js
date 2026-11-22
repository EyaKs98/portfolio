const sql = require('mssql');

const rawServer = process.env.DB_SERVER || 'localhost';
const [serverHost, instanceName] = rawServer.split('\\');

const config = {
  server: serverHost,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,                    // false en local (pas de certificat SSL)
    trustServerCertificate: true,
    ...(instanceName ? { instanceName } : {}),
  },
};

// Le port n'est utilisé que si on ne passe pas par un nom d'instance (ex. SQLEXPRESS)
if (!instanceName) {
  config.port = parseInt(process.env.DB_PORT || '1433', 10);
}

let poolPromise;

function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
}

module.exports = { sql, getPool };
