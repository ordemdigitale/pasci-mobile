import type { PoleMembre } from '../services/types';

// Logique des listes de membres d'un pôle de concertation.
// Mêmes règles que le site web (pasci-web/lib/pole-membres.ts).

export const MEMBRES_PAR_PAGE = 10;

export const MEMBER_TYPE_FILTERS = [
  { label: 'Tous', value: 'all' },
  { label: 'Association', value: 'Association' },
  { label: 'ONG', value: 'ONG' },
  { label: 'Fondation', value: 'Fondation' },
  { label: 'Organisation cultuelle', value: 'Organisation cultuelle' },
];

/** Minuscules, sans accents ni ponctuation. */
export function normaliser(value?: string | null): string {
  return (value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** « ONG » doit trouver « Organisation Non Gouvernementale (ONG) ». */
export function correspondAuType(membre: PoleMembre, filtre: string): boolean {
  const attendu = normaliser(filtre);
  return [membre.type_name, membre.categorie].some((value) => {
    const v = normaliser(value);
    return v === attendu || v.split(' ').includes(attendu) || (attendu.includes(' ') && v.includes(attendu));
  });
}

export type FiltresMembres = {
  type: string;
  crasc: string;
  region: string;
  recherche: string;
  actifsSeulement: boolean;
};

export const FILTRES_VIDES: FiltresMembres = {
  type: 'all',
  crasc: '',
  region: '',
  recherche: '',
  actifsSeulement: false,
};

export function filtrerMembres(membres: PoleMembre[], f: FiltresMembres): PoleMembre[] {
  const mots = normaliser(f.recherche).split(' ').filter(Boolean);
  return membres.filter((m) => {
    if (f.type !== 'all' && !correspondAuType(m, f.type)) return false;
    if (f.crasc && normaliser(m.crasc_nom) !== normaliser(f.crasc)) return false;
    if (f.region && normaliser(m.region_nom) !== normaliser(f.region)) return false;
    if (f.actifsSeulement && !m.est_actif) return false;
    if (mots.length) {
      const texte = normaliser(
        [m.name, m.sigle, m.axe, m.specialites, m.region_nom, m.crasc_nom, m.ville].filter(Boolean).join(' ')
      );
      if (!mots.every((mot) => texte.includes(mot))) return false;
    }
    return true;
  });
}

export function valeursDistinctes(membres: PoleMembre[], champ: 'crasc_nom' | 'region_nom'): string[] {
  const vues = new Map<string, string>();
  for (const m of membres) {
    const v = (m[champ] || '').trim();
    if (v && !vues.has(normaliser(v))) vues.set(normaliser(v), v);
  }
  return [...vues.values()].sort((a, b) => a.localeCompare(b, 'fr'));
}

/** Régions de la plus représentée à la moins représentée, avec leurs OSC. */
export function regrouperParRegion(membres: PoleMembre[]): { nom: string; oscs: PoleMembre[] }[] {
  const regions = new Map<string, { nom: string; oscs: PoleMembre[] }>();
  for (const m of membres) {
    const nom = (m.region_nom || '').trim();
    if (!nom) continue;
    const cle = normaliser(nom);
    const entree = regions.get(cle) ?? { nom, oscs: [] };
    entree.oscs.push(m);
    regions.set(cle, entree);
  }
  return [...regions.values()].sort(
    (a, b) => b.oscs.length - a.oscs.length || a.nom.localeCompare(b.nom, 'fr')
  );
}
