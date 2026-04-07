import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions, ScrollView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Search,
  SlidersHorizontal,
  Calendar,
  MapPin,
  ChevronLeft
} from 'lucide-react-native';
import Skeleton from '../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/dataService';
import { Formation } from '../services/types';

const { width } = Dimensions.get('window');

export default function FormationsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: formations, isLoading } = useQuery({
    queryKey: ['formations'],
    queryFn: () => dataService.getFormations(),
  });

  const { data: rubriques } = useQuery({
    queryKey: ['formation-rubriques'],
    queryFn: dataService.getFormationRubriques,
  });

  const filteredFormations = React.useMemo(() => {
    if (!formations) return [];
    if (selectedCategory === 'all') return formations;
    return formations.filter(f => f.rubrique?.slug === selectedCategory);
  }, [formations, selectedCategory]);

  const renderHeader = () => (
    <View className="px-6 pt-4">
      {/* Search & Filter Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="bg-orange-50 p-2 rounded-full mr-4">
            <ChevronLeft size={24} color="#E05017" />
          </TouchableOpacity>
          <View>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-2xl text-gray-900">Catalogue</Text>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-brand-orange text-[10px] font-bold uppercase tracking-widest">Pasci Project</Text>
          </View>
        </View>
        <View className="flex-row">
          <TouchableOpacity className="bg-gray-100 p-2.5 rounded-full mr-2">
            <Search size={20} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 p-2.5 rounded-full">
            <SlidersHorizontal size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 -mx-2">
        <TouchableOpacity
          onPress={() => setSelectedCategory('all')}
          style={{
            backgroundColor: selectedCategory === 'all' ? '#E05017' : 'white',
            borderColor: selectedCategory === 'all' ? '#E05017' : '#E5E7EB'
          }}
          className="px-6 py-2.5 rounded-full border mx-2 shadow-sm"
        >
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className={selectedCategory === 'all' ? "text-white text-xs" : "text-gray-600 text-xs"}>
            Tous
          </Text>
        </TouchableOpacity>
        {(rubriques || []).map((rub) => (
          <TouchableOpacity
            key={rub.slug}
            onPress={() => setSelectedCategory(rub.slug)}
            style={{
              backgroundColor: selectedCategory === rub.slug ? '#E05017' : 'white',
              borderColor: selectedCategory === rub.slug ? '#E05017' : '#E5E7EB'
            }}
            className="px-6 py-2.5 rounded-full border mx-2 shadow-sm"
          >
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className={selectedCategory === rub.slug ? "text-white text-xs" : "text-gray-600 text-xs"}>
              {rub.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="flex-row justify-between items-center mb-6">
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900">Formations disponibles</Text>
        {!isLoading && (
          <Text className="text-brand-orange font-bold text-xs">{filteredFormations.length} formation{filteredFormations.length !== 1 ? 's' : ''}</Text>
        )}
      </View>
    </View>
  );

  const renderCourseItem = ({ item }: { item: Formation }) => (
    <View className="bg-white rounded-[40px] p-6 mb-6 mx-6 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <View className="bg-orange-50 px-3 py-1 rounded-lg">
          <Text style={{ color: '#E05017', fontSize: 9, fontWeight: 'bold' }}>FORMATION</Text>
        </View>
      </View>

      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-4 leading-6">
        {item.title}
      </Text>

      <View className="flex-row items-center mb-6">
        {item.location && (
          <>
            <MapPin size={14} color="#9CA3AF" />
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs ml-1.5 mr-4">{item.location}</Text>
          </>
        )}
        {item.start_date && (
          <>
            <Calendar size={14} color="#9CA3AF" />
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs ml-1.5">{new Date(item.start_date).toLocaleDateString('fr-FR')}</Text>
          </>
        )}
      </View>

      <TouchableOpacity 
        onPress={() => router.push({ pathname: `/course-details/${item.slug}` })}
        className="bg-brand-orange py-4 rounded-2xl items-center shadow-lg shadow-orange-200"
      >
        <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white text-sm">S'inscrire maintenant</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSkeleton = () => (
    <View className="bg-white rounded-[40px] p-6 mb-6 mx-6 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between mb-4">
        <Skeleton width={80} height={20} borderRadius={8} />
        <Skeleton width={60} height={20} borderRadius={8} />
      </View>
      <Skeleton width="100%" height={20} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={20} style={{ marginBottom: 20 }} />
      <View className="flex-row mb-6">
        <Skeleton width={60} height={12} style={{ marginRight: 16 }} />
        <Skeleton width={60} height={12} />
      </View>
      <Skeleton width="100%" height={48} borderRadius={16} />
    </View>
  );

  return (
    <SafeAreaView 
      className="flex-1 bg-gray-50" 
      edges={['top']}
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      <FlatList
        data={isLoading ? [1, 2, 3] : filteredFormations}
        renderItem={isLoading ? renderSkeleton : renderCourseItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

