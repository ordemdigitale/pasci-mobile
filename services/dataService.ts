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
  ForumSujet,
  ForumSujetDetail,
  ForumCommentaire,
  KeyStats,
  Documentation,
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
  }): Promise<Formation[]> => {
    const params = new URLSearchParams();
    if (filters?.upcoming_only) params.append("upcoming_only", "true");
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

  // Partenaires OSC
  getPartners: async (): Promise<Partner[]> => {
    const response = await apiClient.get<Partner[]>("/crasc/osc");
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
  ): Promise<ForumSujet> => {
    const response = await apiClient.post<ForumSujet>(
      `/forum/poles/${poleSlug}/sujets`,
      data,
    );
    return response.data;
  },

  createForumCommentaire: async (
    poleSlug: string,
    sujetSlug: string,
    content: string,
  ): Promise<ForumCommentaire> => {
    const response = await apiClient.post<ForumCommentaire>(
      `/forum/poles/${poleSlug}/sujets/${sujetSlug}/commentaires`,
      { content },
    );
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
    const response = await apiClient.get<Documentation[]>("/documentation");
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
