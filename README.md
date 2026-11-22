# Portfolio fullstack — Angular + Node.js + SQL Server

Site portfolio personnel avec gestion dynamique des projets et des messages de contact via
une vraie base de données SQL Server (au lieu d'un contenu codé en dur).

## Fonctionnalités
- Page publique : présentation, projets chargés dynamiquement depuis la base, formulaire de contact
- Page `/admin` protégée par mot de passe : ajout/suppression de projets, consultation des messages reçus
- Les projets et les messages sont persistés dans SQL Server — aucune modification de code nécessaire pour ajouter un projet

## Stack technique
| Côté | Techno |
|---|---|
| Frontend | Angular 17 (standalone components, Router) |
| Backend | Node.js, Express |
| Base de données | SQL Server (via le package `mssql`) |

## Installation

### Prérequis
- Node.js 18 ou plus récent
- SQL Server installé en local, avec SQL Server Management Studio (SSMS)

### 1. Activer l'authentification SQL Server (si pas déjà fait)
Par défaut, SQL Server n'accepte parfois que l'authentification Windows. Pour utiliser un
identifiant/mot de passe classique (plus simple pour Node.js) :
1. Dans SSMS, clic droit sur le serveur (en haut de l'arborescence) → **Properties**
2. Section **Security** → cocher **SQL Server and Windows Authentication mode**
3. Redémarrer le service SQL Server (dans SQL Server Configuration Manager, ou via les Services Windows)

### 2. Créer un identifiant SQL Server
1. Dans SSMS : **Security** → clic droit sur **Logins** → **New Login**
2. Choisir **SQL Server authentication**, définir un nom d'utilisateur et un mot de passe
3. Décocher "Enforce password expiration" pour simplifier
4. Dans l'onglet **Server Roles**, cocher `sysadmin` (suffisant pour un projet local — à ne jamais faire en production)

### 3. Créer la base et les tables
1. Dans SSMS, ouvrir une nouvelle requête (**New Query**)
2. Ouvrir le fichier `server/sql/schema.sql` de ce projet, copier son contenu
3. Coller dans SSMS et exécuter (**F5**) — ça crée la base `portfolio` et ses 2 tables

### 4. Configurer et lancer le backend

```bash
cd server
```

```bash
npm install
```

```bash
cp .env.example .env
```

Ouvrir le fichier `.env` créé et renseigner :
- `DB_SERVER` : généralement `localhost` (ou `localhost\SQLEXPRESS` si tu utilises SQL Server Express — dans ce cas, assure-toi aussi que le service **SQL Server Browser** est démarré dans SQL Server Configuration Manager, sinon la connexion par nom d'instance échoue)
- `DB_USER` / `DB_PASSWORD` : l'identifiant créé à l'étape 2
- `ADMIN_KEY` : un mot de passe de ton choix, pour accéder à la page `/admin`

```bash
npm run seed
```
Insère les 3 mini-projets déjà réalisés dans la base (à exécuter une seule fois).

```bash
npm start
```

Le backend est alors disponible sur `http://localhost:4000`.

### 5. Lancer le frontend

Dans un second terminal :

```bash
cd client
```

```bash
npm install
```

```bash
npm start
```

L'application est alors disponible sur `http://localhost:4200`.

## Utilisation
- Page publique : `http://localhost:4200`
- Page admin : `http://localhost:4200/admin` (mot de passe = la valeur de `ADMIN_KEY` définie dans `.env`)

## Ajouter un nouveau projet
Se connecter à `/admin` avec le mot de passe, remplir le formulaire "Ajouter un projet" —
il apparaît automatiquement sur la page publique, sans toucher au code.

## Déploiement
- **Backend** : Render ou Railway (gratuit)
- **Frontend** : Vercel ou Netlify (gratuit) — remplacer `http://localhost:4000` par l'URL du backend déployé dans `home.component.ts` et `admin.component.ts`
- **Base de données** : pour un déploiement en ligne, une base SQL Server locale n'est pas accessible depuis internet — il faudrait alors une base SQL Server hébergée (ex. Azure SQL Database, qui propose un tier gratuit)

## Photo et CV
Dans `client/src/assets/`, ajouter :
- `profile.jpg` : la photo affichée dans la section d'accueil (sinon, un cercle avec les initiales s'affiche)
- `CV_EyaKsouri.pdf` : le fichier téléchargé par le bouton "Télécharger mon CV"

## Ajouter un projet plus vite : import depuis GitHub
Sur `/admin`, le bouton "Charger mes dépôts GitHub" liste les dépôts publics du compte (via l'API publique de GitHub).
Un clic sur "Utiliser" pré-remplit le formulaire (titre, description, lien, tags à partir des topics et du langage du dépôt).
Il reste à vérifier, compléter si besoin, puis cliquer sur "Ajouter le projet".
