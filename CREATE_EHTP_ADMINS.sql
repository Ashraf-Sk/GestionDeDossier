-- ============================================
-- Script SQL pour créer des utilisateurs ADMIN
-- EHTP1 et EHTP2
-- ============================================

-- 1. Créer le rôle ROLE_ADMIN s'il n'existe pas
INSERT INTO roles (role) 
SELECT 'ROLE_ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role = 'ROLE_ADMIN');

-- 2. Créer le rôle ROLE_USER s'il n'existe pas (au cas où)
INSERT INTO roles (role) 
SELECT 'ROLE_USER'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role = 'ROLE_USER');

-- 3. Créer l'utilisateur EHTP1
-- Email: EHTP1 (ou EHTP1@example.com selon votre convention)
-- Mot de passe: admin123
-- Hash BCrypt pour "admin123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO utilisateur (email, password, nom, prenom, cin)
SELECT 
    'EHTP1',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Admin',
    'EHTP1',
    'EHTP001'
WHERE NOT EXISTS (SELECT 1 FROM utilisateur WHERE email = 'EHTP1');

-- 4. Créer l'utilisateur EHTP2
INSERT INTO utilisateur (email, password, nom, prenom, cin)
SELECT 
    'EHTP2',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Admin',
    'EHTP2',
    'EHTP002'
WHERE NOT EXISTS (SELECT 1 FROM utilisateur WHERE email = 'EHTP2');

-- 5. Associer le rôle ADMIN à EHTP1
INSERT INTO utilisateur_role (utilisateur_id, role_id)
SELECT 
    u.id,
    r.id
FROM utilisateur u
CROSS JOIN roles r
WHERE u.email = 'EHTP1'
  AND r.role = 'ROLE_ADMIN'
  AND NOT EXISTS (
    SELECT 1 FROM utilisateur_role ur 
    WHERE ur.utilisateur_id = u.id AND ur.role_id = r.id
  );

-- 6. Associer le rôle ADMIN à EHTP2
INSERT INTO utilisateur_role (utilisateur_id, role_id)
SELECT 
    u.id,
    r.id
FROM utilisateur u
CROSS JOIN roles r
WHERE u.email = 'EHTP2'
  AND r.role = 'ROLE_ADMIN'
  AND NOT EXISTS (
    SELECT 1 FROM utilisateur_role ur 
    WHERE ur.utilisateur_id = u.id AND ur.role_id = r.id
  );

-- 7. Vérification : Afficher les utilisateurs admin créés
SELECT 
    u.id,
    u.email,
    u.nom,
    u.prenom,
    u.cin,
    r.role,
    'admin123' as mot_de_passe_par_defaut
FROM utilisateur u
JOIN utilisateur_role ur ON ur.utilisateur_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE u.email IN ('EHTP1', 'EHTP2')
  AND r.role = 'ROLE_ADMIN'
ORDER BY u.email;

-- ============================================
-- NOTES IMPORTANTES :
-- ============================================
-- 1. Les emails sont "EHTP1" et "EHTP2" (sans @)
--    Si vous préférez avec @, changez en 'EHTP1@example.com' et 'EHTP2@example.com'
--
-- 2. Mot de passe par défaut : admin123
--    Changez-le après la première connexion !
--
-- 3. Pour générer un nouveau hash BCrypt pour un autre mot de passe,
--    utilisez PasswordGenerator.java ou https://bcrypt-generator.com/
--
-- 4. Ce script est idempotent : vous pouvez l'exécuter plusieurs fois
--    sans créer de doublons
