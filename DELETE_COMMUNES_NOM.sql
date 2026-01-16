-- =====================================================
-- Script de suppression des communes commençant par "NOM"
-- Option 4 : Préserver les demandes en mettant leur commune à NULL
-- =====================================================

-- ⚠️ IMPORTANT : Faites une sauvegarde de votre base de données avant d'exécuter ce script !

-- =====================================================
-- ÉTAPE 1 : Vérification - Voir les communes qui seront supprimées
-- =====================================================
-- Exécutez cette requête pour voir d'abord ce qui sera supprimé
SELECT code_commu, nom_commun 
FROM communes 
WHERE nom_commun LIKE 'NOM%';

-- =====================================================
-- ÉTAPE 2 : Vérification - Compter les demandes affectées
-- =====================================================
-- Exécutez cette requête pour voir combien de demandes seront affectées
SELECT COUNT(*) as nb_demandes_affectees
FROM demande 
WHERE demande_commune IN (
    SELECT code_commu 
    FROM communes 
    WHERE nom_commun LIKE 'NOM%'
);

-- =====================================================
-- ÉTAPE 3 : DÉBUT DE LA TRANSACTION
-- =====================================================
-- Démarrer une transaction pour pouvoir annuler si nécessaire
BEGIN;

-- =====================================================
-- ÉTAPE 4 : Mettre à NULL la référence commune dans les demandes
-- =====================================================
-- Cette étape préserve toutes les demandes en retirant juste la référence à la commune
UPDATE demande 
SET demande_commune = NULL 
WHERE demande_commune IN (
    SELECT code_commu 
    FROM communes 
    WHERE nom_commun LIKE 'NOM%'
);

-- =====================================================
-- ÉTAPE 5 : Supprimer les communes qui commencent par "NOM"
-- =====================================================
-- Maintenant que les demandes sont mises à jour, on peut supprimer les communes
DELETE FROM communes 
WHERE nom_commun LIKE 'NOM%';

-- =====================================================
-- ÉTAPE 6 : Vérification finale
-- =====================================================
-- Vérifier qu'il ne reste plus de communes commençant par "NOM"
SELECT COUNT(*) as communes_restantes
FROM communes 
WHERE nom_commun LIKE 'NOM%';
-- Le résultat devrait être 0

-- =====================================================
-- ÉTAPE 7 : VALIDATION OU ANNULATION
-- =====================================================
-- Si tout est correct, validez la transaction :
COMMIT;

-- OU si vous voulez annuler (décommentez cette ligne et commentez COMMIT ci-dessus) :
-- ROLLBACK;

-- =====================================================
-- NOTES IMPORTANTES :
-- =====================================================
-- 1. Les demandes seront préservées mais leur champ demande_commune sera NULL
-- 2. Cette opération est IRREVERSIBLE - assurez-vous de faire une sauvegarde avant
-- 3. Exécutez d'abord les requêtes de vérification (ÉTAPE 1 et 2) pour voir ce qui sera supprimé
-- 4. Le pattern 'NOM%' correspond à toutes les communes dont le nom commence par "NOM"
--    Si vous voulez être plus spécifique, utilisez par exemple 'NOM_%' ou 'NOM COMMUN%'
-- 5. La transaction (BEGIN/COMMIT) permet d'annuler toutes les modifications si nécessaire
