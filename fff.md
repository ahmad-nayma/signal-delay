# Refonte UX/UI et Animations pour les modes Cadet et Engineer

Veuillez analyser l'interface actuelle des modes "Cadet" et "Engineer" et appliquer une simplification radicale de l'UI/UX, tout en rendant l'expérience globale de l'application beaucoup plus dynamique et animée. Voici les directives :

## 1. Simplification Radicale de l'UI/UX
- **Mode Cadet (Débutant) :** Réduisez la charge cognitive au strict minimum. L'interface doit être ultra-visuelle et directe. Cachez les statistiques complexes derrière des infobulles (tooltips) ou remplacez-les par des indicateurs visuels simples (ex: jauges de couleur basiques, icônes de validation). Privilégiez des interactions intuitives pour la sélection et l'ajout des pièces de la fusée.
- **Mode Engineer (Avancé) :** Bien que ce mode nécessite des données techniques (masse, delta-v, etc.), l'interface doit être massivement épurée. Regroupez les données d'ingénierie dans des panneaux latéraux rétractables (collapsible panels) ou des onglets clairs. L'écran principal doit rester concentré sur la visualisation de la fusée.
- **Ergonomie globale :** Supprimez les bordures inutiles, augmentez l'espace blanc (whitespace) pour faire respirer le design, et réduisez le nombre de clics nécessaires pour valider une configuration.

## 2. Intégration d'Animations (Motion Design)
- **Micro-interactions :** Ajoutez des effets de survol (hover) fluides sur tous les éléments cliquables et les pièces de la fusée (ex: léger effet de zoom, changement subtil d'opacité, ou lueur néon au survol).
- **Animations d'assemblage :** Lorsque l'utilisateur ajoute, retire ou modifie une pièce sur la fusée, implémentez une animation fluide. La pièce doit glisser et s'emboîter ("snap") avec un effet élastique naturel, au lieu d'apparaître instantanément.
- **Transitions d'interface :** Animez les changements d'écrans, l'ouverture des panneaux latéraux et les changements de langue avec des fondus enchaînés ou des glissements (slide in/out) pour éviter les coupures brutales.
- **Feedback visuel :** Ajoutez des effets gratifiants lors de la validation d'une étape de conception ou lors du lancement (ex: vibrations visuelles, particules, ou ondes de choc légères).

## 3. Livrables et Instructions Techniques
- Recommandez et intégrez la méthode d'animation la plus adaptée au framework du projet (ex: Framer Motion pour React, GSAP, ou transitions CSS natives).
- Fournissez le code des nouveaux layouts simplifiés pour les composants `CadetMode` et `EngineerMode`.
- Donnez des exemples de code précis montrant comment vous avez implémenté l'animation d'assemblage des pièces en temps réel.