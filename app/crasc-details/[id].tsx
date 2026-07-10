import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Share, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  MapPin,
  Users,
  Calendar,
  Target,
  ChevronRight,
  Phone,
  Video,
  ExternalLink,
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import { CRASC_DATA } from '../../constants/crasc';
import OscEvaluationBadge from '../../components/OscEvaluationBadge';

const domainesIntervention = [
  'Gouvernance',
  'Développement durable',
  'Développement local',
  'Bien-être social',
  'Cohésion sociale',
];

const OSC_PER_PAGE = 5;

const formatDate = (value?: string) => {
  if (!value) return null;
  try {
    return new Date(value).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return value;
  }
};

export default function CrascDetailsScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['crasc-details', id],
    queryFn: () => dataService.getCrascBySlug(id as string),
    enabled: !!id,
  });

  const localData = CRASC_DATA.find(c => c.id === id);
  const data = apiData || localData;
  const oscMembers = apiData?.oscs || [];
  const totalPages = Math.ceil(oscMembers.length / OSC_PER_PAGE);
  const startIdx = (currentPage - 1) * OSC_PER_PAGE;
  const endIdx = startIdx + OSC_PER_PAGE;
  const paginatedOscMembers = oscMembers.slice(startIdx, endIdx);

  const onShare = async () => {
    if (!data) return;
    try {
      await Share.share({ message: `Découvrez le ${data.name} sur la plateforme PdoC.` });
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderHeader = () => {
    if (!data) return null;
    const dataAny = data as any;
    const regionsList = typeof data.regions === 'string' ? data.regions.split(', ') : data.regions?.map((r: any) => r.name) || [];
    const count = regionsList.length || dataAny.count || dataAny.region_count || 0;
    const regionName = dataAny.region_name || data.name || '';
    const oscCount = data.osc_count || oscMembers.length || 0;

    return (
      <View className="mb-4">
        {/* Stats Row */}
        <View className="flex-row justify-between gap-3 mb-6">
          <View className="bg-blue-50 rounded-3xl p-4 flex-1 items-center">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-blue-600 text-[9px] uppercase mb-1">OSC Membres</Text>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-blue-700 text-2xl">{oscCount}</Text>
          </View>
          <View className="bg-green-50 rounded-3xl p-4 flex-1 items-center">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-green-600 text-[9px] uppercase mb-1">Régions</Text>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-green-700 text-2xl">{count}</Text>
          </View>
          <View className="bg-orange-50 rounded-3xl p-4 flex-1 items-center">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-orange-600 text-[9px] uppercase mb-1">Zone</Text>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-orange-700 text-base text-center">{regionName}</Text>
          </View>
        </View>

        {/* Régions couvertes */}
        {regionsList && regionsList.length > 0 && (
          <View className="bg-white rounded-[28px] p-5 border border-gray-100 shadow-sm mb-4">
            <View className="flex-row items-center mb-4">
              <View className="w-9 h-9 bg-green-100 rounded-xl items-center justify-center mr-3">
                <MapPin size={18} color="#16A34A" />
              </View>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base">Régions Couvertes</Text>
            </View>
            {regionsList.map((region: any, idx: number) => (
              <View key={idx} className="flex-row items-center py-2 border-b border-gray-50">
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E', marginRight: 10 }} />
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-700 text-sm">{typeof region === 'string' ? region.trim() : region}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Domaines d'intervention */}
        <View className="bg-white rounded-[28px] p-5 border border-gray-100 shadow-sm mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-9 h-9 bg-purple-100 rounded-xl items-center justify-center mr-3">
              <Target size={18} color="#9333EA" />
            </View>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base">Domaines d'Intervention</Text>
          </View>
          {domainesIntervention.map((domaine, idx) => (
            <View key={idx} className="flex-row items-center py-2 border-b border-gray-50">
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#A855F7', marginRight: 10 }} />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-700 text-sm">{domaine}</Text>
            </View>
          ))}
        </View>

        {/* À propos du CRASC */}
        <View className="bg-white rounded-[28px] p-5 border border-gray-100 shadow-sm mb-4">
          <View className="flex-row items-center mb-3">
            <View className="w-9 h-9 bg-orange-100 rounded-xl items-center justify-center mr-3">
              <Users size={18} color="#E05017" />
            </View>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base">À Propos</Text>
          </View>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm leading-5">
            Le {dataAny.title || data.name} est un centre régional d'appui à la société civile couvrant {count} région{count > 1 ? 's' : ''} en Côte d'Ivoire.
          </Text>
        </View>
      </View>
    );
  };

  const renderOscItem = ({ item }) => (
    <View className="bg-white rounded-3xl mb-4 border border-gray-100 shadow-sm overflow-hidden">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push(`/osc-details/${item.slug || item.id}`)}
      >
        {item.thumbnail_url ? (
          <Image source={{ uri: item.thumbnail_url }} style={{ width: '100%', height: 120 }} resizeMode="cover" />
        ) : (
          <View style={{ width: '100%', height: 80, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#9CA3AF', fontWeight: 'bold', fontSize: 22 }}>
              {item.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        )}
        <View className="p-4">
          <View className="mb-2">
            <OscEvaluationBadge score={item.score_autoevaluation} color={item.couleur_autoevaluation} hex={item.couleur_autoevaluation_hex} compact />
          </View>
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm mb-1" numberOfLines={1}>
            {item.name}
          </Text>
          {item.description && (
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-[11px] leading-4 mb-2" numberOfLines={2}>
              {item.description}
            </Text>
          )}
          {item.ville && (
            <View className="flex-row items-center">
              <MapPin size={11} color="#9CA3AF" />
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1">{item.ville}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View className="flex-row border-t border-gray-100 px-4 py-3 gap-2">
        <TouchableOpacity
          onPress={() => router.push(`/osc-details/${item.slug || item.id}`)}
          className="flex-1 flex-row items-center justify-center bg-orange-50 rounded-lg py-2"
        >
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-brand-orange text-xs">
            Détails
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/contact')}
          className="flex-1 flex-row items-center justify-center bg-orange-50 rounded-lg py-2"
        >
          <Phone size={14} color="#E05017" style={{ marginRight: 4 }} />
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-brand-orange text-xs">
            Contact
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!data) return null;
    const evenements = (apiData as any)?.evenements || [];
    const videos = (apiData as any)?.videos || [];

    return (
      <View className="mt-8">
        {/* OSC Membres Section */}
        {oscMembers && oscMembers.length > 0 && (
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-9 h-9 bg-blue-100 rounded-xl items-center justify-center mr-3">
                <Users size={18} color="#2563EB" />
              </View>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base flex-1">OSC Membres</Text>
              <View className="bg-gray-100 px-3 py-1 rounded-full">
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-600 text-[10px]">
                  {oscMembers.length} organisation{oscMembers.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            {/* OSC Items */}
            {paginatedOscMembers.map((item: any, idx: number) => (
              <React.Fragment key={item.id || item.slug || idx}>
                {renderOscItem({ item })}
              </React.Fragment>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <View className="flex-row items-center justify-between mt-6 px-2">
                <TouchableOpacity
                  onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`flex-row items-center px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-100' : 'bg-brand-orange'}`}
                >
                  <ChevronLeft size={18} color={currentPage === 1 ? '#9CA3AF' : 'white'} />
                  <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className={`text-sm ml-1 ${currentPage === 1 ? 'text-gray-400' : 'text-white'}`}>
                    Précédent
                  </Text>
                </TouchableOpacity>

                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-600 text-sm">
                  Page {currentPage} / {totalPages}
                </Text>

                <TouchableOpacity
                  onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`flex-row items-center px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-100' : 'bg-brand-orange'}`}
                >
                  <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className={`text-sm mr-1 ${currentPage === totalPages ? 'text-gray-400' : 'text-white'}`}>
                    Suivant
                  </Text>
                  <ChevronRight size={18} color={currentPage === totalPages ? '#9CA3AF' : 'white'} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Agenda */}
        {evenements.length > 0 && (
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-9 h-9 bg-amber-100 rounded-xl items-center justify-center mr-3">
                <Calendar size={18} color="#D97706" />
              </View>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base flex-1">Agenda</Text>
              <View className="bg-gray-100 px-3 py-1 rounded-full">
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-600 text-[10px]">
                  {evenements.length} evenement{evenements.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            {evenements.slice(0, 4).map((evt: any) => (
              <View key={evt.id} className="bg-white rounded-3xl mb-3 border border-gray-100 shadow-sm p-4">
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm mb-1">
                  {evt.title}
                </Text>
                {evt.description ? (
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs mb-2" numberOfLines={2}>
                    {evt.description}
                  </Text>
                ) : null}
                <View className="flex-row items-center justify-between">
                  <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-xs">
                    {formatDate(evt.date_debut) || 'Date a venir'}
                  </Text>
                  {evt.lieu ? (
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs" numberOfLines={1}>
                      {evt.lieu}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-9 h-9 bg-blue-100 rounded-xl items-center justify-center mr-3">
                <Video size={18} color="#2563EB" />
              </View>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base flex-1">Videos</Text>
              <View className="bg-gray-100 px-3 py-1 rounded-full">
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-600 text-[10px]">
                  {videos.length}
                </Text>
              </View>
            </View>

            {videos.slice(0, 4).map((video: any) => (
              <TouchableOpacity
                key={video.id}
                className="bg-white rounded-3xl mb-3 border border-gray-100 shadow-sm p-4"
                onPress={() => Linking.openURL(video.url)}
              >
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm mb-1" numberOfLines={2}>
                  {video.titre}
                </Text>
                {video.description ? (
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs mb-2" numberOfLines={2}>
                    {video.description}
                  </Text>
                ) : null}
                <View className="flex-row items-center">
                  <ExternalLink size={12} color="#2563EB" />
                  <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-blue-600 text-xs ml-1">Ouvrir la video</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bouton Contacter le CRASC */}
        <TouchableOpacity
          onPress={() => router.push('/contact')}
          className="bg-brand-orange py-4 rounded-3xl items-center mb-6"
        >
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-base">Contacter le CRASC</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-50">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={120} height={16} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <View className="px-6 mt-6">
          <Skeleton width="100%" height={100} borderRadius={24} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={180} borderRadius={24} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={180} borderRadius={24} />
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 py-4 flex-row justify-between items-center bg-white">
          <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full">
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Erreur</Text>
          <View style={{ width: 40 }} />
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-base mb-2">CRASC non trouvé</Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm text-center">ID: {id}</Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs text-center mt-4">IDs disponibles: {CRASC_DATA.map(c => c.id).join(', ')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white">
        <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View className="items-center">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg" numberOfLines={1}>{data.name}</Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-brand-orange text-[10px] font-bold uppercase tracking-widest">Détails</Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={() => router.push('/contact')} className="bg-gray-50 p-2 rounded-full">
            <Phone size={20} color="#E05017" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare} className="bg-gray-50 p-2 rounded-full">
            <Share2 size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderFooter()}
      </ScrollView>
    </SafeAreaView>
  );
}
