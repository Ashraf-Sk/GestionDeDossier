-- ============================================
-- Script SQL pour créer un utilisateur ADMIN
-- ============================================

-- 1. Créer le rôle ROLE_ADMIN s'il n'existe pas
INSERT INTO roles (role) 
SELECT 'ROLE_ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role = 'ROLE_ADMIN');

-- 2. Créer le rôle ROLE_USER s'il n'existe pas (au cas où)
INSERT INTO roles (role) 
SELECT 'ROLE_USER'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role = 'ROLE_USER');

-- 3. Créer l'utilisateur admin
-- Email: admin@example.com
-- Mot de passe: admin123
-- Hash BCrypt pour "admin123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO utilisateur (email, password, nom, prenom, cin)
SELECT 
    'admin@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Admin',
    'User',
    'ADMIN001'
WHERE NOT EXISTS (SELECT 1 FROM utilisateur WHERE email = 'admin@example.com');

-- 4. Associer le rôle ADMIN à l'utilisateur
INSERT INTO utilisateur_role (utilisateur_id, role_id)
SELECT 
    u.id,
    r.id
FROM utilisateur u
CROSS JOIN roles r
WHERE u.email = 'admin@example.com'
  AND r.role = 'ROLE_ADMIN'
  AND NOT EXISTS (
    SELECT 1 FROM utilisateur_role ur 
    WHERE ur.utilisateur_id = u.id AND ur.role_id = r.id
  );

-- 5. Vérification : Afficher les utilisateurs admin
SELECT 
    u.id,
    u.email,
    u.nom,
    u.prenom,
    r.role
FROM utilisateur u
JOIN utilisateur_role ur ON ur.utilisateur_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE r.role = 'ROLE_ADMIN';

-- ============================================
-- Pour créer un autre utilisateur admin :
-- ============================================
-- Remplacez 'admin@example.com' par l'email souhaité
-- et générez un nouveau hash BCrypt pour le mot de passe
-- 
-- Exemple pour créer admin2@example.com avec mot de passe "password123":
-- 
-- INSERT INTO utilisateur (email, password, nom, prenom, cin)
-- VALUES (
--     'admin2@example.com',
--     '$2a$10$VotreHashBCryptIci',  -- Générez avec BCryptPasswordEncoder
--     'Admin2',
--     'User',
--     'ADMIN002'
-- );
-- 
-- INSERT INTO utilisateur_role (utilisateur_id, role_id)
-- SELECT u.id, r.id
-- FROM utilisateur u, roles r
-- WHERE u.email = 'admin2@example.com' AND r.role = 'ROLE_ADMIN';
