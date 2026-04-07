import apiClient from './apiClient';
import { News, Job, Formation, FormationRubrique, Partner, Crasc, PTF, OffreProjet, PoleConcertation, ForumSujet, KeyStats, Documentation } from './types';

export const dataService = {
  // CRASC
  getCrascs: async (): Promise<Crasc[]> => {
    const response = await apiClient.get<Crasc[]>('/crasc/crasc');
    return response.data;
  },

  getCrascBySlug: async (slug: string): Promise<Crasc> => {
    const response = await apiClient.get<Crasc>(`/crasc/crasc/${slug}`);
    return response.data;
  },

  // Actualités
  getNews: async (filters?: { crasc_id?: number; osc_id?: number; skip?: number; limit?: number }): Promise<News[]> => {
    const params = new URLSearchParams();
    if (filters?.crasc_id) params.append('crasc_id', filters.crasc_id.toString());
    if (filters?.osc_id) params.append('osc_id', filters.osc_id.toString());
    if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
    if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());
    const url = `/news${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<News[]>(url);
    return response.data;
  },

  getNewsById: async (slug: string): Promise<News> => {
    const response = await apiClient.get<News>(`/news/${slug}`);
    return response.data;
  },

  // Emplois
  getJobs: async (): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>('/jobs');
    return response.data;
  },

  getJobBySlug: async (slug: string): Promise<Job> => {
    const response = await apiClient.get<Job>(`/jobs/${slug}`);
    return response.data;
  },

  // Formations
  getFormations: async (filters?: { upcoming_only?: boolean; limit?: number }): Promise<Formation[]> => {
    const params = new URLSearchParams();
    if (filters?.upcoming_only) params.append('upcoming_only', 'true');
    if (filters?.limit) params.append('limit', filters.limit.toString());
    const url = `/formations${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<Formation[]>(url);
    return response.data;
  },

  getFormationBySlug: async (slug: string): Promise<Formation> => {
    const response = await apiClient.get<Formation>(`/formations/${slug}`);
    return response.data;
  },

  getFormationRubriques: async (): Promise<FormationRubrique[]> => {
    const response = await apiClient.get<FormationRubrique[]>('/formations/rubriques');
    return response.data;
  },

  // Partenaires OSC
  getPartners: async (): Promise<Partner[]> => {
    const response = await apiClient.get<Partner[]>('/crasc/osc');
    return response.data;
  },

  getPartnerBySlug: async (slug: string): Promise<Partner> => {
    const response = await apiClient.get<Partner>(`/crasc/osc/${slug}`);
    return response.data;
  },

  // PTF (Partenaires Techniques et Financiers)
  getPtfList: async (): Promise<PTF[]> => {
    const response = await apiClient.get<PTF[]>('/ptf');
    return response.data;
  },

  getPtfBySlug: async (slug: string): Promise<PTF> => {
    const response = await apiClient.get<PTF>(`/ptf/${slug}`);
    return response.data;
  },

  // Offres de projets
  getOffreProjets: async (): Promise<OffreProjet[]> => {
    const response = await apiClient.get<OffreProjet[]>('/offre-projets');
    return response.data;
  },

  getOffreProjetBySlug: async (slug: string): Promise<OffreProjet> => {
    const response = await apiClient.get<OffreProjet>(`/offre-projets/${slug}`);
    return response.data;
  },

  // Forum / Pôles de concertation
  getForumPoles: async (): Promise<PoleConcertation[]> => {
    const response = await apiClient.get<PoleConcertation[]>('/forum/poles');
    return response.data;
  },

  getForumPoleBySlug: async (slug: string): Promise<PoleConcertation> => {
    const response = await apiClient.get<PoleConcertation>(`/forum/poles/${slug}`);
    return response.data;
  },

  getForumSujets: async (poleSlug: string): Promise<ForumSujet[]> => {
    const response = await apiClient.get<ForumSujet[]>(`/forum/poles/${poleSlug}/sujets`);
    return response.data;
  },

  // Régions
  getRegions: async () => {
    const response = await apiClient.get('/crasc/region');
    return response.data;
  },

  // Key Stats
  getKeyStats: async (): Promise<KeyStats[]> => {
    const response = await apiClient.get<KeyStats[]>('/key-stats');
    return response.data;
  },

  // Documentation
  getDocumentation: async (): Promise<Documentation[]> => {
    const response = await apiClient.get<Documentation[]>('/documentation');
    return response.data;
  },

  // Recherche
  searchOsc: async (query: string, region?: string) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (region) params.append('region', region);
    const response = await apiClient.get(`/search/osc?${params.toString()}`);
    return response.data;
  },

  searchGlobal: async (query: string) => {
    const response = await apiClient.get(`/search/?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  searchSuggestions: async (query: string) => {
    const response = await apiClient.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};
