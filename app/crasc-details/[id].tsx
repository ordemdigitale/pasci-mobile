import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Share, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  MapPin,
  Users,
  Calendar,
  Target,
  Newspaper,
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import { CRASC_DATA } from '../../constants/crasc';

const domainesIntervention = [
  'Gouvernance',
  'Développement durable',
  'Développement local',
  'Bien-être social',
  'Cohésion sociale',
];

export default function CrascDetailsScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['crasc-details', id],
    queryFn: () => dataService.getCrascBySlug(id as string),
    enabled: !!id,
  });

  const localData = CRASC_DATA.find(c => c.id === id);
  const data = apiData || localData;
  const oscMembers = apiData?.oscs || [];

  const onShare = async () => {
    if (!data) return;
    try {
      await Share.share({ message: `Découvrez le ${data.name} sur la plateforme PDOC.` });
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderHeader = () => {
    if (!data) return null;
    const regionsList = typeof data.regions === 'string' ? data.regions.split(', ') : data.regions?.map((r: any) => r.name) || [];
    const count = data.count || data.region_count || 0;
    const regionName = data.region_name || data.name || '';

    return (
      <View className="mb-4">
        {/* Stats Row */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-blue-50 rounded-3xl p-4 flex-1 items-center mr-2">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-blue-600 text-[9px] uppercase mb-1">Régions</Text>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-blue-700 text-2xl">{count}</Text>
          </View>
          <View className="bg-green-50 rounded-3xl p-4 flex-1 items-center">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-green-600 text-[9px] uppercase mb-1">Zone</Text>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-green-700 text-base text-center">{regionName}</Text>
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
            Le {data.title || data.name} est un centre régional d'appui à la société civile couvrant {count} région{count > 1 ? 's' : ''} en Côte d'Ivoire.
          </Text>
        </View>
      </View>
    );
  };

  const renderOscItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/osc-details/${item.slug || item.id}`)}
      className="bg-white rounded-3xl mb-4 border border-gray-100 shadow-sm overflow-hidden"
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
  );

  const renderFooter = () => {
    if (!data) return null;
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
            {oscMembers.map((item: any) => renderOscItem({ item }))}
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
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-brand-orange text-[10px] font-bold uppercase tracking-widest">Détails du pôle</Text>
        </View>
        <TouchableOpacity onPress={onShare} className="bg-gray-50 p-2 rounded-full">
          <Share2 size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderFooter()}
      </ScrollView>
    </SafeAreaView>
  );
}