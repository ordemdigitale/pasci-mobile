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
  organizationType: string;
  region: string;
  city: string;
  email: string;
  phone: string;
  description: string;
  motivation: string;
};

const INITIAL_FORM: FormState = {
  organizationName: '',
  organizationType: '',
  region: '',
  city: '',
  email: '',
  phone: '',
  description: '',
  motivation: '',
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

export default function RejoindreScreen() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const e = validate(form);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setLoading(true);
    // TODO: remplacer par l'endpoint API quand disponible
    setTimeout(() => {
      setLoading(false);
      setForm(INITIAL_FORM);
      setErrors({});
      Alert.alert('Demande soumise !', 'Votre demande d\'adhésion a bien été soumise. Nous vous contacterons prochainement.');
    }, 1200);
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
