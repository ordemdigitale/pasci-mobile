export interface User {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  avatar?: string;
  bio?: string;
  date_joined?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  user?: User;
}

export interface PaymentNumbers {
  wave_number: string;
  orange_money_number: string;
}

export interface News {
  id: number;
  title: string;
  content?: string;
  thumbnail_url?: string;
  thumbnail_path?: string;
  created_at: string;
  updated_at?: string;
  slug: string;
  crasc_id?: number | null;
  osc_id?: number | null;
  tags?: string[];
  crasc?: {
    id: number;
    name: string;
    slug: string;
    osc_count: number;
  };
  osc?: {
    id: number;
    name: string;
    slug: string;
    thumbnail_url?: string;
    description?: string;
    ville?: string;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  employer: string;
  location: string;
  type: string;
  slug: string;
  offre_url?: string | null;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
  publication_date?: string;
  expiration_date?: string;
  missions?: string;
  requirements?: string;
  benefits?: string;
  missions_list?: { title: string; description: string }[];
  requirements_list?: string[];
  benefits_list?: { icon: string; title: string; description: string }[];
}

export interface FormationRubrique {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Formation {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  trainer: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  registration_deadline: string | null;
  max_participants: number | null;
  current_participants: number;
  is_published: boolean;
  is_full: boolean;
  is_completed: boolean;
  type: string;
  price: number | null;
  thumbnail_url: string;
  thumbnail_path: string;
  registration_link: string | null;
  materials_link: string | null;
  rubrique?: FormationRubrique | null;
  crasc?: { id: number; name: string; slug: string } | null;
  osc?: { id: number; name: string; slug: string } | null;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: number;
  name: string;
  description?: string;
  thumbnail_url?: string;
  thumbnail_path?: string;
  slug: string;
  email?: string;
  phone?: string;
  website?: string;
  ville?: string;
  address?: string;
  created_at?: string;
  type?: { id: number; name: string; slug: string };
  crasc?: { id: number; name: string; slug: string };
  news_items?: {
    id: number;
    title: string;
    slug: string;
    thumbnail_url?: string;
    created_at: string;
  }[];
  tags?: string[];
  type_document_formalisation?: string | null;
  existence_siege?: boolean | null;
  manuel_procedures?: boolean | null;
  plan_action?: boolean | null;
  rapports_annuels?: boolean | null;
  adhesion_crasc?: boolean | null;
  adhesion_crasc_statut?: 'oui' | 'non' | 'en_cours' | null;
  niveau_regroupement?: 'Simple' | 'Réseau' | 'Fédération' | 'Plateforme' | 'Confédération' | null;
  score_autoevaluation?: number;
  couleur_autoevaluation?: 'gris' | 'rouge' | 'orange' | 'jaune' | 'bleu' | 'vert';
  couleur_autoevaluation_hex?: string;
}

export interface Crasc {
  id: number;
  name: string;
  slug: string;
  description?: string;
  osc_count?: number;
  oscs?: any[];
  regions?: any[];
  news?: any[];
  evenements?: Evenement[];
  videos?: CrascVideo[];
}

export interface Evenement {
  id: number;
  title: string;
  description?: string;
  date_debut: string;
  date_fin?: string;
  lieu?: string;
  crasc_id?: number;
  created_at?: string;
}

export interface CrascVideo {
  id: number;
  crasc_id: number;
  titre: string;
  url: string;
  description?: string;
  ordre: number;
  created_at?: string;
}

export interface OscType {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface ContactPayload {
  categorie_acteur?: string;
  nom: string;
  prenoms: string;
  fonction?: string;
  sexe?: string;
  tranche_age?: string;
  email: string;
  contact?: string;
  pays?: string;
  lieu_residence?: string;
  motif: string;
  message?: string;
}

export interface AdhesionPayload {
  nom_organisation: string;
  sigle?: string | null;
  type_organisation: string;
  crasc_nom?: string;
  type_osc?: string;
  region: string;
  departement?: string | null;
  sous_prefecture?: string | null;
  ville?: string;
  origine_organisation?: string | null;
  email: string;
  telephone: string;
  description?: string;
  motivation: string;
  type_document_formalisation?: string | null;
  existence_siege?: boolean | null;
  categorie?: string | null;
  niveau_regroupement?: string | null;
  domaine_prioritaire?: string | null;
  domaine_prioritaire_2?: string | null;
  domaine_prioritaire_3?: string | null;
  domaine_prioritaire_4?: string | null;
  domaine_prioritaire_5?: string | null;
  nb_membres?: number | null;
  nb_femmes_membres?: number | null;
  nb_hommes_membres?: number | null;
  nb_membres_jeunes?: number | null;
  nb_membres_handicap?: number | null;
  nb_membres_be?: number | null;
  nombre_mandats_be?: number | null;
  duree_mandat_be?: string | null;
  nb_beneficiaires?: number | null;
  nb_femmes_beneficiaires?: number | null;
  nb_jeunes_beneficiaires?: number | null;
  nb_beneficiaires_handicap?: number | null;
  adhesion_crasc_statut?: string | null;
  organes_gouvernance?: string | null;
  pays_couverture?: string | null;
  nb_personnes_engagees?: number | null;
  nb_cdi?: number | null;
  nb_cdd?: number | null;
  date_designation_responsable?: string | null;
  date_prochaine_designation?: string | null;
  manuel_procedures?: boolean | null;
  plan_action_annee_cours?: boolean | null;
  plan_action_annee_cours_details?: string | null;
  plan_action?: boolean | null;
  nb_activites?: number | null;
  date_derniere_activite?: string | null;
  rapports_annuels?: boolean | null;
  recommandations?: string | null;
  recommandations_2?: string | null;
}

export interface CatalogueFormation {
  id: number;
  titre: string;
  description?: string;
  fichier_path: string;
  fichier_url: string;
  is_active: boolean;
  created_at: string;
}

export interface NumeroUtile {
  id: number;
  categorie: string;
  label: string;
  numero: string;
  description?: string | null;
  ordre: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  ordre: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaiementFormationInitierPayload {
  participant_nom: string;
  participant_prenoms: string;
  participant_email: string;
  participant_phone?: string;
  categorie_acteur?: string;
}

export interface PaiementFormationInitierResponse {
  inscription_id: number;
  payment_url: string;
  transaction_id: string;
  amount: number;
  currency: string;
  cinetpay_configured: boolean;
}

export interface FormationInscriptionRead {
  id: number;
  formation_id: number;
  user_id?: string | null;
  participant_name: string;
  participant_nom?: string | null;
  participant_prenoms?: string | null;
  participant_email: string;
  participant_phone?: string | null;
  categorie_acteur?: string | null;
  is_completed: boolean;
  completed_at?: string | null;
  certificate_issued: boolean;
  payment_status: 'gratuite' | 'pending' | 'soumis' | 'confirmed' | 'failed' | 'paid' | string;
  payment_transaction_id?: string | null;
  payment_amount?: number | null;
  payment_date?: string | null;
  payment_operator?: string | null;
  created_at: string;
}

export interface SoumettrePaiementPayload {
  transaction_id: string;
  operateur?: 'wave' | 'orange_money' | string | null;
}

export interface DonCreatePayload {
  nom: string;
  prenoms?: string;
  fonction?: string;
  sexe?: string;
  tranche_age?: string;
  email: string;
  telephone?: string;
  pays?: string;
  lieu_residence?: string;
  montant: number;
  message?: string;
}

export interface DonCreateResponse {
  don_id: number;
  statut: string;
}

export interface DonRead {
  id: number;
  nom: string;
  prenoms?: string | null;
  fonction?: string | null;
  sexe?: string | null;
  tranche_age?: string | null;
  email: string;
  telephone?: string | null;
  pays?: string | null;
  lieu_residence?: string | null;
  montant: number;
  message?: string | null;
  transaction_id?: string | null;
  operateur?: string | null;
  statut: string;
  created_at: string;
}

export interface DonInitierPayload extends DonCreatePayload {}

export interface DonInitierResponse {
  don_id: number;
  transaction_id: string;
  payment_url: string;
  simulated: boolean;
}

export interface PTF {
  id: number;
  name: string;
  slug: string;
  description?: string;
  mission?: string;
  vision?: string;
  thumbnail_url?: string;
  thumbnail_path?: string;
  cover_url?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  pays?: string;
  date_creation?: string;
  domaines?: string;
  domaines_list?: string[];
  projets?: any[];
}

export interface OffreProjet {
  id: string;
  nom: string;
  slug: string;
  osc: string;
  domaine: string;
  zone: string;
  durée: string;
  budget: string;
  objectif?: string;
  description?: string;
  beneficiaires?: string;
  statut: string;
  progression: number;
  resultats_attendus?: string;
  partenaires?: string;
  resultats_attendus_list?: string[];
  partenaires_list?: string[];
  image_url?: string;
  image_path?: string;
  offre_url?: string | null;
  dossier_url?: string;
  date_publication: string;
  created_at: string;
  updated_at: string;
}

export interface PoleConcertation {
  id: number;
  name: string;
  slug: string;
  category?: string;
  description?: string;
  image_path?: string;
  objectifs?: string;
  objectifs_list?: string[];
  is_active: boolean;
  sujets_count: number;
  created_at: string;
}

export interface ForumSujet {
  id: number;
  title: string;
  slug: string;
  content: string;
  pole_id: number;
  author_id?: string;
  author_name?: string;
  is_pinned: boolean;
  views_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface ForumCommentaire {
  id: number;
  content: string;
  author_id?: string;
  author_name?: string;
  sujet_id: number;
  created_at: string;
  updated_at: string;
}

export interface ForumSujetDetail extends ForumSujet {
  commentaires: ForumCommentaire[];
}

export interface KeyStats {
  id: number;
  name: string;
  number: number;
}

export interface DashboardStats {
  crasc?: { total?: number };
  regions?: { total?: number };
  osc?: { total?: number };
  jobs?: { active?: number };
}

export interface VisiteStats {
  total: number;
  visiteurs_uniques?: number;
  aujourd_hui?: number;
  hier?: number;
  semaine?: number;
  mois?: number;
}

export interface Documentation {
  id: number;
  title: string;
  slug: string;
  description?: string;
  file_url?: string;
  file_path?: string;
  file_size?: number;
  file_type?: string;
  type?: string;
  created_at: string;
  updated_at?: string;
}
