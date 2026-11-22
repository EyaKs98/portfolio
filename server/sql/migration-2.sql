-- migration-2.sql — à exécuter une seule fois dans SSMS (sur la base "portfolio" déjà créée)
-- Ajoute les colonnes nécessaires pour : catégorie (pro/academic) et lien de démo

USE portfolio;
GO

ALTER TABLE Projects ADD Category NVARCHAR(50) NOT NULL DEFAULT 'pro';
GO

ALTER TABLE Projects ADD DemoUrl NVARCHAR(500) NOT NULL DEFAULT '';
GO
