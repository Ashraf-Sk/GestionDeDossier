# Assets

Ce dossier contient les ressources statiques de l'application.

## Structure

```
assets/
├── icon.png           # Icône de l'application (1024x1024)
├── splash.png         # Écran de démarrage (1242x2436)
├── adaptive-icon.png  # Icône adaptative Android (1024x1024)
└── favicon.png        # Favicon web (48x48)
```

## Spécifications

### icon.png
- Taille : 1024x1024 pixels
- Format : PNG avec transparence
- Utilisation : Icône principale de l'application

### splash.png
- Taille : 1242x2436 pixels (iPhone 11 Pro Max)
- Format : PNG
- Utilisation : Écran de démarrage lors du lancement

### adaptive-icon.png
- Taille : 1024x1024 pixels
- Format : PNG avec transparence
- Zone de sécurité : cercle de 640px de diamètre au centre
- Utilisation : Icône adaptative Android

### favicon.png
- Taille : 48x48 pixels
- Format : PNG
- Utilisation : Favicon pour la version web

## Génération des Assets

Pour générer automatiquement tous les assets nécessaires à partir d'une image source :

```bash
expo optimize
```

## Notes

- Les assets actuels sont des placeholders
- Remplacer avec vos propres designs avant publication
- Respecter les guidelines iOS et Android
- Tester sur différents devices pour vérifier le rendu
