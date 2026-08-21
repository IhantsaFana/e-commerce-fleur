BEGIN;

-- Aligne l'ancienne colonne username avec le modèle User actuel.
ALTER TABLE users RENAME COLUMN username TO lastname;
ALTER TABLE users ADD COLUMN firstname VARCHAR;

-- Préserve les comptes déjà présents : leur prénom pourra être complété
-- ultérieurement depuis leur profil.
UPDATE users
SET firstname = 'Utilisateur ' || id::text
WHERE firstname IS NULL;

ALTER TABLE users ALTER COLUMN firstname SET NOT NULL;

CREATE INDEX IF NOT EXISTS ix_users_lastname ON users (lastname);
CREATE INDEX IF NOT EXISTS ix_users_firstname ON users (firstname);

COMMIT;
