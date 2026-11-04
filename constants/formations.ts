import type { Formation } from '../services/types';

/** Mêmes listes que le site (pasci-web/lib/fetch-formations.ts). */
export const MODES_FORMATION = [
  { valeur: 'en_ligne', libelle: 'En ligne' },
  { valeur: 'presentiel', libelle: 'Présentiel' },
  { valeur: 'hybride', libelle: 'Hybride' },
] as const;

export const DOCUMENTS_DELIVRES = [
  { valeur: 'attestation', libelle: 'Attestation' },
  { valeur: 'certificat', libelle: 'Certificat' },
  { valeur: 'diplome', libelle: 'Diplôme' },
  { valeur: 'neant', libelle: 'Néant' },
] as const;

/** Catégories d'acteurs acceptées par l'API à l'inscription. */
export const CATEGORIES_ACTEURS = [
  'Organisation de la Société Civile OSC',
  'Acteurs étatiques',
  'Partenaires Techniques et Financiers PTF',
  'Grand public',
] as const;

export function libelleFiche(liste: readonly { valeur: string; libelle: string }[], valeur?: string | null) {
  return liste.find((x) => x.valeur === valeur)?.libelle ?? null;
}

/** Le champ « mode » s'il est renseigné, sinon déduit du lieu (comme le site). */
export function modeFormation(f: Pick<Formation, 'mode' | 'location'>): string {
  if (f.mode) return f.mode;
  const lieu = (f.location || '').toLowerCase();
  return !lieu || lieu.includes('ligne') || lieu.includes('online') || lieu.includes('distance') ? 'en_ligne' : 'presentiel';
}

/** « 09h00 » : heure saisie dans l'admin (l'API renvoie la date sans fuseau). */
function heure(date: string) {
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * Créneau horaire d'une formation : « 09h00 – 17h00 », « À partir de 09h00 »,
 * ou null quand aucune heure n'a été saisie (minuit).
 */
export function creneauHoraire(debut?: string | null, fin?: string | null): string | null {
  if (!debut) return null;
  const hDebut = heure(debut);
  const hFin = fin ? heure(fin) : null;
  const avecFin = !!hFin && hFin !== '00h00' && hFin !== hDebut;
  if (hDebut === '00h00' && !avecFin) return null;
  return avecFin ? `${hDebut} – ${hFin}` : `À partir de ${hDebut}`;
}
