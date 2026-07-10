import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/dataService';

const ORGANIZATION_TYPES = [
  { value: 'Association', label: 'Association' },
  { value: 'ONG', label: 'ONG' },
  { value: 'Fondation', label: 'Fondation' },
  { value: 'Coopérative', label: 'Coopérative' },
  { value: 'Groupement', label: 'Groupement' },
  { value: 'Réseau', label: 'Réseau' },
  { value: 'Autre', label: 'Autre' },
];

const REGIONS = [
  { value: "District Autonome d'Abidjan", label: "District Autonome d'Abidjan" },
  { value: 'District Autonome de Yamoussoukro', label: 'District Autonome de Yamoussoukro' },
  { value: 'Agnéby-Tiassa', label: 'Agnéby-Tiassa' },
  { value: 'Bafing', label: 'Bafing' },
  { value: 'Bagoué', label: 'Bagoué' },
  { value: 'Béré', label: 'Béré' },
  { value: 'Bélier', label: 'Bélier' },
  { value: 'Bounkani', label: 'Bounkani' },
  { value: 'Cavally', label: 'Cavally' },
  { value: 'Folon', label: 'Folon' },
  { value: 'Gbêkê', label: 'Gbêkê' },
  { value: 'Gbôklé', label: 'Gbôklé' },
  { value: 'Gôh', label: 'Gôh' },
  { value: 'Gontougo', label: 'Gontougo' },
  { value: 'Grands-Ponts', label: 'Grands-Ponts' },
  { value: 'Guémon', label: 'Guémon' },
  { value: 'Hambol', label: 'Hambol' },
  { value: 'Haut-Sassandra', label: 'Haut-Sassandra' },
  { value: 'Iffou', label: 'Iffou' },
  { value: 'Indénié-Djuablin', label: 'Indénié-Djuablin' },
  { value: 'Kabadougou', label: 'Kabadougou' },
  { value: 'La Mé', label: 'La Mé' },
  { value: 'Loh-Djiboua', label: 'Loh-Djiboua' },
  { value: 'Marahoué', label: 'Marahoué' },
  { value: 'Moronou', label: 'Moronou' },
  { value: 'Nawa', label: 'Nawa' },
  { value: "N'Zi", label: "N'Zi" },
  { value: 'Poro', label: 'Poro' },
  { value: 'San-Pédro', label: 'San-Pédro' },
  { value: 'Sud-Comoé', label: 'Sud-Comoé' },
  { value: 'Tchologo', label: 'Tchologo' },
  { value: 'Tonkpi', label: 'Tonkpi' },
  { value: 'Worodougou', label: 'Worodougou' },
];

const ORIGINE_OPTIONS = [
  { value: 'cote_ivoire', label: "Côte d'Ivoire" },
  { value: 'etranger', label: "À l'étranger" },
];

const BOOLEAN_OPTIONS = [
  { value: 'true', label: 'Oui' },
  { value: 'false', label: 'Non' },
];

const FORMALISATION_OPTIONS = [
  { value: 'statuts_reglement', label: 'Statut et règlement' },
  { value: 'recepisse_depot', label: 'Récépissé de dépôt' },
  { value: 'recepisse_declaration', label: 'Récépissé de déclaration' },
  { value: 'agrement_decret', label: 'Agrément / décret' },
  { value: 'journal_officiel', label: 'Déclaration au journal officiel' },
];

const CATEGORIE_OPTIONS = [
  { value: 'organisation_jeune', label: 'Organisation de jeune (ODJ)' },
  { value: 'organisation_femme', label: 'Organisation de femme' },
  { value: 'organisation_mixte', label: 'Organisation mixte' },
];

const NIVEAU_REGROUPEMENT_OPTIONS = [
  { value: 'Simple', label: 'Simple' },
  { value: 'Réseau', label: 'Réseau' },
  { value: 'Fédération', label: 'Fédération' },
  { value: 'Plateforme', label: 'Plateforme' },
  { value: 'Confédération', label: 'Confédération' },
];

const ADHESION_CRASC_OPTIONS = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
  { value: 'en_cours', label: 'En cours' },
];

type SelectPickerProps = {
  label: string;
  required?: boolean;
  placeholder: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

function SelectPicker({ label, required, placeholder, value, options, onChange }: SelectPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View>
      <Text className="text-gray-700 text-sm mb-1" style={{ fontFamily: 'Karla-Regular' }}>
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <TouchableOpacity
        className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 flex-row items-center justify-between"
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text
          className={selected ? 'text-gray-900 text-sm' : 'text-gray-400 text-sm'}
          style={{ fontFamily: 'Karla-Regular' }}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown size={16} color="#9ca3af" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <TouchableOpacity
          className="flex-1 bg-black/40"
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl pb-8">
            <View className="px-4 py-3 border-b border-gray-100 flex-row items-center justify-between">
              <Text className="text-gray-900 font-semibold text-base" style={{ fontFamily: 'Poppins-SemiBold' }}>
                {label}
              </Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text className="text-[#E05017] text-sm" style={{ fontFamily: 'Karla-Regular' }}>Fermer</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              style={{ maxHeight: 360 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center justify-between px-4 py-3 border-b border-gray-50"
                  onPress={() => { onChange(item.value); setOpen(false); }}
                >
                  <Text className="text-gray-800 text-sm" style={{ fontFamily: 'Karla-Regular' }}>
                    {item.label}
                  </Text>
                  {value === item.value && <Check size={16} color="#E05017" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

type FormState = {
  organizationName: string;
  sigle: string;
  organizationType: string;
  crascNom: string;
  typeOsc: string;
  region: string;
  departement: string;
  sousPrefecture: string;
  city: string;
  origineOrganisation: string;
  email: string;
  phone: string;
  description: string;
  motivation: string;
  typeDocumentFormalisation: string;
  existenceSiege: string;
  categorie: string;
  niveauRegroupement: string;
  domainePrioritaire: string;
  domainePrioritaire2: string;
  domainePrioritaire3: string;
  domainePrioritaire4: string;
  domainePrioritaire5: string;
  nbMembres: string;
  nbFemmesMembres: string;
  nbHommesMembres: string;
  nbMembresJeunes: string;
  nbMembresHandicap: string;
  nbMembresBe: string;
  nombreMandatsBe: string;
  dureeMandatBe: string;
  nbBeneficiaires: string;
  nbFemmesBeneficiaires: string;
  nbJeunesBeneficiaires: string;
  nbBeneficiairesHandicap: string;
  adhesionCrascStatut: string;
  organesGouvernance: string;
  paysCouverture: string;
  nbPersonnesEngagees: string;
  nbCdi: string;
  nbCdd: string;
  dateDesignationResponsable: string;
  dateProchaineDesignation: string;
  manuelProcedures: string;
  planActionAnneeCours: string;
  planActionAnneeCoursDetails: string;
  planAction: string;
  nbActivites: string;
  dateDerniereActivite: string;
  rapportsAnnuels: string;
  recommandations: string;
  recommandations2: string;
};

const INITIAL_FORM: FormState = {
  organizationName: '',
  sigle: '',
  organizationType: '',
  crascNom: '',
  typeOsc: '',
  region: '',
  departement: '',
  sousPrefecture: '',
  city: '',
  origineOrganisation: '',
  email: '',
  phone: '',
  description: '',
  motivation: '',
  typeDocumentFormalisation: '',
  existenceSiege: '',
  categorie: '',
  niveauRegroupement: '',
  domainePrioritaire: '',
  domainePrioritaire2: '',
  domainePrioritaire3: '',
  domainePrioritaire4: '',
  domainePrioritaire5: '',
  nbMembres: '',
  nbFemmesMembres: '',
  nbHommesMembres: '',
  nbMembresJeunes: '',
  nbMembresHandicap: '',
  nbMembresBe: '',
  nombreMandatsBe: '',
  dureeMandatBe: '',
  nbBeneficiaires: '',
  nbFemmesBeneficiaires: '',
  nbJeunesBeneficiaires: '',
  nbBeneficiairesHandicap: '',
  adhesionCrascStatut: '',
  organesGouvernance: '',
  paysCouverture: '',
  nbPersonnesEngagees: '',
  nbCdi: '',
  nbCdd: '',
  dateDesignationResponsable: '',
  dateProchaineDesignation: '',
  manuelProcedures: '',
  planActionAnneeCours: '',
  planActionAnneeCoursDetails: '',
  planAction: '',
  nbActivites: '',
  dateDerniereActivite: '',
  rapportsAnnuels: '',
  recommandations: '',
  recommandations2: '',
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.organizationName.trim()) errors.organizationName = "Le nom de l'organisation est requis";
  else if (form.organizationName.trim().length < 2) errors.organizationName = 'Le nom doit contenir au moins 2 caractères';
  if (!form.organizationType) errors.organizationType = "Sélectionnez un type d'organisation";
  if (!form.region) errors.region = 'Sélectionnez une région';
  if (!form.email.trim()) errors.email = "L'email est requis";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Veuillez entrer une adresse email valide';
  if (!form.phone.trim()) errors.phone = 'Le numéro de téléphone est requis';
  else if (!/^[+\d\s\-()]+$/.test(form.phone)) errors.phone = 'Veuillez entrer un numéro de téléphone valide';
  if (!form.motivation.trim()) errors.motivation = 'Veuillez expliquer votre motivation';
  else if (form.motivation.trim().length < 10) errors.motivation = 'La motivation doit contenir au moins 10 caractères';
  return errors;
}

const emptyToNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const toNumber = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

const toBool = (value: string) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
};

export default function RejoindreScreen() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const { data: crascs = [] } = useQuery({
    queryKey: ['adhesion-crascs'],
    queryFn: dataService.getCrascs,
  });

  const { data: oscTypes = [] } = useQuery({
    queryKey: ['adhesion-osc-types'],
    queryFn: dataService.getOscTypes,
  });

  const crascOptions = crascs.map((c) => ({ value: c.name, label: c.name }));
  const oscTypeOptions = oscTypes.map((t) => ({ value: t.name, label: t.name }));

  const set = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const getErrorMessage = (error: unknown): string => {
    const detail = (error as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail[0]?.msg || 'Impossible de soumettre votre demande.';
    }
    return 'Impossible de soumettre votre demande. Verifiez votre connexion et reessayez.';
  };

  const renderInput = (
    field: keyof FormState,
    label: string,
    placeholder = '',
    keyboardType: 'default' | 'number-pad' = 'default'
  ) => (
    <View>
      <Text className="text-gray-700 text-sm mb-1" style={{ fontFamily: 'Karla-Regular' }}>
        {label}
      </Text>
      <TextInput
        className="border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
        style={{ fontFamily: 'Karla-Regular' }}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={form[field]}
        onChangeText={set(field)}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderTextarea = (field: keyof FormState, label: string, placeholder = '') => (
    <View>
      <Text className="text-gray-700 text-sm mb-1" style={{ fontFamily: 'Karla-Regular' }}>
        {label}
      </Text>
      <TextInput
        className="border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
        style={{ fontFamily: 'Karla-Regular', textAlignVertical: 'top' }}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={form[field]}
        onChangeText={set(field)}
        multiline
        numberOfLines={4}
      />
    </View>
  );

  const handleSubmit = async () => {
    const e = validate(form);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setLoading(true);
    try {
      await dataService.submitAdhesion({
        nom_organisation: form.organizationName.trim(),
        sigle: emptyToNull(form.sigle),
        type_organisation: form.organizationType,
        crasc_nom: form.crascNom || undefined,
        type_osc: form.typeOsc || undefined,
        region: form.region,
        departement: emptyToNull(form.departement),
        sous_prefecture: emptyToNull(form.sousPrefecture),
        ville: form.city.trim() || undefined,
        origine_organisation: emptyToNull(form.origineOrganisation),
        email: form.email.trim(),
        telephone: form.phone.trim(),
        description: form.description.trim() || undefined,
        motivation: form.motivation.trim(),
        type_document_formalisation: emptyToNull(form.typeDocumentFormalisation),
        existence_siege: toBool(form.existenceSiege),
        categorie: emptyToNull(form.categorie),
        niveau_regroupement: emptyToNull(form.niveauRegroupement),
        domaine_prioritaire: emptyToNull(form.domainePrioritaire),
        domaine_prioritaire_2: emptyToNull(form.domainePrioritaire2),
        domaine_prioritaire_3: emptyToNull(form.domainePrioritaire3),
        domaine_prioritaire_4: emptyToNull(form.domainePrioritaire4),
        domaine_prioritaire_5: emptyToNull(form.domainePrioritaire5),
        nb_membres: toNumber(form.nbMembres),
        nb_femmes_membres: toNumber(form.nbFemmesMembres),
        nb_hommes_membres: toNumber(form.nbHommesMembres),
        nb_membres_jeunes: toNumber(form.nbMembresJeunes),
        nb_membres_handicap: toNumber(form.nbMembresHandicap),
        nb_membres_be: toNumber(form.nbMembresBe),
        nombre_mandats_be: toNumber(form.nombreMandatsBe),
        duree_mandat_be: emptyToNull(form.dureeMandatBe),
        nb_beneficiaires: toNumber(form.nbBeneficiaires),
        nb_femmes_beneficiaires: toNumber(form.nbFemmesBeneficiaires),
        nb_jeunes_beneficiaires: toNumber(form.nbJeunesBeneficiaires),
        nb_beneficiaires_handicap: toNumber(form.nbBeneficiairesHandicap),
        adhesion_crasc_statut: emptyToNull(form.adhesionCrascStatut),
        organes_gouvernance: emptyToNull(form.organesGouvernance),
        pays_couverture: emptyToNull(form.paysCouverture),
        nb_personnes_engagees: toNumber(form.nbPersonnesEngagees),
        nb_cdi: toNumber(form.nbCdi),
        nb_cdd: toNumber(form.nbCdd),
        date_designation_responsable: emptyToNull(form.dateDesignationResponsable),
        date_prochaine_designation: emptyToNull(form.dateProchaineDesignation),
        manuel_procedures: toBool(form.manuelProcedures),
        plan_action_annee_cours: toBool(form.planActionAnneeCours),
        plan_action_annee_cours_details: emptyToNull(form.planActionAnneeCoursDetails),
        plan_action: toBool(form.planAction),
        nb_activites: toNumber(form.nbActivites),
        date_derniere_activite: emptyToNull(form.dateDerniereActivite),
        rapports_annuels: toBool(form.rapportsAnnuels),
        recommandations: emptyToNull(form.recommandations),
        recommandations_2: emptyToNull(form.recommandations2),
      });

      setLoading(false);
      setForm(INITIAL_FORM);
      setErrors({});
      Alert.alert('Demande soumise', 'Votre demande d\'adhesion a bien ete soumise. Nous vous contacterons prochainement.');
    } catch (error: unknown) {
      setLoading(false);
      Alert.alert('Echec de la soumission', getErrorMessage(error));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins-Bold' }}>
          Formulaire d'adhésion
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24, paddingBottom: 48 }}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-[#2a591d] mb-1" style={{ fontFamily: 'Poppins-Bold' }}>
            FORMULAIRE D'ADHÉSION
          </Text>
          <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Karla-Regular' }}>
            Remplissez ce formulaire pour soumettre votre demande d'adhésion.
          </Text>
        </View>

        <View className="space-y-5">
          {/* Nom de l'organisation */}
          <View>
            <Text className="text-gray-700 text-sm mb-1" style={{ fontFamily: 'Karla-Regular' }}>
              Nom de l'organisation <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
              style={{ fontFamily: 'Karla-Regular' }}
              placeholder="Nom légal de votre organisation"
              placeholderTextColor="#9ca3af"
              value={form.organizationName}
              onChangeText={set('organizationName')}
              autoCapitalize="words"
            />
            {errors.organizationName && (
              <Text className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Karla-Regular' }}>
                {errors.organizationName}
              </Text>
            )}
          </View>

          {renderInput('sigle', 'Sigle ou abréviation', 'Ex: APD')}

          {/* Type d'organisation */}
          <SelectPicker
            label="Type d'organisation"
            required
            placeholder="Sélectionnez un type"
            value={form.organizationType}
            options={ORGANIZATION_TYPES}
            onChange={set('organizationType')}
          />
          {errors.organizationType && (
            <Text className="text-red-500 text-xs -mt-4" style={{ fontFamily: 'Karla-Regular' }}>
              {errors.organizationType}
            </Text>
          )}

          <SelectPicker
            label="CRASC"
            placeholder="Selectionnez un CRASC"
            value={form.crascNom}
            options={crascOptions}
            onChange={set('crascNom')}
          />

          <SelectPicker
            label="Type OSC"
            placeholder="Selectionnez un type OSC"
            value={form.typeOsc}
            options={oscTypeOptions}
            onChange={set('typeOsc')}
          />

          {/* Région */}
          <SelectPicker
            label="Région"
            required
            placeholder="Sélectionnez une région"
            value={form.region}
            options={REGIONS}
            onChange={set('region')}
          />
          {errors.region && (
            <Text className="text-red-500 text-xs -mt-4" style={{ fontFamily: 'Karla-Regular' }}>
              {errors.region}
            </Text>
          )}

          {renderInput('departement', 'Département', 'Département')}
          {renderInput('sousPrefecture', 'Sous-préfecture', 'Sous-préfecture')}

          <SelectPicker
            label="L'organisation est née où ?"
            placeholder="Sélectionnez"
            value={form.origineOrganisation}
            options={ORIGINE_OPTIONS}
            onChange={set('origineOrganisation')}
          />

          {/* Ville */}
          <View>
            <Text className="text-gray-700 text-sm mb-1" style={{ fontFamily: 'Karla-Regular' }}>
              Ville
            </Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
              style={{ fontFamily: 'Karla-Regular' }}
              placeholder="Ville de votre siège"
              placeholderTextColor="#9ca3af"
              value={form.city}
              onChangeText={set('city')}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <View>
            <Text className="text-gray-700 text-sm mb-1" style={{ fontFamily: 'Karla-Regular' }}>
              Email <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
              style={{ fontFamily: 'Karla-Regular' }}
              placeholder="contact@organisation.com"
              placeholderTextColor="#9ca3af"
              value={form.email}
              onChangeText={set('email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Karla-Regular' }}>
                {errors.email}
              </Text>
            )}
          </View>

          {/* Téléphone */}
          <View>
            <Text className="text-gray-700 text-sm mb-1" style={{ fontFamily: 'Karla-Regular' }}>
              Téléphone <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
              style={{ fontFamily: 'Karla-Regular' }}
              placeholder="+225 07 XX XX XX XX"
              placeholderTextColor="#9ca3af"
              value={form.phone}
              onChangeText={set('phone')}
              keyboardType="phone-pad"
            />
            {errors.phone && (
              <Text className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Karla-Regular' }}>
                {errors.phone}
              </Text>
            )}
          </View>

          <View className="pt-3 border-t border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins-Bold' }}>
              Formalisation et autoévaluation
            </Text>
            <View className="space-y-4">
              <SelectPicker
                label="L'organisation a-t-elle un siège ?"
                placeholder="Sélectionnez"
                value={form.existenceSiege}
                options={BOOLEAN_OPTIONS}
                onChange={set('existenceSiege')}
              />
              <SelectPicker
                label="Document de formalisation"
                placeholder="Sélectionnez un document"
                value={form.typeDocumentFormalisation}
                options={FORMALISATION_OPTIONS}
                onChange={set('typeDocumentFormalisation')}
              />
              <SelectPicker
                label="Catégorie d'organisation"
                placeholder="Sélectionnez une catégorie"
                value={form.categorie}
                options={CATEGORIE_OPTIONS}
                onChange={set('categorie')}
              />
              <SelectPicker
                label="Niveau de regroupement"
                placeholder="Sélectionnez un niveau"
                value={form.niveauRegroupement}
                options={NIVEAU_REGROUPEMENT_OPTIONS}
                onChange={set('niveauRegroupement')}
              />
              <SelectPicker
                label="Adhésion au CRASC"
                placeholder="Sélectionnez un statut"
                value={form.adhesionCrascStatut}
                options={ADHESION_CRASC_OPTIONS}
                onChange={set('adhesionCrascStatut')}
              />
              <SelectPicker
                label="Existence de manuel de procédures"
                placeholder="Sélectionnez"
                value={form.manuelProcedures}
                options={BOOLEAN_OPTIONS}
                onChange={set('manuelProcedures')}
              />
              <SelectPicker
                label="Plan d'action pour l'année en cours ?"
                placeholder="Sélectionnez"
                value={form.planActionAnneeCours}
                options={BOOLEAN_OPTIONS}
                onChange={set('planActionAnneeCours')}
              />
              <SelectPicker
                label="L'organisation a-t-elle un plan d'action ?"
                placeholder="Sélectionnez"
                value={form.planAction}
                options={BOOLEAN_OPTIONS}
                onChange={set('planAction')}
              />
              <SelectPicker
                label="Rédigez-vous des rapports annuels d'activités ?"
                placeholder="Sélectionnez"
                value={form.rapportsAnnuels}
                options={BOOLEAN_OPTIONS}
                onChange={set('rapportsAnnuels')}
              />
              {renderTextarea('planActionAnneeCoursDetails', "Plan d'action pour l'année en cours et activités/initiatives à venir", 'Décrivez le plan et les activités à venir...')}
            </View>
          </View>

          <View className="pt-3 border-t border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins-Bold' }}>
              Domaines prioritaires
            </Text>
            <View className="space-y-4">
              {renderInput('domainePrioritaire', '1er domaine prioritaire', 'Domaine prioritaire')}
              {renderInput('domainePrioritaire2', '2ème domaine prioritaire', 'Domaine prioritaire')}
              {renderInput('domainePrioritaire3', '3ème domaine prioritaire', 'Domaine prioritaire')}
              {renderInput('domainePrioritaire4', '4ème domaine prioritaire', 'Domaine prioritaire')}
              {renderInput('domainePrioritaire5', '5ème domaine prioritaire', 'Domaine prioritaire')}
            </View>
          </View>

          <View className="pt-3 border-t border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins-Bold' }}>
              Membres et bénéficiaires
            </Text>
            <View className="space-y-4">
              {renderInput('nbMembres', 'Nombre total de membres', '0', 'number-pad')}
              {renderInput('nbFemmesMembres', "Nombre de femmes membres de l'OSC", '0', 'number-pad')}
              {renderInput('nbHommesMembres', "Nombre d'hommes membres de l'OSC", '0', 'number-pad')}
              {renderInput('nbMembresJeunes', 'Nombre de membres jeunes', '0', 'number-pad')}
              {renderInput('nbMembresHandicap', 'Nombre de membres en situation de handicap', '0', 'number-pad')}
              {renderInput('nbMembresBe', 'Nombre de membres du BE', '0', 'number-pad')}
              {renderInput('nbPersonnesEngagees', "Nombre total de personnes engagées dans l'OSC", '0', 'number-pad')}
              {renderInput('nbCdi', 'Nombre de personnes sous CDI', '0', 'number-pad')}
              {renderInput('nbCdd', 'Nombre de personnes sous CDD', '0', 'number-pad')}
              {renderInput('nbBeneficiaires', "Nombre total de bénéficiaires de l'année précédente", '0', 'number-pad')}
              {renderInput('nbFemmesBeneficiaires', "Nombre de femmes bénéficiaires de l'année précédente", '0', 'number-pad')}
              {renderInput('nbJeunesBeneficiaires', "Nombre de jeunes bénéficiaires de l'année précédente", '0', 'number-pad')}
              {renderInput('nbBeneficiairesHandicap', "Nombre de bénéficiaires en situation de handicap de l'année précédente", '0', 'number-pad')}
            </View>
          </View>

          <View className="pt-3 border-t border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins-Bold' }}>
              Gouvernance et activités
            </Text>
            <View className="space-y-4">
              {renderInput('nombreMandatsBe', 'Nombre de mandat du BE ou DE actuel', '0', 'number-pad')}
              {renderInput('dureeMandatBe', 'Durée de mandat du BE ou DE actuel (année)', 'Ex: 3 ans')}
              {renderInput('dateDesignationResponsable', "Date de désignation du/de la responsable actuel(le)", 'AAAA-MM-JJ')}
              {renderInput('dateProchaineDesignation', 'Prochaine date de désignation', 'AAAA-MM-JJ')}
              {renderInput('nbActivites', 'Nombre d’activités réalisées dans les 12 derniers mois', '0', 'number-pad')}
              {renderInput('dateDerniereActivite', 'Date de la dernière activité réalisée', 'AAAA-MM-JJ')}
              {renderTextarea('organesGouvernance', 'Organes de gouvernance', 'AG, CA, BE, CC, DE, CG, CS...')}
              {renderTextarea('paysCouverture', "Pays de couverture en plus de la Côte d'Ivoire", 'Citez au moins un pays si applicable...')}
            </View>
          </View>

          {/* Description */}
          <View>
            <Text className="text-gray-700 text-sm mb-1" style={{ fontFamily: 'Karla-Regular' }}>
              Description de votre organisation
            </Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
              style={{ fontFamily: 'Karla-Regular', textAlignVertical: 'top' }}
              placeholder="Décrivez brièvement votre organisation et ses activités..."
              placeholderTextColor="#9ca3af"
              value={form.description}
              onChangeText={set('description')}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Motivation */}
          <View>
            <Text className="text-gray-700 text-sm mb-1" style={{ fontFamily: 'Karla-Regular' }}>
              Motivation pour nous rejoindre <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
              style={{ fontFamily: 'Karla-Regular', textAlignVertical: 'top' }}
              placeholder="Pourquoi souhaitez-vous nous rejoindre ?"
              placeholderTextColor="#9ca3af"
              value={form.motivation}
              onChangeText={set('motivation')}
              multiline
              numberOfLines={4}
            />
            {errors.motivation && (
              <Text className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Karla-Regular' }}>
                {errors.motivation}
              </Text>
            )}
          </View>

          <View className="pt-3 border-t border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins-Bold' }}>
              Recommandations
            </Text>
            <View className="space-y-4">
              {renderTextarea('recommandations', 'Première recommandation', 'Votre recommandation...')}
              {renderTextarea('recommandations2', 'Deuxième recommandation', 'Votre recommandation...')}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            className="bg-[#E05017] rounded-lg py-4 items-center mt-2"
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-sm" style={{ fontFamily: 'Karla-Bold' }}>
                Soumettre la demande
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
