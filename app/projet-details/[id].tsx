import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Share, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  Calendar,
  Coins,
  CheckCircle2,
  FileDown,
  Clock,
  MapPin,
  TrendingUp,
  Target,
  Users
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';

const STATUT_COLORS: Record<string, { bg: string; text: string }> = {
  ouvert: { bg: '#DCFCE7', text: '#166534' },
  en_cours: { bg: '#DBEAFE', text: '#1D4ED8' },
  fermé: { bg: '#FEE2E2', text: '#991B1B' },
  clôturé: { bg: '#FEE2E2', text: '#991B1B' },
};

export default function ProjetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const slug = id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['offre-projet', slug],
    queryFn: () => dataService.getOffreProjetBySlug(slug),
    enabled: !!slug,
  });

  const onShare = async () => {
    if (!data) return;
    try {
      await Share.share({ message: `Appel à projets PASCI : ${data.nom}` });
    } catch (error) { console.log(error); }
  };

  const getStatutStyle = (statut?: string) => {
    const key = (statut || '').toLowerCase().replace(' ', '_');
    return STATUT_COLORS[key] || { bg: '#F3F4F6', text: '#6B7280' };
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="px-6 py-4 flex-row justify-between items-center">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={120} height={20} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <Skeleton width="100%" height={250} />
        <View className="px-8 mt-6">
          <Skeleton width="90%" height={28} style={{ marginBottom: 10 }} />
          <Skeleton width="60%" height={28} style={{ marginBottom: 20 }} />
          <View className="flex-row justify-between mb-8">
            <Skeleton width="48%" height={80} borderRadius={20} />
            <Skeleton width="48%" height={80} borderRadius={20} />
          </View>
          <Skeleton width="100%" height={150} borderRadius={20} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <Target size={60} color="#D1D5DB" />
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-center px-8 mt-4">
          Appel à projet introuvable ou indisponible.
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-brand-orange px-8 py-3 rounded-2xl">
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white">Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statutStyle = getStatutStyle(data.statut);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white z-10">
        <TouchableOpacity onPress={() => router.back()} className="bg-orange-50 p-2 rounded-full">
          <ChevronLeft size={24} color="#E05017" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Détails du Projet</Text>
        <TouchableOpacity onPress={onShare} className="bg-gray-50 p-2 rounded-full">
          <Share2 size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero Image */}
        <View>
          {data.image_url ? (
            <Image source={{ uri: data.image_url }} className="w-full h-64" resizeMode="cover" />
          ) : (
            <View className="w-full h-64 bg-orange-50 items-center justify-center">
              <TrendingUp size={64} color="#E05017" />
            </View>
          )}
          {data.domaine && (
            <View className="absolute top-6 right-6 bg-white/90 px-3 py-1 rounded-xl">
              <Text className="text-brand-orange text-[10px] font-bold uppercase">{data.domaine}</Text>
            </View>
          )}
        </View>

        {/* Content Card */}
        <View className="bg-white -mt-10 rounded-t-[40px] px-8 pt-8">
          {/* Statut badge */}
          <View style={{ backgroundColor: statutStyle.bg }} className="self-start px-4 py-1.5 rounded-xl mb-4">
            <Text style={{ color: statutStyle.text }} className="text-xs font-bold uppercase">{data.statut}</Text>
          </View>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl leading-9 mb-2">
            {data.nom}
          </Text>
          {data.osc && (
            <View className="flex-row items-center mb-6">
              <Users size={14} color="#9CA3AF" />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-500 text-xs ml-2">{data.osc}</Text>
            </View>
          )}

          {/* Key Info Cards */}
          <View className="flex-row justify-between mb-6">
            {data.date_publication && (
              <View className="bg-orange-50/50 border border-orange-100 p-4 rounded-[24px] flex-1 mr-3">
                <View className="flex-row items-center mb-2">
                  <Calendar size={14} color="#E05017" />
                  <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-[9px] uppercase ml-2 tracking-widest">Publication</Text>
                </View>
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm">
                  {new Date(data.date_publication).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            )}
            {data.budget && (
              <View className="bg-green-50/50 border border-green-100 p-4 rounded-[24px] flex-1">
                <View className="flex-row items-center mb-2">
                  <Coins size={14} color="#10B981" />
                  <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-green-600 text-[9px] uppercase ml-2 tracking-widest">Budget</Text>
                </View>
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm" numberOfLines={2}>
                  {data.budget}
                </Text>
              </View>
            )}
          </View>

          {/* Progression */}
          {data.progression > 0 && (
            <View className="mb-8 bg-gray-50 rounded-3xl p-5 border border-gray-100">
              <View className="flex-row justify-between items-center mb-3">
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm">Avancement</Text>
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-sm">{data.progression}%</Text>
              </View>
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-brand-orange rounded-full"
                  style={{ width: `${Math.min(data.progression, 100)}%` }}
                />
              </View>
            </View>
          )}

          {/* Zone géographique */}
          {data.zone && (
            <View className="flex-row items-center mb-8 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
              <MapPin size={16} color="#E05017" />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-700 ml-2 text-sm">{data.zone}</Text>
            </View>
          )}

          {/* Durée */}
          {data.durée && (
            <View className="flex-row items-center mb-8 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
              <Clock size={16} color="#E05017" />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-700 ml-2 text-sm">Durée : {data.durée} mois</Text>
            </View>
          )}

          {/* Objectif */}
          {data.objectif && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Objectif</Text>
              </View>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-base">
                {data.objectif}
              </Text>
            </View>
          )}

          {/* Description */}
          {data.description && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Description</Text>
              </View>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-base">
                {data.description}
              </Text>
            </View>
          )}

          {/* Bénéficiaires */}
          {data.beneficiaires && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Bénéficiaires</Text>
              </View>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-base">
                {data.beneficiaires}
              </Text>
            </View>
          )}

          {/* Résultats attendus */}
          {data.resultats_attendus_list && data.resultats_attendus_list.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Résultats attendus</Text>
              </View>
              {data.resultats_attendus_list.map((item, index) => (
                <View key={index} className="flex-row items-start mb-4">
                  <View className="mt-1">
                    <CheckCircle2 size={18} color="#E05017" />
                  </View>
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm ml-3 flex-1 leading-5">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Partenaires */}
          {data.partenaires_list && data.partenaires_list.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Partenaires</Text>
              </View>
              <View className="flex-row flex-wrap">
                {data.partenaires_list.map((p, i) => (
                  <View key={i} className="bg-gray-50 px-4 py-2 rounded-xl mr-2 mb-2 border border-gray-100">
                    <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-500 text-xs">{p}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* CTA */}
          <TouchableOpacity
            onPress={() => data.dossier_url ? Linking.openURL(data.dossier_url) : null}
            disabled={!data.dossier_url}
            className={`border-2 border-brand-orange py-5 rounded-[24px] items-center flex-row justify-center mb-6 ${!data.dossier_url ? 'opacity-40' : ''}`}
          >
            <FileDown size={20} color="#E05017" />
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-lg ml-2">Télécharger le dossier</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
