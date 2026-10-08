/**
 * Mode hors ligne : les données déjà consultées (annuaires, formations, actualités,
 * ressources, offres…) sont enregistrées sur l'appareil et réaffichées sans
 * connexion ; elles sont actualisées dès que l'appareil retrouve internet.
 *
 * - Le cache de React Query est sauvegardé dans un fichier (expo-file-system)
 *   et rechargé au démarrage.
 * - La connexion est vérifiée régulièrement (requête légère vers l'API) : au
 *   retour du réseau, React Query relance les requêtes affichées.
 */
import * as FileSystem from 'expo-file-system/legacy';
import { AppState } from 'react-native';
import { QueryClient, dehydrate, focusManager, hydrate, onlineManager } from '@tanstack/react-query';

const FICHIER = `${FileSystem.documentDirectory}pdoc-cache-v1.json`;
const DUREE_CONSERVATION = 7 * 24 * 60 * 60 * 1000; // 7 jours
const API_ORIGIN = (process.env.EXPO_PUBLIC_API_URL || 'https://api.plateforme-osci.org')
  .replace(/\/api\/v1\/?$/, '')
  .replace(/\/$/, '');

// Données propres à l'utilisateur connecté : jamais écrites sur le disque
const CLES_PRIVEES = new Set(['me', 'ma-progression', 'check-inscription', 'notifications', 'inbox', 'osc-me']);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: DUREE_CONSERVATION, // garder les données assez longtemps pour le mode hors ligne
      staleTime: 60 * 1000,
      retry: 1,
      networkMode: 'offlineFirst',
    },
  },
});

let derniereSauvegarde: number | null = null;
export const dateDerniereSauvegarde = () => derniereSauvegarde;

/** Recharge le cache enregistré (au démarrage, avant le premier affichage). */
export async function restaurerCache(): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(FICHIER);
    if (!info.exists) return;
    const contenu = JSON.parse(await FileSystem.readAsStringAsync(FICHIER));
    if (!contenu?.etat || Date.now() - contenu.date > DUREE_CONSERVATION) return;
    hydrate(queryClient, contenu.etat);
    derniereSauvegarde = contenu.date;
  } catch {
    /* cache illisible : ignoré */
  }
}

let minuterie: ReturnType<typeof setTimeout> | null = null;

async function sauvegarder() {
  try {
    const etat = dehydrate(queryClient, {
      shouldDehydrateQuery: (q) =>
        q.state.status === 'success' && !CLES_PRIVEES.has(String(q.queryKey[0])),
    });
    derniereSauvegarde = Date.now();
    await FileSystem.writeAsStringAsync(FICHIER, JSON.stringify({ date: derniereSauvegarde, etat }));
  } catch {
    /* espace insuffisant, etc. : l'application reste utilisable */
  }
}

/** Sauvegarde (regroupée) à chaque nouvelle donnée reçue. */
export function activerSauvegarde(): () => void {
  return queryClient.getQueryCache().subscribe((evenement) => {
    if (evenement.type !== 'updated' || evenement.action.type !== 'success') return;
    if (minuterie) clearTimeout(minuterie);
    minuterie = setTimeout(sauvegarder, 2000);
  });
}

/** Efface le cache enregistré (déconnexion). */
export async function effacerCache(): Promise<void> {
  try {
    await FileSystem.deleteAsync(FICHIER, { idempotent: true });
  } catch {
    /* rien */
  }
}

async function verifierConnexion(): Promise<boolean> {
  const controle = new AbortController();
  const delai = setTimeout(() => controle.abort(), 6000);
  try {
    const r = await fetch(`${API_ORIGIN}/api/v1/config/payment-numbers`, { signal: controle.signal });
    return r.ok || r.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(delai);
  }
}

/**
 * Suit la connexion et le premier plan de l'application : au retour du réseau
 * ou de l'application au premier plan, React Query actualise les données.
 */
export function suivreConnexion(): () => void {
  let actif = true;
  const tester = async () => {
    const enLigne = await verifierConnexion();
    if (actif) onlineManager.setOnline(enLigne);
  };
  tester();
  const intervalle = setInterval(tester, 30 * 1000);
  const abonnement = AppState.addEventListener('change', (etat) => {
    focusManager.setFocused(etat === 'active');
    if (etat === 'active') tester();
  });
  return () => {
    actif = false;
    clearInterval(intervalle);
    abonnement.remove();
  };
}
