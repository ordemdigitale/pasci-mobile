import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/dataService';

// Textes et illustrations modifiables dans l'admin du site (même valeurs par défaut que le web :
// pasci-web/lib/contenus-site.tsx). Les images par défaut sont servies par le site web.
const SITE_WEB = 'https://plateforme-osci.org';

export const CONTENUS_PAR_DEFAUT: Record<string, string> = {
  poles_intro: `Les pôles de concertation, il y en a {nb_poles}. Ce sont des espaces où les organisations de la société civile (OSC) peuvent **se rencontrer, discuter librement et partager leurs idées**.

- Chaque pôle met en avant un domaine important (par exemple agriculture, santé, éducation…).
- Seules les OSC inscrites sur la plateforme peuvent y participer.
- Les échanges se font dans un esprit de **respect** et de **collaboration**, pour avancer ensemble vers des objectifs communs.

Les pôles sont des lieux pour **parler, échanger et valoriser les priorités des OSC**, dans une ambiance constructive et ouverte.`,
  poles_illustration: `${SITE_WEB}/images/b81daf7f-c015-4a68-942f-ce602fdf5542.jpg`,
  ressources_illustration: `${SITE_WEB}/images/3a510ba6881dd3274d3f509019311d42ace72cf51c823f60c5e5fe2e112ff892.png`,
};

/** Valeur d'un contenu du site : celle saisie dans l'admin, sinon la valeur par défaut. */
export function useContenusSite() {
  const { data } = useQuery({
    queryKey: ['site-config'],
    queryFn: dataService.getSiteConfig,
    staleTime: 10 * 60 * 1000,
  });
  return (cle: string) => {
    const valeur = (data?.[cle] || '').trim();
    if (!valeur) return CONTENUS_PAR_DEFAUT[cle] || '';
    // Image par défaut du site enregistrée sous forme de chemin relatif
    return valeur.startsWith('/') ? `${SITE_WEB}${valeur}` : valeur;
  };
}
