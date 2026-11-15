# Refonte UI/UX, Suppression de l'Audio et Tests Globaux

Veuillez analyser le code source de ce projet et appliquer les modifications séquentielles suivantes :

## 1. Suppression totale du son
- Identifiez et supprimez toutes les balises audio, les appels à l'API Web Audio, et les dépendances gérant le son.
- Retirez tous les fichiers audios des dossiers d'assets.
- Nettoyez les composants de tout état (state) ou logique liés au contrôle du volume, au mute ou à la lecture d'effets sonores.

## 2. Intégration de la nouvelle charte graphique
Mettez à jour les fichiers de style globaux (CSS, SCSS ou configuration Tailwind) en appliquant strictement ce Design System[cite: 1] :
- **Typographie :** Utilisez "Orbitron" ou une police de type "Mono" pour l'ensemble des textes (Display, Headings, Paragraphs, Buttons)[cite: 1].
- **Couleurs Primaires :** `#001D3A` et `#0B1B2A` (à privilégier pour les fonds foncés ou les textes majeurs)[cite: 1].
- **Couleurs Secondaires :** `#00D2FF` et `#0099FF`[cite: 1].
- **Couleurs d'Accentuation :** `#FF9900` et `#FFAD00` (idéal pour les Call-to-Action)[cite: 1].
- **Tons de Personnage (Character Tone) :** `#C68B59` et `#D49B6A`[cite: 1].
- **Neutre :** `#FFFFFF`[cite: 1].
- **Styles et Effets :** Appliquez des ombres portées (Drop Shadow avec une opacité de 10% à 20%) sur les conteneurs, et un effet de lueur (Glow / Outer Shadow) "Neon Cyan" (`#00D2FF`) sur les éléments actifs ou interactifs[cite: 1].

## 3. Simplification de l'application
- Épurez l'interface utilisateur (UI) : supprimez les bordures inutiles, augmentez les marges (whitespace) et retirez les éléments visuels non essentiels pour un rendu minimaliste.
- Simplifiez l'arborescence des composants (UX/Code) en fusionnant les vues redondantes et en éliminant le code mort laissé par la suppression de l'audio et des anciens styles.

## 4. Tests exhaustifs
- Une fois le refactoring terminé, écrivez ou mettez à jour les tests unitaires et d'intégration pour couvrir l'ensemble des fonctionnalités restantes de l'application.
- Simulez les parcours utilisateurs pour garantir que l'application ne plante pas suite au retrait des modules audios.
- Fournissez-moi un résumé des tests exécutés et corrigez les éventuelles erreurs rencontrées.