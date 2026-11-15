// French words for the Operations Console (i18n.ts): the same exports as opsWords.ts, in French.
// Words for the Operations Console (Cadet and Engineer). Numbers come from the engine (ops/console.ts) and are
// only formatted here, through format.ts. Event messages arrive as codes with values (spec: messages are data).
import type { ConsoleChip, ConsoleGauges, SignalState } from '../engine/ops/console';
import type { FailureEffect, OpsPhase } from '../engine/data';
import type { ResponseBlocker } from '../engine/ops/responses';
import type { ExtensionOption, OpsEvent } from '../engine/ops/types';
import type { MeterStatus } from '../engine/types';
import * as f from './format';

export const OPS_PHASE: Record<OpsPhase, string> = {
  launch: 'Lancement',
  cruise: 'Croisière',
  arrival: 'Arrivée',
  science: 'Orbite scientifique',
  return: 'Retour',
  extended: 'Mission prolongée',
};

export const CHIP: Record<ConsoleChip, { label: string; tone: MeterStatus }> = {
  nominal: { label: 'TOUS SYSTÈMES OK', tone: 'ok' },
  hazard: { label: 'DANGER · DÉCISION', tone: 'over' },
  'safe-mode': { label: 'MODE SÉCURITÉ', tone: 'warning' },
  'conjunction-soon': { label: 'CONJONCTION EN APPROCHE', tone: 'warning' },
  blackout: { label: 'AUCUN CONTACT', tone: 'over' },
  decision: { label: 'DÉCISION', tone: 'warning' },
  lost: { label: 'SONDE PERDUE', tone: 'over' },
  complete: { label: 'MISSION ACCOMPLIE', tone: 'ok' },
  'not-launched': { label: 'NON LANCÉE', tone: 'over' },
};

export const STATUS_LABEL: Record<MeterStatus, string> = { ok: 'OK', warning: 'ATTENTION', over: 'LIMITE DÉPASSÉE' };

export type GaugeKey = keyof ConsoleGauges;
export const GAUGE_NAME: Record<GaugeKey, { cadet: string; engineer: string }> = {
  power: { cadet: 'Batterie', engineer: 'Énergie du jour' },
  fuel: { cadet: 'Réservoir', engineer: 'Δv restant' },
  recorder: { cadet: 'Photos en attente', engineer: 'Enregistreur' },
  budget: { cadet: 'Budget d’opérations', engineer: 'Réserve budgétaire' },
};

/** The Cadet sentence under each gauge. */
function gaugeLineEn(k: GaugeKey, g: ConsoleGauges, destName: string): string {
  switch (k) {
    case 'power': {
      const p = g.power;
      if (p.status === 'over') return 'Pas assez d’énergie aujourd’hui : la sonde coupe des équipements.';
      if (p.status === 'warning') return 'Très peu d’énergie disponible aujourd’hui.';
      if (p.inEclipseSeason) return `En bonne santé. Se recharge après chaque passage dans l’ombre de ${destName}.`;
      return 'Plein soleil. Beaucoup d’énergie aujourd’hui.';
    }
    case 'fuel': {
      const x = g.fuel;
      if (x.status === 'over') return 'Pas assez de carburant pour les manœuvres prévues !';
      if (x.status === 'warning') return 'Assez pour les manœuvres à venir, avec une marge mince.';
      return 'Assez pour toutes les manœuvres prévues, avec du carburant en plus.';
    }
    case 'recorder': {
      const r = g.recorder;
      if (r.status === 'over') return 'Mémoire pleine : les nouvelles photos sont perdues.';
      if (r.daysToFull !== undefined && r.status === 'warning') return `Mémoire pleine dans environ ${f.num(r.daysToFull)} jours. Envoyez les photos ou ralentissez la science.`;
      if (r.photosWaiting < 1) return 'Tout est arrivé sur Terre.';
      return `Environ ${f.photos(r.photosWaiting)} photos attendent d’être envoyées.`;
    }
    case 'budget': {
      const b = g.budget;
      if (b.status === 'over') return 'Budget dépassé : les appels et réparations coûtent plus que la réserve.';
      if (b.status === 'warning') return 'La réserve est presque épuisée.';
      return 'Réserve pour les appels supplémentaires et les réparations.';
    }
  }
}
export const gaugeLine = gaugeLineEn;

export const SIGNAL_LINE: Record<SignalState, string> = {
  downlink: 'Photos et nouvelles en route vers la Terre',
  uplink: 'Votre commande est en route',
  blocked: 'Le Soleil bloque la radio',
  none: 'Silence radio',
};

export const BLOCKER: Record<ResponseBlocker, string> = {
  deltaV: 'Pas assez de carburant disponible',
  budget: 'Plus assez d’argent dans la réserve',
  scienceDays: 'Plus assez de jours de science',
  power: 'Pas assez d’énergie disponible aujourd’hui',
  'one-time': 'Déjà utilisé une fois dans cette mission',
};

export const FAILURE_EFFECT: Record<FailureEffect, string> = {
  craft: 'la sonde pourrait être perdue',
  instrument: 'un instrument pourrait casser',
  'stored-data': 'les photos à bord pourraient être effacées',
  'safe-mode': 'la sonde pourrait passer en mode sécurité',
};

export const RISK_WORD = ['', 'TRÈS FAIBLE', 'FAIBLE', 'MOYEN', 'ÉLEVÉ', 'TRÈS ÉLEVÉ'] as const;

/** A friendlier Cadet line for a response, where the data label is technical. */
export const OPTION_BLURB: Record<string, string> = {
  'solar-storm.shelter': 'Éteindre les instruments et attendre que ça passe.',
  'solar-storm.keep-observing': 'Mesurer la tempête de près. Un instrument pourrait être endommagé.',
  'cme-shock.safe-mode': 'Tout couper sauf l’essentiel jusqu’au passage du choc.',
  'cme-shock.keep-observing': 'Regarder le choc frapper Mars, comme MAVEN. Un instrument pourrait être endommagé.',
  'mars-dust-storm.raise-periapsis': 'Brûler un peu de carburant pour rester au-dessus de l’atmosphère qui gonfle.',
  'mars-dust-storm.wait-it-out': 'Arrêter les photos jusqu’à ce que la poussière retombe.',
  'mars-dust-storm.carry-on': 'Continuer comme prévu en espérant que l’air reste léger.',
  'debris.hide': 'Régler l’orbite pour que la planète vous protège.',
  'debris.edge-on': 'Mettre les panneaux de profil et fermer les instruments.',
  'debris.ignore': 'Ne rien faire et espérer que rien ne touche.',
  'reaction-wheel.thrusters': 'Pointer avec les propulseurs : coûte du carburant.',
  'reaction-wheel.hybrid': 'Apprendre à pointer avec les roues restantes.',
  'reaction-wheel.carry-on': 'Continuer avec les roues restantes.',
  'memory-corruption.backup-computer': 'Passer sur l’ordinateur de secours (une seule fois).',
  'memory-corruption.patch': 'Les ingénieurs écrivent un correctif et l’envoient.',
  'memory-corruption.reboot': 'L’éteindre et le rallumer.',
  'insertion-anomaly.trim-burn': 'Allumer les propulseurs pour terminer la capture.',
  'insertion-anomaly.accept-orbit': 'Garder l’orbite plus longue et changer le plan scientifique.',
  'insertion-anomaly.hold': 'Laisser la sonde se débrouiller seule.',
  'drag-heating.pop-up': 'Remonter le périapside maintenant',
  'drag-heating.stay-low': 'Rester bas et finir la photo',
};

export const EXTENSION_BLOCKER: Record<ExtensionOption['blockedBy'][number], string> = {
  deltaV: 'Pas assez de carburant pour les corrections d’orbite',
  power: 'Pas assez d’énergie à la fin',
  radiation: 'L’électronique recevrait trop de radiations',
  attitude: 'La sonde ne peut plus pointer correctement',
  'science-review': 'Revue NASA : pas encore assez de science envoyée',
};

export const COMMAND_KIND: Record<'power-plan' | 'respond' | 'standing-orders' | 'observe', string> = {
  observe: 'Prendre une photo',
  'power-plan': 'Nouveau plan d’énergie',
  respond: 'Réponse au danger',
  'standing-orders': 'Nouveaux ordres permanents',
};

/** One line for the event feed. */
function eventLineEn(e: OpsEvent, ctx: { destName: string; optionLabel: (hazardId: string, optionId: string) => string }): string | undefined {
  const v = e.values;
  switch (e.code) {
    case 'launch':
      return 'Décollage ! Votre sonde est en route.';
    case 'launch-failed':
      return 'La fusée a échoué le jour du lancement.';
    case 'phase-start':
      return `${OPS_PHASE[v.phase as OpsPhase] ?? 'Une nouvelle phase'} commence.`;
    case 'burn':
      if (v.kind === 'maintenance') return undefined;
      return v.kind === 'station-keeping' ? `Correction d’orbite : ${f.speed(Number(v.dv_ms))}.` : `Allumage moteur : ${f.speed(Number(v.dv_ms))}.`;
    case 'conjunction-start':
      return 'Conjonction solaire : aucun contact radio tant que le Soleil n’est pas passé.';
    case 'conjunction-end':
      return 'Le contact est rétabli après la conjonction.';
    case 'eclipse-season-start':
      return `Saison d’éclipses : la sonde traverse l’ombre de ${ctx.destName} à chaque orbite.`;
    case 'eclipse-season-end':
      return 'Fin de la saison d’éclipses : plein soleil à nouveau.';
    case 'hazard-warning':
      return 'Attention : quelque chose se dirige vers votre sonde.';
    case 'decision-open':
      return v.decisionId === 'extension' ? 'Mission principale terminée : à vous de décider la suite.' : 'Une décision vous attend.';
    case 'command-sent':
      return 'Commande envoyée : elle traverse maintenant l’espace à la vitesse de la lumière.';
    case 'command-refused':
      return v.reason === 'conjunction' ? `Commande refusée : aucun contact avant le jour ${f.num(Number(v.retryAfterDay))}.` : 'Commande refusée.';
    case 'command-executed':
      return v.optionId ? `La sonde a exécuté : ${ctx.optionLabel(String(v.hazardId), String(v.optionId))}.` : 'La sonde a exécuté votre commande.';
    case 'command-too-late':
      return 'Votre commande est arrivée trop tard.';
    case 'deadline-missed':
      return v.by === 'standing-order' ? 'Pas de commande à temps : la sonde a suivi son ordre permanent.' : 'Pas de commande à temps : la protection automatique a choisi pour vous.';
    case 'response-outcome':
      return v.bad ? 'Ça a mal tourné.' : 'Ça a marché.';
    case 'instrument-lost':
      return 'Un instrument ne fonctionne plus.';
    case 'stored-data-lost':
      return `Données stockées perdues : ${f.bits(Number(v.bits))}.`;
    case 'safe-mode':
      return `Mode sécurité jusqu’au jour ${f.num(Math.floor(Number(v.until)))}.`;
    case 'load-shed':
      return 'Pas assez d’énergie : la sonde a coupé des équipements.';
    case 'brownout':
      return 'Panne de courant : l’ordinateur de la sonde s’est éteint !';
    case 'dsn-booked':
      return `Appel réservé : antenne de ${f.num(Number(v.dish))} m.`;
    case 'dsn-refused':
      return 'Réservation refusée.';
    case 'craft-lost':
      return 'Contact perdu. La sonde est perdue.';
    case 'prime-complete':
      return 'Mission principale accomplie !';
    case 'extension-decided':
      return Number(v.years) > 0 ? 'Mission prolongée.' : 'La mission prend sa retraite avec les honneurs.';
    case 'mission-complete':
      return 'Mission accomplie.';
    case 'out-of-propellant':
      return 'Plus de carburant pour une manœuvre prévue.';
    case 'wheel-spare-took-over':
      return 'Une roue de réaction est tombée en panne ; la roue de secours a pris le relais.';
    default:
      return undefined;
  }
}
export const eventLine = eventLineEn;

/** The console drawers' own words (Fly & Survive): orders, the radio blackout, safe mode, the extension decision,
 * the power plan, booking a call home, and the toasts. Engineer readouts (equations and raw values) stay as they are. */
export const DRAWER_WORDS = {
    queue: {
      title: 'File de commandes',
      counts: (flying: string, recent: string) => `${flying} EN ROUTE · ${recent} RÉCENTES`,
      close: 'Fermer la file de commandes',
      sunNow: (day: string) => `Conjonction solaire : aucune commande avant le jour ${day}.`,
      sunSoon: (inDays: number, day: string) => `Conjonction solaire dans ${f.days(inDays)} : envoyez vos commandes avant le jour ${day}.`,
      sunThen: (length: number) => `Ensuite, le Soleil bloque la radio pendant ${f.days(length)}. Votre sonde vit sur ce que vous avez envoyé.`,
      empty: 'Rien n’a encore été envoyé. Changez le plan d’énergie ou répondez à un danger pour envoyer une commande.',
      onItsWay: 'EN ROUTE',
      sentDay: (day: string) => `ENVOYÉE JOUR ${day}`,
      arrivesIn: 'Arrive à la sonde dans',
      carriedOut: 'EXÉCUTÉE',
      tooLate: 'TROP TARD',
      day: (day: string) => `JOUR ${day}`,
      plan: '+ Plan d’énergie',
      call: 'Réserver un appel',
    },
    blackout: {
      label: 'Coupure radio',
      kicker: (day: string, total: string) => `COUPURE RADIO · JOUR ${day} SUR ${total}`,
      title: (total: number) => `Soleil entre la Terre et la sonde : aucun contact pendant ${f.days(total)}`,
      before: 'Votre sonde suit le plan que vous avez envoyé. Le contact revient le ',
      day: (day: string) => `jour ${day}`,
      after: (left: number) => `, dans ${f.days(left)}.`,
      skip: (day: string) => `Avancer au jour ${day}`,
    },
    safe: {
      label: 'Mode sécurité',
      chip: 'MODE SÉCURITÉ',
      title: 'Votre sonde s’est protégée.',
      body: 'Elle est tournée vers le Soleil, instruments éteints, et appelle la Terre avec une balise lente. La science reprend toute seule.',
      off: (name: string) => `${name} éteint`,
      beacon: 'Balise allumée',
      resumes: 'La science reprend le ',
      day: (day: string) => `jour ${day}`,
    },
    ext: {
      label: 'Prolongation de mission',
      kicker: 'DÉCISION DE MISSION',
      title: 'Votre mission principale est terminée. Et maintenant ?',
      sub: (days: number, dest: string) => `${f.days(days)} de science à ${dest}. Votre sonde fonctionne encore.`,
      retire: 'Prendre sa retraite avec les honneurs',
      extendBy: (years: number) => `Prolonger de ${years === 1 ? 'un an' : `${f.num(years)} ans`}`,
      recommended: 'RECOMMANDÉ · ALLER AU RAPPORT',
      retireBody: 'Gardez tout ce que vous avez appris. Votre score est verrouillé et plus rien ne peut mal tourner.',
      extendBody: 'Continuer pour plus de science. De l’argent neuf la finance, mais les pièces vieillissent et le carburant est limité.',
      extendCadet: ' Plus de temps de vol avant votre rapport.',
      moreScience: 'Plus de science',
      fuel: 'Carburant pour les corrections',
      of: (a: string, b: string) => `${a} sur ${b}`,
      powerEnd: 'Énergie à la fin',
      newMoney: 'Argent neuf',
      retireKey: 'Mettre la sonde à la retraite',
      extendKey: 'Prolonger la mission',
    },
    notice: {
      sent: 'Commande envoyée. Suivez sa traversée dans la file de commandes.',
      booked: (day: string, big: boolean) => `Appel réservé pour le jour ${day} sur la ${big ? 'grande' : 'petite'} antenne.`,
      conjunction: (day: string) => `Aucun contact pendant la conjonction. Réessayez le jour ${day}.`,
      leadTime: (day: string) => `Trop tôt : les antennes sont réservées une semaine à l’avance. Le premier jour libre est le jour ${day}.`,
      notFlying: 'La sonde ne vole pas.',
      refused: 'Cela a été refusé.',
      dismiss: 'Fermer',
    },
    power: {
      title: 'Plan d’énergie',
      share: 'RÉPARTITION DU JOUR',
      close: 'Fermer le plan d’énergie',
      split: 'Répartition de l’énergie : faites glisser les poignées blanches',
      science: 'Science',
      scienceShare: 'Part de la science',
      photosDay: (n: string) => `Environ ${n} photos par jour`,
      heaters: 'Chauffage',
      heaterShare: 'Part du chauffage',
      chilly: 'Les conduites de carburant refroidissent',
      warm: 'Garde le carburant et les pièces au chaud',
      radio: 'Radio',
      sends: 'Envoie les photos sur Terre',
      radioOff: 'Éteinte : rien n’est envoyé',
      lowest: 'Batterie au plus bas',
      reset: 'Revenir au plan habituel',
      noContact: 'Aucun contact',
      send: 'Envoyer le plan',
      over: 'Trop ! La sonde devrait couper des équipements aujourd’hui.',
      flat: (dest: string) => `Trop ! Les batteries se videraient dans l’ombre de ${dest}.`,
      low: 'Plus de science, mais les batteries baissent pendant les éclipses.',
      cold: 'Chauffage faible : les conduites de carburant risquent de geler, et les pièces froides tombent plus souvent en panne.',
      radioIsOff: 'Radio éteinte : aucune photo n’est envoyée tant que vous ne la rallumez pas.',
      healthy: 'Un plan équilibré. Les batteries restent en forme pendant toutes les éclipses.',
      balanced: 'Un plan équilibré.',
    },
    call: {
      title: 'Réserver un appel',
      pass: (day: string, hours: string) => `JOUR ${day} · PASSAGE DE ${hours} H`,
      close: 'Fermer la réservation',
      earlier: 'Jour précédent',
      later: 'Jour suivant',
      day: (day: string) => `Jour ${day}`,
      firstFree: (day: string) => `premier jour libre : ${day}`,
      dish: 'Antenne',
      big: 'Grande antenne',
      small: 'Petite antenne',
      included: 'inclus',
      free: 'gratuit',
      coins: (n: string) => `${n} pièces`,
      photosHome: (n: string) => `environ ${n} photos envoyées`,
      booked: 'RÉSERVÉ',
      tooSoon: (day: string) => `Trop tôt : réservez à partir du jour ${day}.`,
      conjunction: (day: string) => `Pas de radio ce jour-là (conjonction solaire). Essayez le jour ${day}.`,
      afterEnd: 'Ce jour est après la fin de la mission.',
      already: 'Déjà réservé',
      book: (big: boolean) => `Réserver la ${big ? 'grande' : 'petite'} antenne`,
    },
  };
