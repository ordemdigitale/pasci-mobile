import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, Bell, UserCircle, MapPin, ChevronRight, Building2 } from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import { Partner, PTF } from '../../services/types';

export default function AnnuairePartenairesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'OSC' | 'PTF'>('OSC');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Tous');

  // Données OSC
  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: () => dataService.getRegions(),
  });

  const { data: partners, isLoading: partnersLoading } = useQuery({
    queryKey: ['partners-search', searchQuery, selectedRegion],
    queryFn: async () => {
      if (searchQuery.trim().length > 0) {
        const region = selectedRegion === 'Tous' ? undefined : selectedRegion;
        return await dataService.searchOsc(searchQuery, region);
      }
      const allPartners = await dataService.getPartners();
      if (selectedRegion === 'Tous') return allPartners;
      return allPartners.filter((p: Partner) => {
        if ((p as any).region) return (p as any).region === selectedRegion;
        if (p.ville) return p.ville === selectedRegion;
        return false;
      });
    },
  });

  // Données PTF
  const { data: ptfList, isLoading: ptfLoading } = useQuery({
    queryKey: ['ptf-list'],
    queryFn: dataService.getPtfList,
  });

  const isLoading = activeTab === 'OSC' ? partnersLoading : ptfLoading;

  const regionCategories = ['Tous', ...regions.map((r: any) => r.name || r.slug)];

  const filteredPtf = ptfList?.filter((ptf: PTF) =>
    !searchQuery ||
    ptf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ptf.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderOscCard = ({ item }: { item: Partner }) => (
    <View className="bg-white rounded-[32px] p-6 mb-6 mx-6 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between mb-4">
        <View className="flex-row flex-wrap flex-1 mr-3">
          {item.tags?.map((tag, i) => (
            <View key={i} className="bg-blue-50 px-2 py-1 rounded mr-2 mb-1">
              <Text className="text-blue-600 text-[8px] font-bold">{tag}</Text>
            </View>
          )) || (
            <View className="bg-gray-50 px-2 py-1 rounded">
              <Text className="text-gray-400 text-[8px] font-bold">OSC</Text>
            </View>
          )}
        </View>
        <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center border border-gray-100 shrink-0">
          {item.thumbnail_url ? (
            <Image source={{ uri: item.thumbnail_url }} style={{ width: 30, height: 30 }} resizeMode="contain" />
          ) : (
            <UserCircle size={24} color="#9CA3AF" />
          )}
        </View>
      </View>
      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-2 leading-6">{item.name}</Text>
      <Text numberOfLines={2} style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs mb-6 leading-5">
        {item.description || 'Aucune description disponible'}
      </Text>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <MapPin size={12} color="#9CA3AF" />
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1">
            {item.ville || 'Localisation non spécifiée'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/osc-details/${item.slug}`)}
          className="bg-orange-50 px-4 py-2 rounded-full flex-row items-center"
        >
          <Text className="text-brand-orange font-bold text-xs mr-1">Détails</Text>
          <ChevronRight size={14} color="#E05017" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPtfCard = ({ item }: { item: PTF }) => (
    <View className="bg-white rounded-[32px] p-6 mb-6 mx-6 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between mb-4">
        <View className="flex-row flex-wrap flex-1 mr-3">
          {item.domaines_list?.slice(0, 2).map((d, i) => (
            <View key={i} className="bg-orange-50 px-2 py-1 rounded mr-2 mb-1">
              <Text className="text-brand-orange text-[8px] font-bold">{d}</Text>
            </View>
          )) || (
            <View className="bg-gray-50 px-2 py-1 rounded">
              <Text className="text-gray-400 text-[8px] font-bold">PTF</Text>
            </View>
          )}
        </View>
        <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center border border-gray-100 shrink-0">
          {item.thumbnail_url ? (
            <Image source={{ uri: item.thumbnail_url }} style={{ width: 30, height: 30 }} resizeMode="contain" />
          ) : (
            <Building2 size={20} color="#9CA3AF" />
          )}
        </View>
      </View>
      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-2 leading-6">{item.name}</Text>
      <Text numberOfLines={2} style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs mb-6 leading-5">
        {item.description || 'Aucune description disponible'}
      </Text>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <MapPin size={12} color="#9CA3AF" />
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1">
            {item.pays || 'International'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/annuaire-partenaires/${item.slug}`)}
          className="bg-orange-50 px-4 py-2 rounded-full flex-row items-center"
        >
          <Text className="text-brand-orange font-bold text-xs mr-1">Détails</Text>
          <ChevronRight size={14} color="#E05017" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSkeleton = () => (
    <View className="bg-white rounded-[32px] p-6 mb-6 mx-6 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between mb-4">
        <Skeleton width={60} height={16} borderRadius={4} />
        <Skeleton width={48} height={48} borderRadius={12} />
      </View>
      <Skeleton width="80%" height={20} style={{ marginBottom: 12 }} />
      <Skeleton width="100%" height={12} style={{ marginBottom: 6 }} />
      <Skeleton width="90%" height={12} style={{ marginBottom: 24 }} />
      <View className="flex-row justify-between items-center">
        <Skeleton width={100} height={12} />
        <Skeleton width={80} height={32} borderRadius={16} />
      </View>
    </View>
  );

  const listData = isLoading
    ? [1, 2, 3]
    : activeTab === 'OSC'
    ? (partners || [])
    : (filteredPtf || []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()} className="bg-gray-100 p-2 rounded-full">
          <ChevronLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Annuaire</Text>
        <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
          <Bell size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            {/* Onglets OSC / PTF */}
            <View className="mx-6 mt-2 flex-row bg-gray-100 p-1.5 rounded-[24px] mb-5">
              <TouchableOpacity
                onPress={() => { setActiveTab('OSC'); setSearchQuery(''); }}
                className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'OSC' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className={`text-xs ${activeTab === 'OSC' ? 'text-gray-900' : 'text-gray-400'}`}>
                  OSC
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setActiveTab('PTF'); setSearchQuery(''); setSelectedRegion('Tous'); }}
                className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'PTF' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className={`text-xs ${activeTab === 'PTF' ? 'text-gray-900' : 'text-gray-400'}`}>
                  Partenaires Techniques
                </Text>
              </TouchableOpacity>
            </View>

            {/* Barre de Recherche */}
            <View className="px-6 mb-5">
              <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-3xl border border-gray-100">
                <Search size={20} color="#9CA3AF" />
                <TextInput
                  placeholder={activeTab === 'OSC' ? 'Rechercher une OSC...' : 'Rechercher un partenaire...'}
                  className="flex-1 ml-3 text-gray-700"
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Filtres régions (OSC seulement) */}
            {activeTab === 'OSC' && (
              <View className="mb-5">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
                  {regionCategories.map((region) => (
                    <TouchableOpacity
                      key={region}
                      onPress={() => setSelectedRegion(region)}
                      className={`mr-3 px-5 py-3 rounded-2xl border ${selectedRegion === region ? 'bg-brand-orange border-brand-orange shadow-lg shadow-orange-200' : 'bg-white border-gray-100'}`}
                    >
                      <Text
                        style={{ fontFamily: selectedRegion === region ? 'Poppins_600SemiBold' : 'Poppins_400Regular' }}
                        className={`${selectedRegion === region ? 'text-white' : 'text-gray-500'} text-xs`}
                      >
                        {region}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View className="px-8 mb-6">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl">
                {activeTab === 'OSC' ? 'Organisations (OSC)' : 'Partenaires Techniques & Financiers'}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                {searchQuery
                  ? `Résultats pour "${searchQuery}"`
                  : activeTab === 'OSC' && selectedRegion !== 'Tous'
                  ? `OSC de ${selectedRegion}`
                  : activeTab === 'OSC'
                  ? 'Toutes les organisations membres'
                  : 'Institutions partenaires du projet PASCI'}
              </Text>
            </View>
          </>
        }
        data={listData}
        renderItem={({ item }) => {
          if (isLoading) return renderSkeleton();
          if (activeTab === 'OSC') return renderOscCard({ item: item as Partner });
          return renderPtfCard({ item: item as PTF });
        }}
        keyExtractor={(item, index) => (typeof item === 'number' ? `skeleton-${item}` : `${(item as any).id}-${index}`)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          !isLoading ? (
            <View className="px-8 py-12 items-center">
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-center">
                Aucun résultat trouvé
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
