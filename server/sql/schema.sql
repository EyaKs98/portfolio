-- schema.sql
-- Pour une NOUVELLE installation uniquement (crée la base et les tables).
-- Si ta base "portfolio" existe déjà, exécute plutôt sql/migration-v2.sql.
CREATE DATABASE portfolio;
GO

USE portfolio;
GO

CREATE TABLE Projects (
    Category NVARCHAR(50) NOT NULL DEFAULT 'pro',
    DemoUrl NVARCHAR(500) NOT NULL DEFAULT '',
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Tags NVARCHAR(500) NOT NULL DEFAULT '',        -- séparés par une virgule
    GithubUrl NVARCHAR(500) NOT NULL DEFAULT '',
    DemoUrl NVARCHAR(500) NOT NULL DEFAULT '',
    ImageUrl NVARCHAR(500) NOT NULL DEFAULT '',
    Category NVARCHAR(20) NOT NULL DEFAULT 'project',   -- 'project' ou 'academic'
    Label NVARCHAR(100) NOT NULL DEFAULT '',
    Platform NVARCHAR(100) NOT NULL DEFAULT '',
    ProjectYear INT NULL,
    Features NVARCHAR(MAX) NOT NULL DEFAULT '',    -- une fonctionnalité par ligne
    SortOrder INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE ContactMessages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO
