-- ============================================
-- REQUÊTES POSTGRESQL POUR TESTER LA COMMUNE
-- ============================================

-- 1. Vérifier toutes les demandes avec leur commune
-- Cette requête simule ce que fait le backend lors du track
SELECT 
    d.id AS demande_id,
    d.cin,
    d.type_autorisation,
    d.status,
    d.demande_commune AS code_commune,
    c.nom_commun AS nom_commune,
    CASE 
        WHEN d.demande_commune IS NULL THEN '❌ demande_commune est NULL'
        WHEN c.code_commu IS NULL THEN '❌ Code commune "' || d.demande_commune || '" n''existe pas'
        WHEN c.nom_commun IS NULL THEN '❌ nom_commun est NULL'
        ELSE '✅ Commune trouvée: ' || c.nom_commun
    END AS statut_commune
FROM demande d
LEFT JOIN communes c ON c.code_commu = d.demande_commune
ORDER BY d.creé_le DESC
LIMIT 10;

-- 2. Vérifier les demandes SANS commune (problème potentiel)
SELECT 
    d.id AS demande_id,
    d.cin,
    d.demande_commune,
    d.type_autorisation,
    d.creé_le
FROM demande d
WHERE d.demande_commune IS NULL
ORDER BY d.creé_le DESC;

-- 3. Vérifier les demandes avec une commune qui n'existe pas dans la table communes
SELECT 
    d.id AS demande_id,
    d.cin,
    d.demande_commune AS code_commune_inexistant,
    d.type_autorisation
FROM demande d
LEFT JOIN communes c ON c.code_commu = d.demande_commune
WHERE d.demande_commune IS NOT NULL 
  AND c.code_commu IS NULL;

-- 4. Vérifier une demande spécifique (remplacez DEM49332e92 par votre ID de demande)
SELECT 
    d.id AS demande_id,
    d.cin,
    d.type_autorisation,
    d.status,
    d.demande_commune AS code_commune,
    c.code_commu AS code_commune_verifie,
    c.nom_commun AS nom_commune,
    CASE 
        WHEN d.demande_commune IS NULL THEN '❌ Pas de commune assignée'
        WHEN c.code_commu IS NULL THEN '❌ Code commune invalide: ' || d.demande_commune
        WHEN c.nom_commun IS NULL THEN '❌ Commune trouvée mais nom_commun est NULL'
        ELSE '✅ Commune OK: ' || c.nom_commun
    END AS diagnostic
FROM demande d
LEFT JOIN communes c ON c.code_commu = d.demande_commune
WHERE d.id = 'DEM49332e92';  -- ← Remplacez par votre ID de demande

-- 5. Vérifier toutes les communes disponibles
SELECT 
    code_commu,
    nom_commun,
    CASE 
        WHEN nom_commun IS NULL OR nom_commun = '' THEN '❌ Nom vide'
        ELSE '✅ OK'
    END AS statut
FROM communes
ORDER BY nom_commun
LIMIT 20;

-- 6. Compter les demandes par commune
SELECT 
    c.nom_commun AS commune,
    COUNT(d.id) AS nombre_demandes,
    CASE 
        WHEN c.nom_commun IS NULL THEN '❌ Communes non trouvées'
        ELSE '✅ OK'
    END AS statut
FROM demande d
LEFT JOIN communes c ON c.code_commu = d.demande_commune
GROUP BY c.nom_commun
ORDER BY nombre_demandes DESC;

-- 6b. DIAGNOSTIC DÉTAILLÉ des demandes sans commune (pour les 4 demandes trouvées)
SELECT 
    d.id AS demande_id,
    d.cin,
    d.type_autorisation,
    d.demande_commune AS code_commune_dans_demande,
    d.creé_le AS date_creation,
    CASE 
        WHEN d.demande_commune IS NULL THEN '❌ ERREUR: demande_commune est NULL dans la table demande'
        WHEN c.code_commu IS NULL THEN '❌ ERREUR: Le code commune "' || d.demande_commune || '" n''existe pas dans la table communes'
        WHEN c.nom_commun IS NULL OR c.nom_commun = '' THEN '❌ ERREUR: Le code commune existe mais nom_commun est NULL ou vide'
        ELSE '✅ OK'
    END AS diagnostic,
    c.code_commu AS code_commune_verifie,
    c.nom_commun AS nom_commune_trouve
FROM demande d
LEFT JOIN communes c ON c.code_commu = d.demande_commune
WHERE c.nom_commun IS NULL  -- Les demandes sans commune trouvée
ORDER BY d.creé_le DESC;

-- 7. Test de recherche de commune par coordonnées (simule calculateIntersection)
-- Remplacez les coordonnées par celles de votre test
SELECT 
    c.code_commu,
    c.nom_commun,
    ST_Area(ST_Intersection(c.geom, ST_SetSRID(ST_MakePoint(-7.5898, 33.5731), 4326))) AS area_intersection
FROM communes c
WHERE ST_Intersects(c.geom, ST_SetSRID(ST_MakePoint(-7.5898, 33.5731), 4326))
ORDER BY ST_Area(ST_Intersection(c.geom, ST_SetSRID(ST_MakePoint(-7.5898, 33.5731), 4326))) DESC
LIMIT 1;

-- 8. Vérifier la structure de la table communes
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'communes'
ORDER BY ordinal_position;

-- 9. Vérifier la structure de la table demande (colonne demande_commune)
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'demande' 
  AND column_name LIKE '%commune%';

-- 10. Diagnostic complet pour une demande récente
SELECT 
    d.id,
    d.cin,
    d.type_autorisation,
    d.demande_commune,
    c.code_commu AS commune_code_verifie,
    c.nom_commun AS commune_nom,
    d.creé_le,
    CASE 
        WHEN d.demande_commune IS NULL THEN '❌ ERREUR: demande_commune est NULL'
        WHEN c.code_commu IS NULL THEN '❌ ERREUR: Code commune ' || d.demande_commune || ' n''existe pas dans communes'
        WHEN c.nom_commun IS NULL OR c.nom_commun = '' THEN '❌ ERREUR: nom_commun est NULL ou vide'
        ELSE '✅ OK: ' || c.nom_commun
    END AS diagnostic_complet
FROM demande d
LEFT JOIN communes c ON c.code_commu = d.demande_commune
WHERE d.id IN (
    SELECT id FROM demande ORDER BY creé_le DESC LIMIT 5
)
ORDER BY d.creé_le DESC;

-- ============================================
-- CORRECTION : Mettre à jour les noms de communes manquants
-- ============================================

-- 11. Voir les communes avec nom_commun NULL ou vide
SELECT 
    code_commu,
    nom_commun,
    CASE 
        WHEN nom_commun IS NULL THEN '❌ nom_commun est NULL'
        WHEN nom_commun = '' THEN '❌ nom_commun est vide'
        ELSE '✅ OK'
    END AS statut
FROM communes
WHERE code_commu IN ('01.511.00.01.', '06.141.00.01.')
   OR nom_commun IS NULL 
   OR nom_commun = ''
ORDER BY code_commu;

-- 12. Mettre à jour les noms de communes (EXÉCUTEZ APRÈS AVOIR VÉRIFIÉ)
-- ⚠️ ATTENTION : Remplacez les noms par les vrais noms de vos communes
-- Décommentez et modifiez les noms selon vos données réelles
/*
UPDATE communes 
SET nom_commun = 'Nom de la commune 01.511.00.01.' 
WHERE code_commu = '01.511.00.01.' AND (nom_commun IS NULL OR nom_commun = '');

UPDATE communes 
SET nom_commun = 'Nom de la commune 06.141.00.01.' 
WHERE code_commu = '06.141.00.01.' AND (nom_commun IS NULL OR nom_commun = '');
*/

-- 13. Vérifier après correction
SELECT 
    d.id AS demande_id,
    d.demande_commune,
    c.nom_commun AS nom_commune,
    CASE 
        WHEN c.nom_commun IS NULL OR c.nom_commun = '' THEN '❌ Toujours NULL ou vide'
        ELSE '✅ Corrigé: ' || c.nom_commun
    END AS statut
FROM demande d
LEFT JOIN communes c ON c.code_commu = d.demande_commune
WHERE d.demande_commune IN ('01.511.00.01.', '06.141.00.01.');

-- ============================================
-- SUPPRESSION : Supprimer les communes problématiques
-- ============================================

-- 14. ⚠️ VÉRIFIER AVANT SUPPRESSION : Voir quelles communes seront supprimées
SELECT 
    c.code_commu,
    c.nom_commun,
    COUNT(d.id) AS nombre_demandes_referencees,
    CASE 
        WHEN COUNT(d.id) > 0 THEN '⚠️ ATTENTION: Cette commune est référencée par ' || COUNT(d.id) || ' demande(s)'
        ELSE '✅ Peut être supprimée (aucune référence)'
    END AS avertissement
FROM communes c
LEFT JOIN demande d ON d.demande_commune = c.code_commu
WHERE (c.nom_commun IS NULL OR c.nom_commun = '')
   OR c.code_commu IN ('01.511.00.01.', '06.141.00.01.')
GROUP BY c.code_commu, c.nom_commun
ORDER BY nombre_demandes_referencees DESC;

-- 15a. ÉTAPE 1 : Mettre à jour les demandes pour mettre demande_commune à NULL
-- ⚠️ EXÉCUTEZ CETTE REQUÊTE EN PREMIER pour éviter l'erreur de clé étrangère
UPDATE demande 
SET demande_commune = NULL
WHERE demande_commune IN ('01.511.00.01.', '06.141.00.01.')
   OR demande_commune IN (
       SELECT code_commu FROM communes 
       WHERE nom_commun IS NULL OR nom_commun = ''
   );

-- 15b. ÉTAPE 2 : SUPPRIMER les communes avec nom_commun NULL ou vide ET les codes spécifiques
-- ⚠️ EXÉCUTEZ CETTE REQUÊTE APRÈS avoir mis à jour les demandes
DELETE FROM communes
WHERE (nom_commun IS NULL OR nom_commun = '')
   OR code_commu IN ('01.511.00.01.', '06.141.00.01.');

-- 16. Vérifier après suppression
SELECT 
    COUNT(*) AS nombre_communes_restantes,
    COUNT(CASE WHEN nom_commun IS NULL OR nom_commun = '' THEN 1 END) AS communes_sans_nom
FROM communes;

-- 17. Vérifier les demandes qui référencent des communes supprimées (devraient être NULL maintenant)
SELECT 
    d.id AS demande_id,
    d.demande_commune AS code_commune_inexistant,
    d.type_autorisation,
    d.creé_le
FROM demande d
LEFT JOIN communes c ON c.code_commu = d.demande_commune
WHERE d.demande_commune IS NOT NULL 
  AND c.code_commu IS NULL
ORDER BY d.creé_le DESC;
