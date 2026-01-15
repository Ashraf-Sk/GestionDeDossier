-- ============================================
-- Vérifier si des comptes admin existent
-- ============================================

-- 1. Vérifier tous les utilisateurs admin existants
SELECT 
    u.id,
    u.email,
    u.nom,
    u.prenom,
    u.cin,
    r.role,
    u.password IS NOT NULL as has_password
FROM utilisateur u
LEFT JOIN utilisateur_role ur ON ur.utilisateur_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE r.role = 'ROLE_ADMIN'
ORDER BY u.email;

-- 2. Vérifier spécifiquement EHTP1 et EHTP2
SELECT 
    u.id,
    u.email,
    u.nom,
    u.prenom,
    u.cin,
    r.role,
    CASE 
        WHEN r.role = 'ROLE_ADMIN' THEN 'OUI - Admin'
        WHEN r.role IS NOT NULL THEN CONCAT('OUI - ', r.role)
        ELSE 'NON - Pas de rôle'
    END as statut_admin
FROM utilisateur u
LEFT JOIN utilisateur_role ur ON ur.utilisateur_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE u.email IN ('EHTP1', 'EHTP2', 'EHTP1@example.com', 'EHTP2@example.com', 'ehtp1@example.com', 'ehtp2@example.com')
ORDER BY u.email;

-- 3. Vérifier tous les utilisateurs (pour voir tous les emails)
SELECT 
    u.id,
    u.email,
    u.nom,
    u.prenom,
    u.cin,
    STRING_AGG(r.role, ', ') as roles
FROM utilisateur u
LEFT JOIN utilisateur_role ur ON ur.utilisateur_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
GROUP BY u.id, u.email, u.nom, u.prenom, u.cin
ORDER BY u.email;

-- 4. Vérifier si les rôles existent
SELECT * FROM roles ORDER BY role;

-- 5. Compter les admins
SELECT 
    COUNT(DISTINCT u.id) as nombre_admins
FROM utilisateur u
JOIN utilisateur_role ur ON ur.utilisateur_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE r.role = 'ROLE_ADMIN';
