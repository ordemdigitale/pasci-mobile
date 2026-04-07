import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Calendar, ChevronRight, TrendingUp } from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import { OffreProjet } from '../../services/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const STATUT_COLORS: Record<string, { bg: string; text: string }> = {
  ouvert: { bg: '#DCFCE7', text: '#166534' },
  en_cours: { bg: '#DBEAFE', text: '#1D4ED8' },
  fermé: { bg: '#FEE2E2', text: '#991B1B' },
  clôturé: { bg: '#FEE2E2', text: '#991B1B' },
};

export default function ProjetsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Appels' | 'Formalisation'>('Appels');

  const { data: projets, isLoading } = useQuery({
    queryKey: ['offre-projets'],
    queryFn: dataService.getOffreProjets,
  });

  const getStatutStyle = (statut: string) => {
    const key = statut?.toLowerCase().replace(' ', '_');
    return STATUT_COLORS[key] || { bg: '#F3F4F6', text: '#6B7280' };
  };

  const renderProjetItem = ({ item }: { item: OffreProjet }) => {
    const statutStyle = getStatutStyle(item.statut);
    return (
      <View style={{ width: CARD_WIDTH }} className="bg-white rounded-[32px] overflow-hidden mb-5 border border-gray-100 shadow-sm">
        {/* Image or placeholder */}
        <View className="relative">
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} className="w-full h-32" resizeMode="cover" />
          ) : (
            <View className="w-full h-32 bg-orange-50 items-center justify-center">
              <TrendingUp size={32} color="#E05017" />
            </View>
          )}
          <View style={{ backgroundColor: statutStyle.bg }} className="absolute top-3 left-3 px-3 py-1 rounded-lg">
            <Text style={{ color: statutStyle.text }} className="text-[9px] font-bold uppercase">{item.statut}</Text>
          </View>
        </View>

        <View className="p-4">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-[13px] mb-1" numberOfLines={2}>
            {item.nom}
          </Text>

          {item.domaine && (
            <View className="bg-orange-50 self-start px-2 py-0.5 rounded-full mb-2">
              <Text className="text-brand-orange text-[8px] font-bold uppercase">{item.domaine}</Text>
            </View>
          )}

          <View className="flex-row items-center mb-2">
            <Calendar size={10} color="#9CA3AF" />
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1">
              {new Date(item.date_publication).toLocaleDateString('fr-FR')}
            </Text>
          </View>

          {item.zone && (
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-[10px] leading-4 mb-4" numberOfLines={1}>
              📍 {item.zone}
            </Text>
          )}

          {/* Progress bar */}
          {item.progression > 0 && (
            <View className="mb-4">
              <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <View
                  className="h-full bg-brand-orange rounded-full"
                  style={{ width: `${Math.min(item.progression, 100)}%` }}
                />
              </View>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[9px] mt-1">
                {item.progression}% complété
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => router.push(`/projet-details/${item.slug}`)}
            className="bg-orange-50 py-2 rounded-xl items-center flex-row justify-center"
          >
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-brand-orange text-[11px] mr-1">Détails</Text>
            <ChevronRight size={12} color="#E05017" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSkeleton = () => (
    <View style={{ width: CARD_WIDTH }} className="bg-white rounded-[32px] overflow-hidden mb-5 border border-gray-100 shadow-sm">
      <Skeleton width="100%" height={128} />
      <View className="p-4">
        <Skeleton width="80%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="40%" height={10} style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height={24} style={{ marginBottom: 10 }} />
        <Skeleton width="100%" height={32} borderRadius={12} />
      </View>
    </View>
  );

  const renderHeader = () => (
    <View className="px-6 pt-4">
      {/* Segment Control */}
      <View className="flex-row bg-gray-100 p-1.5 rounded-[24px] mb-8">
        <TouchableOpacity
          onPress={() => setActiveTab('Appels')}
          className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'Appels' ? 'bg-white shadow-sm' : ''}`}
        >
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className={`text-xs ${activeTab === 'Appels' ? 'text-brand-orange' : 'text-gray-400'}`}>
            Appels à Projets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('Formalisation')}
          className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'Formalisation' ? 'bg-white shadow-sm' : ''}`}
        >
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className={`text-xs ${activeTab === 'Formalisation' ? 'text-brand-orange' : 'text-gray-400'}`}>
            Formalisation
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Appels' && (
        <View className="flex-row justify-between items-center mb-6">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-2xl text-gray-900">Appels en cours</Text>
          {!isLoading && projets && (
            <View className="bg-orange-100 px-3 py-1 rounded-full">
              <Text className="text-brand-orange text-[9px] font-bold">{projets.length} PROJET{projets.length !== 1 ? 'S' : ''}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const listData = isLoading ? [1, 2, 3, 4] : (activeTab === 'Appels' ? (projets || []) : []);

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={['top']}
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      {/* Header */}
      <View className="px-6 py-4 bg-white flex-row justify-between items-center border-b border-gray-50">
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-xl text-gray-900">Projets</Text>
        <TouchableOpacity className="p-2 bg-gray-100 rounded-full">
          <Bell size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={listData}
        renderItem={({ item }) => isLoading ? renderSkeleton() : renderProjetItem({ item: item as OffreProjet })}
        keyExtractor={(item, index) => (typeof item === 'number' ? `skeleton-${item}` : `${(item as OffreProjet).id}-${index}`)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 24 }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !isLoading ? (
            <View className="px-6 items-center mt-10">
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-center">
                {activeTab === 'Formalisation'
                  ? 'Le processus de formalisation sera affiché ici.'
                  : 'Aucun appel à projet disponible pour le moment.'}
              </Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}
