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
  news_items?: { id: number; title: string; slug: string; thumbnail_url?: string; created_at: string }[];
  tags?: string[];
  type_document_formalisation?: string | null;
  existence_siege?: boolean | null;
  manuel_procedures?: boolean | null;
  plan_action?: boolean | null;
  rapports_annuels?: boolean | null;
  adhesion_crasc?: boolean | null;
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
