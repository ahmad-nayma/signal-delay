// The French of the data's cited texts: real history, a target's "what we learn", postcard titles and captions,
// Rescue History, the Jupiter lesson, the rank jobs. Keyed by the exact English in src/data, so the data stays English
// and Sourced, and ⓘ keeps the English original with its source and link. A changed English text shows in English
// until it is translated again (tests/ui/i18n.test.tsx checks every key here still exists in the data).
export const CITED_FR: Readonly<Record<string, string>> = {
  // Danger cards: real history (hazards.json)
  '2001 Mars Odyssey: the MARIE radiation instrument stopped working when a large solar event hit the spacecraft on Oct. 28, 2003, and controllers could not restore it.':
    '2001 Mars Odyssey : l’instrument de mesure des radiations MARIE a cessé de fonctionner quand un grand événement solaire a frappé la sonde le 28 octobre 2003, et les contrôleurs n’ont pas pu le rétablir.',
  'In September 2017 a strong CME reached Mars. MAVEN saw a global aurora, and the radiation Curiosity measured at the surface was more than double any level it had seen before.':
    'En septembre 2017, une forte éjection de masse coronale a atteint Mars. MAVEN a vu une aurore sur toute la planète, et les radiations mesurées en surface par Curiosity étaient plus du double de tout ce qu’il avait vu auparavant.',
  'Mariner 9 reached Mars in November 1971 during a planet-wide dust storm and waited for the dust to clear before mapping. A global storm in 2018 ended the solar-powered Opportunity rover.':
    'Mariner 9 est arrivée à Mars en novembre 1971 pendant une tempête de poussière planétaire, et a attendu que la poussière retombe avant de cartographier. Une tempête globale en 2018 a mis fin au rover solaire Opportunity.',
  'Comet Siding Spring passed close to Mars on Oct. 19, 2014. MAVEN, MRO and Mars Odyssey took shelter behind Mars during the period of risk from its dust.':
    'La comète Siding Spring est passée près de Mars le 19 octobre 2014. MAVEN, MRO et Mars Odyssey se sont abrités derrière Mars pendant la période à risque de sa poussière.',
  'Kepler lost one reaction wheel in 2012 and a second in 2013. Engineers found a new way to point it using sunlight pressure, which became the K2 mission.':
    'Kepler a perdu une roue de réaction en 2012 et une deuxième en 2013. Les ingénieurs ont trouvé une nouvelle façon de le pointer grâce à la pression de la lumière du Soleil : ce fut la mission K2.',
  "In February 2013 Curiosity's main computer had a memory problem, and the team switched the rover to its backup computer. From November 2023 a failed memory chip garbled Voyager 1's data until engineers moved the code in April 2024; each command took about 22.5 hours to arrive.":
    'En février 2013, l’ordinateur principal de Curiosity a eu un problème de mémoire, et l’équipe a basculé le rover sur son ordinateur de secours. À partir de novembre 2023, une puce mémoire défaillante a brouillé les données de Voyager 1 jusqu’à ce que les ingénieurs déplacent le code en avril 2024 ; chaque commande mettait environ 22,5 heures à arriver.',
  "In 2016 Juno's main-engine helium valves did not work as expected. NASA kept Juno in its 53-day orbit instead of firing the engine again to reach the planned 14-day orbit.":
    'En 2016, les valves d’hélium du moteur principal de Juno n’ont pas fonctionné comme prévu. La NASA a gardé Juno sur son orbite de 53 jours au lieu de rallumer le moteur pour atteindre l’orbite prévue de 14 jours.',
  "Juno carries its electronics in a titanium radiation vault, and its orbits were planned to limit the dose from Jupiter's radiation belts.":
    'Juno protège son électronique dans un coffre anti-radiations en titane, et ses orbites ont été planifiées pour limiter la dose reçue des ceintures de radiations de Jupiter.',
  'Mars Global Surveyor began aerobraking in 1997 with a solar panel that had not latched properly. When the panel moved past its deployed position, the team raised the periapsis from 110 to about 172 km, paused for about a month, then went on more gently at 120 km, finishing in February 1999.':
    'Mars Global Surveyor a commencé son aérofreinage en 1997 avec un panneau solaire mal verrouillé. Quand le panneau a dépassé sa position déployée, l’équipe a remonté le périapside de 110 à environ 172 km, a fait une pause d’environ un mois, puis a repris plus doucement à 120 km, pour finir en février 1999.',

  // The old crisis cards: real history (crisisCards.json)
  'Mars Climate Orbiter, 1999: one team used English units, the other metric, for a key spacecraft operation, and the craft was lost.':
    'Mars Climate Orbiter, 1999 : pour une opération clé de la sonde, une équipe utilisait les unités anglo-saxonnes et l’autre le système métrique, et la sonde a été perdue.',
  'Genesis, 2004: its deceleration sensors had been installed incorrectly, so the parachute never opened and the capsule crashed.':
    'Genesis, 2004 : ses capteurs de décélération avaient été mal installés, donc le parachute ne s’est jamais ouvert et la capsule s’est écrasée.',
  'Mars Polar Lander, 1999: most likely a false signal that it had landed shut its engines off too early.':
    'Mars Polar Lander, 1999 : très probablement un faux signal d’atterrissage a coupé ses moteurs trop tôt.',
  'Spirit rover, 2004: too many files filled flash memory and caused reboots; fixed from Earth.':
    'Rover Spirit, 2004 : trop de fichiers ont rempli la mémoire flash et provoqué des redémarrages ; réparé depuis la Terre.',
  'SOHO, 1998: lost attitude control and contact; recovered months later.':
    'SOHO, 1998 : perte du contrôle d’attitude et du contact ; récupérée des mois plus tard.',
  'Solar particle events can trigger spacecraft safe mode.': 'Les événements de particules solaires peuvent déclencher le mode sécurité d’une sonde.',

  // Science targets: what we learn (targets.json, moonTargets.json)
  'How a volcano grows about 2.5 times taller than Everest.': 'Comment un volcan devient environ 2,5 fois plus haut que l’Everest.',
  'A canyon over 3,000 km long and 8 km deep, and what tore it open.': 'Un canyon de plus de 3 000 km de long et 8 km de profondeur, et ce qui l’a ouvert.',
  'Ice cut by spiral troughs that show its layers, a record of Mars weather.': 'De la glace creusée de sillons en spirale qui montrent ses couches, une archive de la météo martienne.',
  'Grooves and landslides on a moon slowly falling toward Mars.': 'Des sillons et des glissements de terrain sur une lune qui tombe lentement vers Mars.',
  'Why the smaller moon looks smoothed over, as if with sand.': 'Pourquoi la plus petite lune semble lissée, comme recouverte de sable.',
  'How the thin air is stacked in layers of ice cloud and dust.': 'Comment l’air ténu s’empile en couches de nuages de glace et de poussière.',
  'Where people first walked on another world. Their footpaths still show from orbit.':
    'Là où des humains ont marché pour la première fois sur un autre monde. Leurs traces se voient encore depuis l’orbite.',
  'A young crater, about 110 million years old. Its bright rays reach across the near side.':
    'Un jeune cratère, d’environ 110 millions d’années. Ses rayons brillants traversent la face visible.',
  'The south pole is on its rim. Its floor never sees the Sun, and may hold frozen water.':
    'Le pôle Sud est sur son bord. Son fond ne voit jamais le Soleil et pourrait contenir de l’eau gelée.',
  'A crater 185 km wide on the far side, which Earth never sees. Dark lava flooded its floor.':
    'Un cratère de 185 km de large sur la face cachée, que la Terre ne voit jamais. De la lave sombre a inondé son fond.',

  // Postcards: titles and captions (postcards.json)
  Earthrise: 'Lever de Terre',
  'NASA’s Lunar Reconnaissance Orbiter took this picture of Earth from its orbit around the Moon.':
    'Le Lunar Reconnaissance Orbiter de la NASA a pris cette photo de la Terre depuis son orbite autour de la Lune.',
  'Sunrise on Tycho': 'Lever de Soleil sur Tycho',
  'Sunrise on the central peak of Tycho crater, seen by the Lunar Reconnaissance Orbiter. Tycho is about 82 km wide, and its peak rises about 2 km above the crater floor.':
    'Lever de Soleil sur le pic central du cratère Tycho, vu par le Lunar Reconnaissance Orbiter. Tycho mesure environ 82 km de large, et son pic s’élève d’environ 2 km au-dessus du fond du cratère.',
  'Apollo 11, from above': 'Apollo 11, vu d’en haut',
  'The Apollo 11 landing site, seen by the Lunar Reconnaissance Orbiter in 2009. The labels mark the Eagle lander’s descent stage and the experiments the astronauts left behind.':
    'Le site d’atterrissage d’Apollo 11, vu par le Lunar Reconnaissance Orbiter en 2009. Les étiquettes indiquent l’étage de descente du module Eagle et les expériences laissées par les astronautes.',
  'The whole red planet': 'Toute la planète rouge',
  'Mars from space: the white north polar cap at the top and the giant canyon Valles Marineris across the middle.':
    'Mars vue de l’espace : la calotte polaire nord blanche en haut et le canyon géant Valles Marineris en travers.',
  'Dunes on the move': 'Des dunes en mouvement',
  'Nili Patera is one of the most active dune fields on Mars. The HiRISE camera on Mars Reconnaissance Orbiter takes a new picture of it about every six weeks.':
    'Nili Patera est l’un des champs de dunes les plus actifs de Mars. La caméra HiRISE de Mars Reconnaissance Orbiter en prend une nouvelle photo environ toutes les six semaines.',
  'Victoria Crater': 'Le cratère Victoria',
  'Victoria Crater, seen at a sideways angle by HiRISE on Mars Reconnaissance Orbiter. The Opportunity rover explored this crater from its rim.':
    'Le cratère Victoria, vu de biais par HiRISE sur Mars Reconnaissance Orbiter. Le rover Opportunity a exploré ce cratère depuis son bord.',
  'Venus without clouds': 'Vénus sans nuages',
  'The surface of Venus, mapped by the Magellan spacecraft’s radar, which sees through the thick clouds.':
    'La surface de Vénus, cartographiée par le radar de la sonde Magellan, qui voit à travers les épais nuages.',
  'Maat Mons': 'Maat Mons',
  'Maat Mons, a giant volcano on Venus, in a 3-D view made from Magellan data.': 'Maat Mons, un volcan géant de Vénus, en vue 3D réalisée à partir des données de Magellan.',
  Coronae: 'Coronae',
  'Two coronae, huge round structures on Venus, mapped by Magellan. Bahet Corona, on the left, is about 230 km long.':
    'Deux coronae, d’immenses structures rondes sur Vénus, cartographiées par Magellan. Bahet Corona, à gauche, mesure environ 230 km de long.',
  'Bennu up close': 'Bennu de près',
  'A patch of asteroid Bennu about 180 m wide: rocks, big boulders and a smooth “pond” of fine material, seen by OSIRIS-REx’s cameras.':
    'Une zone de l’astéroïde Bennu d’environ 180 m de large : des roches, de gros blocs et une « mare » lisse de matériau fin, vus par les caméras d’OSIRIS-REx.',
  'Home with a sample': 'De retour avec un échantillon',
  'September 24, 2023: the OSIRIS-REx sample capsule has just landed in the Utah desert, with rocks and dust from asteroid Bennu inside.':
    '24 septembre 2023 : la capsule d’échantillons d’OSIRIS-REx vient de se poser dans le désert de l’Utah, avec des roches et de la poussière de l’astéroïde Bennu à l’intérieur.',
  'A piece of Bennu': 'Un morceau de Bennu',
  'A piece of asteroid Bennu, brought to Earth by OSIRIS-REx, set into a microscope slide at NASA Goddard.':
    'Un morceau de l’astéroïde Bennu, rapporté sur Terre par OSIRIS-REx, monté sur une lame de microscope au centre Goddard de la NASA.',

  // Rescue History, Mars Climate Orbiter: what happened, the clues and the failure report (rescueCases.json)
  'Lost on arrival at Mars on Sept. 23, 1999. Ground software used English units while onboard software worked in metric; the error sent the spacecraft too close to Mars.':
    'Perdue à l’arrivée sur Mars le 23 septembre 1999. Le logiciel au sol utilisait les unités anglo-saxonnes alors que le logiciel de bord travaillait en métrique ; l’erreur a envoyé la sonde trop près de Mars.',
  'Lopsided solar wing': 'Aile solaire déséquilibrée',
  'The solar array sat on one side of the craft. Sunlight pushed on it, so small thrusters fired far more often than the navigators expected to keep the craft steady.':
    'Le panneau solaire était d’un seul côté de la sonde. La lumière du Soleil poussait dessus, donc de petits propulseurs s’allumaient bien plus souvent que prévu par les navigateurs pour la garder stable.',
  'Real, and it made things worse: more firings meant the error grew faster. But each firing was logged. The bug was in how the pushes were written down.':
    'Vrai, et ça a aggravé les choses : plus d’allumages, c’était une erreur qui grandissait plus vite. Mais chaque allumage était enregistré. Le bug était dans la façon de noter les poussées.',
  "Angular momentum desaturation (AMD) events happened 10-14 times more often than the navigation team expected, because MCO's solar array was asymmetrical.":
    'Les désaturations du moment cinétique (AMD) se produisaient 10 à 14 fois plus souvent que prévu par l’équipe de navigation, parce que le panneau solaire de MCO était asymétrique.',
  'Thruster-firing file': 'Fichier des allumages de propulseurs',
  "After every small thruster firing, the spacecraft team's software wrote down how hard the thrusters pushed, and sent the file to the navigators in another state.":
    'Après chaque petit allumage des propulseurs, le logiciel de l’équipe de la sonde notait la force de la poussée et envoyait le fichier aux navigateurs, dans un autre État.',
  'Found it! The file gave each push in pound-force seconds, but the navigators read the numbers as newton-seconds.':
    'Trouvé ! Le fichier donnait chaque poussée en livres-force secondes, mais les navigateurs lisaient les nombres comme des newtons-secondes.',
  'The SM_FORCES software was required to give its output in newton-seconds (N·s). Instead the data in the Angular Momentum Desaturation (AMD) file was in pound-force seconds (lbf·s).':
    'Le logiciel SM_FORCES devait donner ses résultats en newtons-secondes (N·s). Au lieu de cela, les données du fichier de désaturation du moment cinétique (AMD) étaient en livres-force secondes (lbf·s).',
  'Skipped safety burn': 'Manœuvre de sécurité annulée',
  'A last-chance course correction (TCM-5) was ready to raise the craft if it came in too low. It was discussed just before arrival, but never done.':
    'Une correction de trajectoire de dernière chance (TCM-5) était prête pour remonter la sonde si elle arrivait trop bas. Elle a été discutée juste avant l’arrivée, mais jamais exécutée.',
  'Real, and it might have saved the craft at the last minute. But it would only have patched the symptom: the bad data was still there.':
    'Vrai, et elle aurait pu sauver la sonde à la dernière minute. Mais elle n’aurait corrigé que le symptôme : les mauvaises données étaient toujours là.',
  'A request to perform TCM-5 was discussed verbally shortly before the orbit insertion procedure began, but was never executed.':
    'Une demande d’effectuer TCM-5 a été discutée oralement peu avant le début de la procédure d’insertion en orbite, mais n’a jamais été exécutée.',
  'Busy navigators': 'Navigateurs débordés',
  'The navigation team was looking after three missions at the same time, so very few people were watching this one.':
    'L’équipe de navigation s’occupait de trois missions en même temps, donc très peu de personnes surveillaient celle-ci.',
  'Real, and it made the mistake harder to catch. But the navigators were working with numbers that were wrong from the start.':
    'Vrai, et ça a rendu l’erreur plus difficile à repérer. Mais les navigateurs travaillaient avec des nombres faux dès le départ.',
  'The operations project was running three missions at once (Mars Global Surveyor, Mars Climate Orbiter, Mars Polar Lander); MCO navigation was handled by the navigation team lead and the MCO navigator.':
    'Le projet d’opérations menait trois missions à la fois (Mars Global Surveyor, Mars Climate Orbiter, Mars Polar Lander) ; la navigation de MCO était assurée par le chef de l’équipe de navigation et le navigateur de MCO.',

  // The Jupiter lesson (lessons.json)
  'Borrow speed from a planet': 'Emprunter de la vitesse à une planète',
  "No rocket of its day could throw Juno straight to Jupiter. Juno launched on an Atlas V on Aug. 5, 2011, flew back past Earth 26 months later to pick up speed from Earth's gravity (a gravity assist), and reached Jupiter on July 4, 2016.":
    'Aucune fusée de l’époque ne pouvait lancer Juno directement vers Jupiter. Juno a décollé sur une Atlas V le 5 août 2011, est repassée près de la Terre 26 mois plus tard pour gagner de la vitesse grâce à sa gravité (une assistance gravitationnelle), et a atteint Jupiter le 4 juillet 2016.',

  // Ranks: the real jobs (ranks.json)
  'A trainee in Mission Control, learning how robots in deep space stay alive.':
    'Un stagiaire au Contrôle de mission, qui apprend comment les robots restent en vie dans l’espace lointain.',
  'In NASA Mission Control, each flight controller watches one part of the spacecraft, such as power or communications, from a console.':
    'Au Contrôle de mission de la NASA, chaque contrôleur de vol surveille une partie de la sonde, comme l’énergie ou les communications, depuis une console.',
  'CAPCOM, the capsule communicator: on crewed flights, the one person in Mission Control who talks to the astronauts.':
    'CAPCOM, le communicateur capsule : sur les vols habités, la seule personne du Contrôle de mission qui parle aux astronautes.',
  'The flight director leads the Mission Control team and makes the final call on every decision.':
    'Le directeur de vol dirige l’équipe du Contrôle de mission et a le dernier mot sur chaque décision.',
  'Every star in the game. Mission Control will tell stories about you.': 'Toutes les étoiles du jeu. Le Contrôle de mission racontera votre histoire.',
};
