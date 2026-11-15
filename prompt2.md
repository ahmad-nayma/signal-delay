# Refonte de l'interface et nettoyage des langues

Je souhaite modifier le code de ce projet pour retirer certaines langues et moderniser l'interface graphique. Voici les tâches exactes à effectuer :

## 1. Suppression de la langue indienne
- Identifie tous les fichiers de traduction, variables, ou fichiers de configuration (comme les dossiers `locales`, fichiers `.json`, ou textes codés en dur) liés aux langues indiennes (ex: Hindi).
- Supprime ces ressources et retire l'option de cette langue dans les menus ou sélecteurs de l'interface.
- Nettoie le code pour t'assurer qu'il n'y a plus d'erreurs de type "traduction manquante" et que l'application bascule proprement sur la langue par défaut.

## 2. Simplification des polices d'écriture (Fonts)
- Remplace les polices actuelles par une typographie plus simple, épurée et moderne, de type "sans-serif" (par exemple : `Inter`, `Roboto`, ou la police système par défaut).
- Mets à jour les fichiers de style globaux (`.css`, `.scss`, ou la configuration Tailwind/Bootstrap) pour appliquer cette nouvelle police à l'ensemble du projet.

## 3. Modification de la palette de couleurs (Thème Bleu)
- Change les couleurs du projet pour adopter un thème à dominante bleue.
- Définis une hiérarchie claire : un bleu primaire pour les boutons et éléments interactifs, un fond clair (blanc ou bleu très pâle), et des nuances de bleu foncé ou gris/noir pour garantir un bon contraste du texte.
- Mets à jour toutes les variables de couleurs CSS ou les classes utilitaires qui utilisent l'ancien schéma de couleurs.

## 4. Instructions de retour
- Fournis-moi le code mis à jour pour les fichiers modifiés (CSS, configuration, composants UI).
- Explique brièvement quels fichiers ont été touchés pour que je puisse appliquer les changements facilement.