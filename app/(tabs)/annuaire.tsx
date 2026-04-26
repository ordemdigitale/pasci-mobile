import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, MapPin } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';

const { width } = Dimensions.get('window');

export default function AnnuaireScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'osc' | 'ptf' | 'crasc'>('osc');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: oscList, isLoading: oscLoading } = useQuery({
    queryKey: ['osc-list'],
    queryFn: () => dataService.getOscList(),
  });

  const { data: ptfList, isLoading: ptfLoading } = useQuery({
    queryKey: ['ptf-list'],
    queryFn: () => dataService.getPtfList(),
  });

  const { data: crascList, isLoading: crascLoading } = useQuery({
    queryKey: ['crasc-list'],
    queryFn: () => dataService.getCrascList?.(),
  });

  const getDisplayData = () => {
    let data = [];
    if (activeTab === 'osc') data = oscList || [];
    else if (activeTab === 'ptf') data = ptfList || [];
    else if (activeTab === 'crasc') data = crascList || [];
    
    return data.filter((item: any) => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const displayData = getDisplayData();
  const isLoading = activeTab === 'osc' ? oscLoading : activeTab === 'ptf' ? ptfLoading : crascLoading;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-2xl text-gray-900 mb-4">
            Annuaire
          </Text>

          {/* Search Bar */}
          <View className="bg-gray-100 rounded-2xl px-4 py-3 flex-row items-center">
            <Search size={20} color="#9CA3AF" />
            <Text 
              placeholder="Rechercher..."
              className="flex-1 ml-3 text-gray-400"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Tabs */}
        <View className="px-6 pb-6">
          <View className="bg-gray-100 rounded-2xl p-1 flex-row">
            {['osc', 'crasc', 'ptf'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab as 'osc' | 'ptf' | 'crasc')}
                className={`flex-1 py-2 rounded-xl ${
                  activeTab === tab ? 'bg-white' : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-center font-semibold text-sm ${
                    activeTab === tab ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {tab === 'osc' ? 'OSC' : tab === 'crasc' ? 'CRASC' : 'Partenaires'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* List */}
        <View className="px-6">
          {isLoading ? (
            <Text className="text-center text-gray-400">Chargement...</Text>
          ) : displayData.length === 0 ? (
            <Text className="text-center text-gray-400">Aucun résultat trouvé</Text>
          ) : (
            displayData.map((item: any, idx: number) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  if (activeTab === 'osc') router.push(`/osc-details/${item.id}`);
                  else if (activeTab === 'crasc') router.push(`/crasc-details/${item.id}`);
                }}
                className="bg-gray-50 rounded-2xl p-4 mb-3 border border-gray-100"
              >
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900">
                  {item.name}
                </Text>
                {item.region_name && (
                  <View className="flex-row items-center mt-2">
                    <MapPin size={14} color="#9CA3AF" />
                    <Text className="text-gray-400 text-sm ml-1">{item.region_name}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
