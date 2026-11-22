-- migration-v2.sql
-- À exécuter UNE fois dans SSMS sur ta base "portfolio" existante (F5).
-- Sans danger si tu le relances : chaque colonne n'est ajoutée que si elle n'existe pas déjà.
USE portfolio;
GO

IF COL_LENGTH('Projects', 'Category') IS NULL
    ALTER TABLE Projects ADD Category NVARCHAR(20) NOT NULL CONSTRAINT DF_Projects_Category DEFAULT 'project';
GO
IF COL_LENGTH('Projects', 'Label') IS NULL
    ALTER TABLE Projects ADD Label NVARCHAR(100) NOT NULL CONSTRAINT DF_Projects_Label DEFAULT '';
GO
IF COL_LENGTH('Projects', 'Platform') IS NULL
    ALTER TABLE Projects ADD Platform NVARCHAR(100) NOT NULL CONSTRAINT DF_Projects_Platform DEFAULT '';
GO
IF COL_LENGTH('Projects', 'ProjectYear') IS NULL
    ALTER TABLE Projects ADD ProjectYear INT NULL;
GO
IF COL_LENGTH('Projects', 'DemoUrl') IS NULL
    ALTER TABLE Projects ADD DemoUrl NVARCHAR(500) NOT NULL CONSTRAINT DF_Projects_DemoUrl DEFAULT '';
GO
IF COL_LENGTH('Projects', 'Features') IS NULL
    ALTER TABLE Projects ADD Features NVARCHAR(MAX) NOT NULL CONSTRAINT DF_Projects_Features DEFAULT '';
GO
