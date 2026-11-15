# Ajout d'un Mode "Petit Astronaute" (Histoire Interactive 4-10 ans)

Veuillez analyser le composant gérant la sélection des modes de jeu et implémenter un tout nouveau mode destiné aux jeunes enfants (environ 4 à 10 ans). Voici les directives précises :

## 1. Ajout du Bouton dans l'UI
- Localisez l'interface où l'utilisateur choisit entre les modes "Cadet" et "Engineer Kids".
- Ajoutez un troisième bouton à côté, intitulé "Petit Astronaute" (ou "Space Kids").
- Rendez ce bouton visuellement distinct et attractif pour les enfants (par exemple, en utilisant une icône de fusée ou d'étoile, et des coins très arrondis).

## 2. Gameplay : Histoire Interactive et Ultra-Simplifiée
- Ce mode doit être complètement isolé de la complexité des autres modes. Masquez ou supprimez toutes les jauges techniques complexes (masse, delta-v, types de carburant).
- Transformez l'assemblage de la fusée en une **histoire interactive étape par étape**.
- **Mécanique attendue :** 
  - Introduction par un personnage/mascotte amical (ex: "Salut ! Je veux explorer l'espace. Peux-tu m'aider à construire ma fusée ?").
  - L'enfant est guidé pas à pas : "Choisis un moteur pour qu'on puisse décoller !" -> L'enfant clique sur un moteur -> "Bravo ! Maintenant, il nous faut un cockpit pour nous asseoir.".
  - Les choix doivent être limités à 2 ou 3 pièces simples et très visuelles à chaque étape.

## 3. Design Enfantin et Ludique
- **Typographie et Tailles :** Utilisez des textes beaucoup plus gros, des phrases très courtes et simples. Agrandissez les zones de clic (boutons et pièces de la fusée) pour faciliter l'interaction des petites mains.
- **Animations et Feedbacks :** Ajoutez des micro-interactions joyeuses. Lorsqu'une pièce est ajoutée, déclenchez une animation amusante (effet de rebond, petites étoiles, ou confettis) et un message d'encouragement ("Super !", "Génial !").
- **Couleurs :** Tout en gardant la palette globale du projet, mettez fortement en valeur les couleurs d'accentuation (comme le orange/jaune) pour rendre l'interface plus chaleureuse, ludique et moins "sérieuse".

## 4. Livrables et Instructions Techniques
- Créez un nouveau composant parent dédié (ex: `KidsStoryMode`) pour gérer l'état de ce mode spécifique sans polluer la logique des modes "Cadet" et "Engineer".
- Fournissez le code de mise à jour du menu de sélection pour inclure ce nouveau bouton.
- Fournissez un brouillon fonctionnel de la première étape de l'histoire (le composant avec la mascotte et la première instruction).