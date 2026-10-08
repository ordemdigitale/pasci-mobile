import apiClient from "./apiClient";
import {
  News,
  Job,
  Formation,
  FormationRubrique,
  Partner,
  Crasc,
  PTF,
  OffreProjet,
  PoleConcertation,
  PoleMembre,
  ForumSujet,
  ForumSujetDetail,
  ForumCommentaire,
  FichierLocal,
  LimitesMedias,
  KeyStats,
  Documentation,
  RessourceType,
  RessourceCategorie,
  OscType,
  Evenement,
  CrascVideo,
  NumeroUtile,
  ContactPayload,
  AdhesionPayload,
  CatalogueFormation,
  DashboardStats,
  VisiteStats,
  DonCreatePayload,
  DonCreateResponse,
  DonRead,
  FormationInscriptionRead,
  PaiementFormationInitierPayload,
  PaiementFormationInitierResponse,
  DonInitierPayload,
  DonInitierResponse,
  SoumettrePaiementPayload,
  Faq,
  PaymentNumbers,
} from "./types";

// Message d'un pôle : JSON si texte seul (comme avant), multipart s'il y a des
// photos, audios ou vidéos (champ « fichiers », format React Native {uri, name, type}).
function corpsMessage(champs: Record<string, string>, fichiers: FichierLocal[]) {
  if (fichiers.length === 0) return champs;
  const corps = new FormData();
  Object.entries(champs).forEach(([cle, valeur]) => corps.append(cle, valeur));
  fichiers.forEach((f) =>
    corps.append("fichiers", { uri: f.uri, name: f.name, type: f.type } as unknown as Blob),
  );
  return corps;
}

function optionsMessage(fichiers: FichierLocal[]) {
  return fichiers.length === 0
    ? undefined
    : { headers: { "Content-Type": "multipart/form-data" }, timeout: 5 * 60 * 1000 };
}

export interface ResultatEvaluation {
  score: number;
  reussi: boolean;
  note_minimale: number;
  bonnes: number;
  total: number;
  questions_a_revoir: number[];
  certificat_code?: string | null;
}

export const dataService = {
  // Configuration publique
  getPaymentNumbers: async (): Promise<PaymentNumbers> => {
    const response = await apiClient.get<PaymentNumbers>("/config/payment-numbers");
    return response.data;
  },

  // CRASC
  getCrascs: async (): Promise<Crasc[]> => {
    const response = await apiClient.get<Crasc[]>("/crasc/crasc");
    return response.data;
  },

  getCrascBySlug: async (slug: string): Promise<Crasc> => {
    const response = await apiClient.get<Crasc>(`/crasc/crasc/${slug}`);
    return response.data;
  },

  getCrascEvenements: async (filters?: {
    crasc_id?: number;
    a_venir?: boolean;
  }): Promise<Evenement[]> => {
    const params = new URLSearchParams();
    if (filters?.crasc_id)
      params.append("crasc_id", filters.crasc_id.toString());
    if (filters?.a_venir !== undefined)
      params.append("a_venir", filters.a_venir ? "true" : "false");
    const url = `/crasc/evenement${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get<Evenement[]>(url);
    return response.data;
  },

  getCrascVideos: async (crasc_id?: number): Promise<CrascVideo[]> => {
    const params = new URLSearchParams();
    if (crasc_id) params.append("crasc_id", crasc_id.toString());
    const url = `/crasc/video${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get<CrascVideo[]>(url);
    return response.data;
  },

  getOscTypes: async (): Promise<OscType[]> => {
    const response = await apiClient.get<OscType[]>("/crasc/osc-type");
    return response.data;
  },

  // Actualités
  getNews: async (filters?: {
    crasc_id?: number;
    osc_id?: number;
    skip?: number;
    limit?: number;
  }): Promise<News[]> => {
    const params = new URLSearchParams();
    if (filters?.crasc_id)
      params.append("crasc_id", filters.crasc_id.toString());
    if (filters?.osc_id) params.append("osc_id", filters.osc_id.toString());
    if (filters?.skip !== undefined)
      params.append("skip", filters.skip.toString());
    if (filters?.limit !== undefined)
      params.append("limit", filters.limit.toString());
    const url = `/news${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get<News[]>(url);
    return response.data;
  },

  getNewsById: async (slug: string): Promise<News> => {
    const response = await apiClient.get<News>(`/news/${slug}`);
    return response.data;
  },

  // Emplois
  getJobs: async (): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>("/jobs");
    return response.data;
  },

  getJobBySlug: async (slug: string): Promise<Job> => {
    const response = await apiClient.get<Job>(`/jobs/${slug}`);
    return response.data;
  },

  // Formations
  getFormations: async (filters?: {
    upcoming_only?: boolean;
    limit?: number;
    statut?: "terminees" | "en_cours" | "a_venir";
  }): Promise<Formation[]> => {
    const params = new URLSearchParams();
    if (filters?.upcoming_only) params.append("upcoming_only", "true");
    if (filters?.statut) params.append("statut", filters.statut);
    if (filters?.limit) params.append("limit", filters.limit.toString());
    const url = `/formations${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get<Formation[]>(url);
    return response.data;
  },

  getFormationBySlug: async (slug: string): Promise<Formation> => {
    const response = await apiClient.get<Formation>(`/formations/${slug}`);
    return response.data;
  },

  getFormationRubriques: async (): Promise<FormationRubrique[]> => {
    const response = await apiClient.get<FormationRubrique[]>(
      "/formations/rubriques",
    );
    return response.data;
  },

  getFormationCatalogues: async (
    active_only = true,
  ): Promise<CatalogueFormation[]> => {
    const response = await apiClient.get<CatalogueFormation[]>(
      `/formations/catalogue?active_only=${active_only ? "true" : "false"}`,
    );
    return response.data;
  },

  // Partenaires OSC (l'API renvoie une page : { items, total, page, size, pages })
  getPartners: async (): Promise<Partner[]> => {
    const response = await apiClient.get<{ items: Partner[] }>("/crasc/osc?size=100");
    return response.data.items ?? [];
  },

  // Annuaire OSC : recherche (sans accents), région, thématique, catégorie (OdF, OdJ, OPSH) et faîtières
  getOscAnnuaire: async (filtres: {
    search?: string;
    region_nom?: string;
    domaine_activite?: string;
    categorie?: string;
    faitiere?: boolean;
  }): Promise<Partner[]> => {
    const params = new URLSearchParams({ size: "100", sort_by: "name", sort_order: "asc" });
    if (filtres.search) params.append("search", filtres.search);
    if (filtres.region_nom) params.append("region_nom", filtres.region_nom);
    if (filtres.domaine_activite) params.append("domaine_activite", filtres.domaine_activite);
    if (filtres.categorie) params.append("categorie", filtres.categorie);
    if (filtres.faitiere !== undefined) params.append("faitiere", String(filtres.faitiere));
    const response = await apiClient.get<{ items: Partner[] }>(`/crasc/osc?${params.toString()}`);
    return response.data.items ?? [];
  },

  // Textes et illustrations modifiables dans l'admin du site
  getSiteConfig: async (): Promise<Record<string, string>> => {
    const response = await apiClient.get<Record<string, string>>("/config");
    return response.data;
  },

  getPartnerBySlug: async (slug: string): Promise<Partner> => {
    const response = await apiClient.get<Partner>(`/crasc/osc/${slug}`);
    return response.data;
  },

  // PTF (Partenaires Techniques et Financiers)
  getPtfList: async (): Promise<PTF[]> => {
    const response = await apiClient.get<PTF[]>("/ptf");
    return response.data;
  },

  getPtfBySlug: async (slug: string): Promise<PTF> => {
    const response = await apiClient.get<PTF>(`/ptf/${slug}`);
    return response.data;
  },

  // Offres de projets
  getOffreProjets: async (): Promise<OffreProjet[]> => {
    const response = await apiClient.get<OffreProjet[]>("/offre-projets");
    return response.data;
  },

  getOffreProjetBySlug: async (slug: string): Promise<OffreProjet> => {
    const response = await apiClient.get<OffreProjet>(`/offre-projets/${slug}`);
    return response.data;
  },

  // Forum / Pôles de concertation
  getForumPoles: async (): Promise<PoleConcertation[]> => {
    const response = await apiClient.get<PoleConcertation[]>("/forum/poles");
    return response.data;
  },

  getForumPoleBySlug: async (slug: string): Promise<PoleConcertation> => {
    const response = await apiClient.get<PoleConcertation>(
      `/forum/poles/${slug}`,
    );
    return response.data;
  },

  getForumPoleMembres: async (poleSlug: string): Promise<PoleMembre[]> => {
    const response = await apiClient.get<PoleMembre[]>(
      `/forum/poles/${poleSlug}/membres`,
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  getForumSujets: async (poleSlug: string): Promise<ForumSujet[]> => {
    const response = await apiClient.get<ForumSujet[]>(
      `/forum/poles/${poleSlug}/sujets`,
    );
    return response.data;
  },

  getForumSujetDetail: async (
    poleSlug: string,
    sujetSlug: string,
  ): Promise<ForumSujetDetail> => {
    const response = await apiClient.get<ForumSujetDetail>(
      `/forum/poles/${poleSlug}/sujets/${sujetSlug}`,
    );
    return response.data;
  },

  createForumSujet: async (
    poleSlug: string,
    data: { title: string; content: string },
    fichiers: FichierLocal[] = [],
  ): Promise<ForumSujet> => {
    const response = await apiClient.post<ForumSujet>(
      `/forum/poles/${poleSlug}/sujets`,
      corpsMessage(data, fichiers),
      optionsMessage(fichiers),
    );
    return response.data;
  },

  createForumCommentaire: async (
    poleSlug: string,
    sujetSlug: string,
    content: string,
    fichiers: FichierLocal[] = [],
  ): Promise<ForumCommentaire> => {
    const response = await apiClient.post<ForumCommentaire>(
      `/forum/poles/${poleSlug}/sujets/${sujetSlug}/commentaires`,
      corpsMessage({ content }, fichiers),
      optionsMessage(fichiers),
    );
    return response.data;
  },

  // Tailles maximales (Mo) des photos, audios et vidéos d'un message
  getLimitesMedias: async (): Promise<LimitesMedias> => {
    const response = await apiClient.get<LimitesMedias>("/forum/medias/limites");
    return response.data;
  },

  // Régions
  getRegions: async () => {
    const response = await apiClient.get("/crasc/region");
    return response.data;
  },

  // Key Stats
  getKeyStats: async (): Promise<KeyStats[]> => {
    const response = await apiClient.get<KeyStats[]>("/key-stats");
    return response.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>("/stats/dashboard");
    return response.data;
  },

  getVisiteStats: async (): Promise<VisiteStats> => {
    const response = await apiClient.get<VisiteStats>("/visites/stats");
    return response.data;
  },

  // Documentation
  getDocumentation: async (): Promise<Documentation[]> => {
    // Limite explicite : l'API n'en renvoie que 20 par défaut
    const response = await apiClient.get<Documentation[]>("/documentation?limit=100");
    return response.data;
  },

  // Typologie des ressources (gérée dans l'admin)
  getRessourceTypes: async (): Promise<RessourceType[]> => {
    const response = await apiClient.get<RessourceType[]>("/ressources-typologie/types");
    return response.data;
  },

  getRessourceCategories: async (): Promise<RessourceCategorie[]> => {
    const response = await apiClient.get<RessourceCategorie[]>("/ressources-typologie/categories");
    return response.data;
  },

  getNumerosUtiles: async (): Promise<NumeroUtile[]> => {
    const response = await apiClient.get<NumeroUtile[]>("/numeros-utiles/");
    return response.data;
  },

  getFaq: async (): Promise<Faq[]> => {
    const response = await apiClient.get<Faq[]>("/faq/");
    return response.data;
  },

  // Contact public
  submitContact: async (payload: ContactPayload) => {
    const response = await apiClient.post("/contact", payload);
    return response.data;
  },

  // Demande d'adhesion
  submitAdhesion: async (payload: AdhesionPayload) => {
    const response = await apiClient.post("/adhesion", payload);
    return response.data;
  },

  // Paiement formation
  initierPaiementFormation: async (
    slug: string,
    payload: PaiementFormationInitierPayload,
  ) => {
    const response = await apiClient.post<PaiementFormationInitierResponse>(
      `/formations/${slug}/paiement/initier`,
      payload,
    );
    return response.data;
  },

  confirmerPaiementSimulation: async (inscriptionId: number) => {
    const response = await apiClient.post(
      `/formations/paiement/simulation/confirmer/${inscriptionId}`,
    );
    return response.data;
  },

  // Paiement dons
  initierDon: async (
    payload: DonInitierPayload,
  ): Promise<DonInitierResponse> => {
    const response = await apiClient.post<DonInitierResponse>(
      "/dons/initier",
      payload,
    );
    return response.data;
  },

  creerDon: async (payload: DonCreatePayload): Promise<DonCreateResponse> => {
    const response = await apiClient.post<DonCreateResponse>(
      "/dons/creer",
      payload,
    );
    return response.data;
  },

  soumettrePaiementDon: async (
    donId: number,
    payload: SoumettrePaiementPayload,
  ): Promise<DonRead> => {
    const response = await apiClient.post<DonRead>(
      `/dons/${donId}/soumettre-paiement`,
      payload,
    );
    return response.data;
  },

  confirmerDonSimulation: async (donId: number) => {
    const response = await apiClient.post(
      `/dons/simulation/confirmer/${donId}`,
    );
    return response.data;
  },

  // Certificat
  verifCertificat: async (code: string) => {
    const response = await apiClient.get(
      `/formations/certificats/verifier/${code}`,
    );
    return response.data as {
      id: number;
      code: string;
      formation_title: string;
      participant_name: string;
      participant_email: string;
      issued_at: string;
    };
  },

  // Recherche
  searchOsc: async (query: string, region?: string) => {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (region) params.append("region", region);
    const response = await apiClient.get(`/search/osc?${params.toString()}`);
    return response.data;
  },

  searchGlobal: async (query: string) => {
    const response = await apiClient.get(
      `/search/?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },

  searchSuggestions: async (query: string) => {
    const response = await apiClient.get(
      `/search/suggestions?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },

  // Modules & leçons d'une formation
  getFormationModules: async (slug: string) => {
    const response = await apiClient.get(`/formations/${slug}/modules`);
    return response.data as Array<{
      id: number;
      title: string;
      description: string | null;
      order: number;
      lecons: Array<{
        id: number;
        module_id: number;
        title: string;
        type: "video" | "pdf" | "text";
        content: string | null;
        file_url: string | null;
        duration_minutes: number | null;
        is_preview: boolean;
        order: number;
        /** Contenu masqué par l'API : inscription (et paiement validé) requise. */
        verrouillee?: boolean;
      }>;
    }>;
  },

  inscrireFormation: async (
    slug: string,
    payload: {
      participant_nom: string;
      participant_prenoms: string;
      participant_email: string;
      participant_phone?: string;
      categorie_acteur?: string;
    },
  ): Promise<FormationInscriptionRead> => {
    const response = await apiClient.post<FormationInscriptionRead>(
      `/formations/${slug}/inscrire`,
      payload,
    );
    return response.data;
  },

  soumettrePaiementFormation: async (
    inscriptionId: number,
    payload: SoumettrePaiementPayload,
  ): Promise<FormationInscriptionRead> => {
    const response = await apiClient.post<FormationInscriptionRead>(
      `/formations/inscriptions/${inscriptionId}/soumettre-paiement`,
      payload,
    );
    return response.data;
  },

  marquerLeconVue: async (leconId: number) => {
    const response = await apiClient.post(`/formations/lecons/${leconId}/vue`);
    return response.data as {
      progression: number;
      total_lecons: number;
      certificat_code?: string;
    };
  },

  // Progression, accès au contenu et statut du paiement (utilisateur connecté)
  getMaProgressionFormation: async (slug: string) => {
    const response = await apiClient.get(`/formations/${slug}/ma-progression`);
    return response.data as {
      inscrit: boolean;
      inscription_id?: number;
      acces: boolean;
      payment_status: string | null;
      progression: number;
      lecons_vues: number[];
      total_lecons?: number;
      certificat_code: string | null;
      evaluation?: { nb_questions: number; reussie: boolean; note_minimale: number };
    };
  },

  // Supports de formation (documents et liens du formateur)
  getSupportsFormation: async (slug: string) => {
    const response = await apiClient.get(`/formations/${slug}/supports`);
    return response.data as Array<{
      id: number;
      titre: string;
      description?: string | null;
      type: "fichier" | "lien";
      nom?: string | null;
      taille: number;
      public: boolean;
      url?: string | null;
      verrouille: boolean;
    }>;
  },

  // Évaluation finale (QCM) avant le certificat
  getEvaluationFormation: async (slug: string) => {
    const response = await apiClient.get(`/formations/${slug}/evaluation`);
    return response.data as {
      note_minimale: number;
      questions: Array<{ id: number; enonce: string; choix: string[]; plusieurs_reponses: boolean }>;
      lecons_terminees: boolean;
      reussie: boolean;
      tentatives: Array<{ score: number; reussi: boolean; date: string }>;
      certificat_code?: string | null;
    };
  },

  soumettreEvaluationFormation: async (slug: string, reponses: Record<number, number[]>) => {
    const response = await apiClient.post<ResultatEvaluation>(`/formations/${slug}/evaluation`, { reponses });
    return response.data;
  },

  checkInscription: async (slug: string, email: string) => {
    console.log(
      `🔍 [DEBUG] Checking enrollment for ${slug} with email: ${email}`,
    );
    const response = await apiClient.get(
      `/formations/${slug}/check-inscription?email=${encodeURIComponent(email)}`,
    );
    console.log(`📥 [DEBUG] enrollment Response:`, response.data);
    return response.data as {
      registered: boolean;
      payment_status?: string | null;
      progression?: number;
      total_lecons?: number;
      certificat_code?: string;
      lecons_vues?: number[];
    };
  },
};
