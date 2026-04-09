import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Search,
  Eye,
  Phone,
} from 'lucide-react-native';
import Skeleton from './ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/dataService';
import { Crasc } from '../services/types';

const { width } = Dimensions.get('window');

interface DirectoryModalProps {
  visible: boolean;
  onClose: () => void;
  selectedRegion?: string;
}

const DirectoryModal: React.FC<DirectoryModalProps> = ({ visible, onClose, selectedRegion }) => {
  const router = useRouter();

  const { data: crascs, isLoading } = useQuery({
    queryKey: ['crascs'],
    queryFn: dataService.getCrascs,
    enabled: visible,
  });

  const filteredCrascs = React.useMemo(() => {
    if (!crascs) return [];
    if (!selectedRegion) return crascs;
    const regionName = selectedRegion.replace('CRASC ', '').toUpperCase();
    return crascs.filter(c => c.name.toUpperCase().includes(regionName));
  }, [crascs, selectedRegion]);

  const handleDetailsPress = (slug: string) => {
    onClose();
    router.push(`/crasc-details/${slug}`);
  };

  const renderCard = ({ item }: { item: Crasc | number }) => {
    if (typeof item === 'number') {
      return renderSkeletonCard();
    }
    
    // On peut filtrer par région si nécessaire
    if (selectedRegion && !item.name.includes(selectedRegion.replace('CRASC ', ''))) {
      // Si on veut filtrer strictement, mais pour l'instant on affiche tout ou on pourrait filtrer
    }

    return (
    <View className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100 flex-row mx-6">
      <View className="w-20 h-20 bg-orange-50 rounded-2xl items-center justify-center mr-4">
        <Image 
            source={require('../assets/logo.png')} 
            style={{ width: 40, height: 40 }} 
            resizeMode="contain" 
        />
      </View>

      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <View className="bg-orange-100 px-2 py-0.5 rounded-md">
            <Text className="text-brand-orange text-[10px] font-bold">INFO</Text>
          </View>
          {item.osc_count !== undefined && (
            <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-400 text-[10px]">{item.osc_count} OSCs</Text>
          )}
        </View>

        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-1">
          {item.name}
        </Text>

        <Text className="text-gray-400 text-[10px] mb-3" numberOfLines={2}>
          {item.description || 'Centre de Ressources et d\'Appui à la Société Civile.'}
        </Text>

        <View className="flex-row">
          <TouchableOpacity 
            onPress={() => handleDetailsPress(item.slug)}
            className="flex-row items-center bg-gray-900 px-4 py-2 rounded-xl mr-2"
          >
            <Eye size={14} color="white" />
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white text-[10px] ml-2">Détails</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-gray-100 items-center justify-center rounded-xl">
            <Phone size={16} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    );
  };

  const renderSkeletonCard = () => (
    <View className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100 flex-row mx-6">
      <Skeleton width={80} height={80} borderRadius={16} style={{ marginRight: 16 }} />
      <View className="flex-1 justify-center">
        <Skeleton width="40%" height={12} style={{ marginBottom: 8 }} />
        <Skeleton width="80%" height={18} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={12} style={{ marginBottom: 16 }} />
        <View className="flex-row">
          <Skeleton width={80} height={32} borderRadius={16} style={{ marginRight: 8 }} />
          <Skeleton width={32} height={32} borderRadius={16} />
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* Search Bar */}
      <View className="px-6 mt-6">
        <View className="bg-white flex-row items-center px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Rechercher un CRASC..."
            className="flex-1 ml-3 font-bold text-gray-700"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View className="px-6 mt-6 mb-4 flex-row justify-between items-center">
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-xs uppercase tracking-widest">
          {selectedRegion ? `Résultats pour ${selectedRegion}` : 'Tous les CRASC'}
        </Text>
        {!isLoading && (
          <Text className="text-brand-orange font-bold text-xs">{filteredCrascs.length} pôle{filteredCrascs.length !== 1 ? 's' : ''}</Text>
        )}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Top Navigation */}
        <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-gray-100">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={onClose} className="bg-orange-50 p-2 rounded-full mr-4">
              <ChevronLeft size={24} color="#E05017" />
            </TouchableOpacity>
            <View>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Annuaire des CRASC</Text>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-brand-orange text-[10px] font-bold uppercase tracking-widest">Pasci Project</Text>
            </View>
          </View>

        </View>

        <FlatList<Crasc | number>
          data={isLoading ? [1, 2] : filteredCrascs}
          renderItem={renderCard}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
        />


      </SafeAreaView>
    </Modal>
  );
};

export default DirectoryModal;
