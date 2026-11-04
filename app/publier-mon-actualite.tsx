import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Newspaper, ImagePlus, X, Send, Clock, CheckCircle2, XCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';
import { FichierLocal, MaNews } from '../services/types';

/** Retrait du site après ce délai (comme sur le site : 3 mois proposés). */
const DELAIS = [
  { libelle: '1 mois', mois: 1 },
  { libelle: '3 mois', mois: 3 },
  { libelle: '6 mois', mois: 6 },
  { libelle: 'Jamais', mois: 0 },
];

function dateDansMois(mois: number): string {
  if (!mois) return '';
  const d = new Date();
  d.setMonth(d.getMonth() + mois);
  return d.toISOString().slice(0, 10);
}

const ETATS: Record<string, { libelle: string; couleur: string; fond: string }> = {
  en_attente: { libelle: 'En attente de validation', couleur: '#B45309', fond: '#FEF3C7' },
  publie: { libelle: 'Publiée', couleur: '#15803D', fond: '#DCFCE7' },
  rejete: { libelle: 'Refusée', couleur: '#B91C1C', fond: '#FEE2E2' },
};

export default function PublierMonActualiteScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [titre, setTitre] = useState('');
  const [texte, setTexte] = useState('');
  const [image, setImage] = useState<FichierLocal | null>(null);
  const [delai, setDelai] = useState(3);

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getCurrentUser,
    retry: false,
  });

  const { data: mesActualites = [] } = useQuery({
    queryKey: ['mes-actualites'],
    queryFn: dataService.mesActualites,
    enabled: !!user?.osc_id,
  });

  const publication = useMutation({
    mutationFn: () =>
      dataService.publierMonActualite(
        { title: titre.trim(), content: texte.trim(), date_expiration: dateDansMois(delai) },
        image,
      ),
    onSuccess: () => {
      setTitre('');
      setTexte('');
      setImage(null);
      setDelai(3);
      queryClient.invalidateQueries({ queryKey: ['mes-actualites'] });
      Alert.alert('Actualité envoyée', 'Elle sera publiée après validation par votre CRASC.');
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail;
      Alert.alert('Publication impossible', typeof detail === 'string' ? detail : 'Réessayez dans un instant.');
    },
  });

  const publier = () => {
    if (!titre.trim() || !texte.trim()) {
      Alert.alert('Champs obligatoires', "Le titre et le texte de l'actualité sont obligatoires.");
      return;
    }
    publication.mutate();
  };

  const choisirImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Accès refusé', 'Autorisez l’accès à vos photos dans les réglages du téléphone.');
      return;
    }
    const resultat = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
    });
    if (resultat.canceled) return;
    const a = resultat.assets[0];
    const type = a.mimeType || 'image/jpeg';
    setImage({ uri: a.uri, name: a.fileName || `actualite-${Date.now()}.jpg`, type, taille: a.fileSize, genre: 'image' });
  };

  const champ = 'bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3">
          <ChevronLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Publier mon actualité</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm mb-6">
          Partagez les activités de votre OSC. Votre actualité est relue par votre CRASC, puis publiée sur la PdoC et sur
          le profil de votre OSC.
        </Text>

        {isLoading ? (
          <ActivityIndicator color="#E05017" />
        ) : !user ? (
          <View className="bg-blue-50 rounded-3xl p-6 items-center">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-700 text-sm text-center mb-4">
              Connectez-vous avec le compte de votre OSC pour publier une actualité.
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')} className="bg-[#E05017] px-6 py-3 rounded-full">
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white text-sm">Se connecter</Text>
            </TouchableOpacity>
          </View>
        ) : !user.osc_id ? (
          <View className="bg-amber-50 rounded-3xl p-6">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-amber-800 text-sm">
              Votre compte n'est rattaché à aucune OSC. Seules les OSC membres de la PdoC peuvent publier leurs actualités.
            </Text>
          </View>
        ) : (
          <>
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-700 text-xs uppercase tracking-widest mb-2">Titre *</Text>
            <TextInput value={titre} onChangeText={setTitre} maxLength={200} className={`${champ} mb-5`} placeholder="Ex : Journée de sensibilisation à Agboville" placeholderTextColor="#9CA3AF" />

            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-700 text-xs uppercase tracking-widest mb-2">Texte de l'actualité *</Text>
            <TextInput
              value={texte}
              onChangeText={setTexte}
              multiline
              className={`${champ} mb-5 min-h-[140px]`}
              style={{ textAlignVertical: 'top' }}
              placeholder="Racontez ce que votre OSC a fait…"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-700 text-xs uppercase tracking-widest mb-2">Image (facultative)</Text>
            {image ? (
              <View className="mb-5">
                <Image source={{ uri: image.uri }} style={{ width: '100%', height: 180, borderRadius: 20 }} resizeMode="cover" />
                <TouchableOpacity onPress={() => setImage(null)} className="absolute top-2 right-2 bg-white/90 w-8 h-8 rounded-full items-center justify-center">
                  <X size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={choisirImage} className="flex-row items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl py-6 mb-5">
                <ImagePlus size={20} color="#9CA3AF" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm ml-2">Choisir une photo</Text>
              </TouchableOpacity>
            )}

            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-700 text-xs uppercase tracking-widest mb-2">Retirer du site après</Text>
            <View className="flex-row flex-wrap mb-1">
              {DELAIS.map((d) => (
                <TouchableOpacity
                  key={d.mois}
                  onPress={() => setDelai(d.mois)}
                  className={`px-4 py-2 rounded-full border mr-2 mb-2 ${delai === d.mois ? 'bg-brand-orange border-brand-orange' : 'bg-gray-50 border-gray-200'}`}
                >
                  <Text style={{ fontFamily: 'Karla_700Bold' }} className={`text-xs ${delai === d.mois ? 'text-white' : 'text-gray-600'}`}>{d.libelle}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs mb-6">
              Ensuite, elle reste dans les archives de votre OSC.
            </Text>

            <TouchableOpacity
              onPress={publier}
              disabled={publication.isPending}
              className={`flex-row items-center justify-center bg-brand-orange py-4 rounded-2xl ${publication.isPending ? 'opacity-60' : ''}`}
            >
              {publication.isPending ? <ActivityIndicator color="white" /> : <Send size={16} color="white" />}
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-sm ml-2">
                {publication.isPending ? 'Envoi…' : 'Publier mon actualité'}
              </Text>
            </TouchableOpacity>

            {mesActualites.length > 0 && (
              <View className="mt-10">
                <View className="flex-row items-center mb-4">
                  <Newspaper size={18} color="#E05017" />
                  <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base ml-2">Mes actualités</Text>
                </View>
                {mesActualites.map((n: MaNews) => {
                  const etat = ETATS[n.statut_publication] ?? ETATS.en_attente;
                  const libelle = n.est_archivee && n.statut_publication === 'publie' ? 'Archivée' : etat.libelle;
                  const Icone = n.statut_publication === 'publie' ? CheckCircle2 : n.statut_publication === 'rejete' ? XCircle : Clock;
                  return (
                    <TouchableOpacity
                      key={n.id}
                      disabled={n.statut_publication !== 'publie'}
                      onPress={() => router.push(`/news-details/${n.slug}`)}
                      className="bg-white border border-gray-100 rounded-2xl p-4 mb-3"
                    >
                      <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm" numberOfLines={2}>{n.title}</Text>
                      <View className="flex-row items-center justify-between mt-2">
                        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[11px]">
                          {new Date(n.created_at).toLocaleDateString('fr-FR')}
                        </Text>
                        <View style={{ backgroundColor: etat.fond }} className="flex-row items-center px-2.5 py-1 rounded-full">
                          <Icone size={12} color={etat.couleur} />
                          <Text style={{ fontFamily: 'Karla_700Bold', color: etat.couleur }} className="text-[10px] ml-1">{libelle}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
