import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/dataService';

export type Option = { value: string; label: string };

// Liste de secours, utilisée seulement si l'API ne répond pas (même liste que le
// web : pasci-web/lib/osc-domaines.ts). La référence est la liste des pôles de
// concertation actifs : chaque pôle correspond à un domaine prioritaire, et le
// 1er domaine d'une OSC détermine son pôle.
export const DOMAINE_PRIORITAIRE_OPTIONS: Option[] = [
  { value: "Agriculture, sylviculture et pêche", label: "Agriculture, sylviculture et pêche" },
  { value: "Autres multi-secteurs", label: "Autres multi-secteurs" },
  { value: "Banques et services financiers", label: "Banques et services financiers" },
  { value: "Commerce et tourisme", label: "Commerce et tourisme" },
  { value: "Communication", label: "Communication" },
  { value: "Distribution d'eau et assainissement", label: "Distribution d'eau et assainissement" },
  { value: "Éducation", label: "Éducation" },
  { value: "Energie", label: "Energie" },
  { value: "Entreprises et autres services", label: "Entreprises et autres services" },
  { value: "Gouvernement, société civile, paix et sécurité", label: "Gouvernement, société civile, paix et sécurité" },
  { value: "Industrie, mines et constructions", label: "Industrie, mines et constructions" },
  { value: "Infrastructure et services sociaux divers", label: "Infrastructure et services sociaux divers" },
  { value: "Programme pour la Population", label: "Programme pour la Population" },
  { value: "Protection de l’environnement, général", label: "Protection de l’environnement, général" },
  { value: "Santé", label: "Santé" },
  { value: "Soutien budgétaire", label: "Soutien budgétaire" },
  { value: "Transports et entreposage", label: "Transports et entreposage" },
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

// Les deux districts autonomes sont enregistrés en base sous « Abidjan » et
// « Yamoussoukro » : on garde ce nom comme valeur (rattachement à la région et
// au CRASC) mais on affiche leur nom officiel (même règle que le site web).
const DISTRICTS: Record<string, string> = {
  abidjan: "District autonome d'Abidjan",
  yamoussoukro: 'District autonome de Yamoussoukro',
};

const cleRegion = (nom: string) =>
  nom.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Nom affiché d'une région (nom officiel pour les deux districts autonomes). */
export function libelleRegion(nom: string): string {
  return DISTRICTS[cleRegion(nom)] ?? nom;
}

/** Régions de la base (mêmes noms que l'annuaire et les CRASC), avec secours. */
export function useRegions(secours: Option[]): Option[] {
  const { data } = useQuery({
    queryKey: ['regions'],
    queryFn: dataService.getRegions,
    staleTime: 10 * 60 * 1000,
  });
  const regions: { name?: string }[] = Array.isArray(data) ? data : [];
  // Districts autonomes en tête, puis les régions par ordre alphabétique
  const options = versOptions(regions.map((r) => r.name || ''))
    .map((o) => ({ value: o.value, label: libelleRegion(o.value) }))
    .sort((a, b) => {
      const da = a.label.startsWith('District') ? 0 : 1;
      const db = b.label.startsWith('District') ? 0 : 1;
      return da - db || a.label.localeCompare(b.label, 'fr');
    });
  return options.length > 0 ? options : secours;
}
