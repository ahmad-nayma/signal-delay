# Refonte des fonctionnalités, Multilinguisme et Nettoyage du projet

Voici les nouvelles modifications que je souhaite apporter au code de l'application. Merci d'analyser les fichiers correspondants et de me fournir le code ou les instructions pour implémenter les points suivants :

## 1. Ajout d'un système de changement de langue (Anglais / Arabe)
- Implémente un bouton ou un menu déroulant permettant de basculer entre l'Anglais (par défaut) et l'Arabe.
- Mets en place une structure simple pour gérer les traductions (par exemple, un fichier JSON ou un objet de configuration contenant les textes).
- Assure-toi que la sélection de l'Arabe active automatiquement la direction du texte de droite à gauche (`dir="rtl"`) sur le conteneur principal ou la balise `<body>` pour respecter l'affichage de la langue.

## 2. Suppression de la section "Engineering Notebook"
- Identifie tous les fichiers, composants, routes et boutons de navigation liés au "Engineering Notebook".
- Supprime complètement ce code et retire toutes les références dans l'interface utilisateur pour qu'il n'y ait plus aucun accès à cette fonctionnalité.

## 3. Ajout d'un bouton "About" (À propos)
- Ajoute un bouton "About" visible dans le menu de navigation ou sur l'écran d'accueil.
- Au clic, ce bouton doit ouvrir une modale ou rediriger vers une section contenant :
  - Un lien direct vers notre propre repository GitHub.
  - La liste des membres de notre équipe (prévois un espace dans le code où je pourrai insérer nos noms).
  - Une brève description de notre version du projet.

## 4. Suppression totale des traces de l'auteur original (White-labeling)
- Recherche dans l'ensemble du projet (y compris les fichiers `package.json`, `README.md`, `LICENSE`, balises `<meta>` dans l'HTML, et les commentaires du code) toutes les mentions de `shariar165` et `Shariar Ahmed`.
- Supprime ces mentions ou remplace-les par le nom de notre équipe/projet.
- Assure-toi qu'aucune URL, lien GitHub, ou droit d'auteur lié à l'auteur précédent ne subsiste dans le code source ou dans l'interface graphique.