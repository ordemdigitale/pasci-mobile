import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/dataService';

export type Option = { value: string; label: string };

// Liste de secours, utilisée seulement si l'API ne répond pas (même liste que le
// web : pasci-web/lib/osc-domaines.ts). La référence est la liste des pôles de
// concertation actifs : chaque pôle correspond à un domaine prioritaire, et le
// 1er domaine d'une OSC détermine son pôle.
export const DOMAINE_PRIORITAIRE_OPTIONS: Option[] = [
  { value: 'Agriculture pêche et sylviculture', label: 'Agriculture pêche et sylviculture' },
  { value: 'Banques et services financiers', label: 'Banques et services financiers' },
  { value: 'Commerce et tourisme', label: 'Commerce et tourisme' },
  { value: 'Éducation', label: 'Éducation' },
  { value: 'Entreprises et autres services', label: 'Entreprises et autres services' },
  { value: 'Gouvernement et Société Civile', label: 'Gouvernement et Société Civile' },
  { value: 'Infrastructure et services sociaux divers', label: 'Infrastructure et services sociaux divers' },
  { value: 'Prévention et règlement des conflits, paix et sécurité', label: 'Prévention et règlement des conflits, paix et sécurité' },
  { value: 'Programme pour la Population', label: 'Programme pour la Population' },
  { value: 'Protection de l’environnement, général', label: 'Protection de l’environnement, général' },
  { value: 'Santé', label: 'Santé' },
];

const versOptions = (noms: string[]): Option[] =>
  [...new Set(noms.map((n) => n.trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'fr'))
    .map((nom) => ({ value: nom, label: nom }));

/**
 * Domaines prioritaires = pôles de concertation actifs (même liste que le web) :
 * un pôle ajouté, renommé ou fusionné dans l'admin apparaît automatiquement.
 */
export function useDomainesPrioritaires(): Option[] {
  const { data } = useQuery({
    queryKey: ['domaines-prioritaires'],
    queryFn: dataService.getForumPoles,
    staleTime: 10 * 60 * 1000,
  });
  const options = versOptions((data ?? []).map((p) => p.name));
  return options.length > 0 ? options : DOMAINE_PRIORITAIRE_OPTIONS;
}

/** Régions de la base (mêmes noms que l'annuaire et les CRASC), avec secours. */
export function useRegions(secours: Option[]): Option[] {
  const { data } = useQuery({
    queryKey: ['regions'],
    queryFn: dataService.getRegions,
    staleTime: 10 * 60 * 1000,
  });
  const regions: { name?: string }[] = Array.isArray(data) ? data : [];
  const options = versOptions(regions.map((r) => r.name || ''));
  return options.length > 0 ? options : secours;
}
