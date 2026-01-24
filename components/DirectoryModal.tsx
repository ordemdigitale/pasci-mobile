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
  Bell,
  Search,
  SlidersHorizontal,
  Bookmark,
  Eye,
  Phone,
  MessageCircle,
  ChevronDown,
  X,
} from 'lucide-react-native';
import Skeleton from './ui/Skeleton';

const { width } = Dimensions.get('window');

interface DirectoryModalProps {
  visible: boolean;
  onClose: () => void;
  selectedRegion?: string;
}

interface CrascItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
}

const MOCK_CRASCS: CrascItem[] = [
  { id: 'crasc-nord', title: 'CRASC Abidjan Nord', subtitle: 'Éducation, Santé & Droits de l\'Homme', tag: 'ABIDJAN NORD', tagColor: '#E05017' },
  { id: 'crasc-centre', title: 'CRASC Bouaké Centre', subtitle: 'Agriculture & Développement Rural', tag: 'VALLÉE DU BANDAMA', tagColor: '#3B82F6' },
  { id: 'crasc-sud', title: 'CRASC San Pédro', subtitle: 'Pêche & Environnement', tag: 'BAS-SASSANDRA', tagColor: '#10B981' },
];

const DirectoryModal: React.FC<DirectoryModalProps> = ({ visible, onClose, selectedRegion }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleDetailsPress = (id: string) => {
    onClose();
    router.push(`/crasc-details/${id}`);
  };

  const renderCard = ({ item }: { item: CrascItem | number }) => {
    if (typeof item === 'number') {
      return renderSkeletonCard();
    }
    return (
    <View className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100 flex-row relative mx-6">
      {/* Bookmark Icon */}
      <TouchableOpacity className="absolute top-4 right-4">
        <Bookmark size={20} color={item.title.includes('Nord') ? '#D1D5DB' : '#E05017'} fill={item.title.includes('Nord') ? 'transparent' : '#E05017'} />
      </TouchableOpacity>

      {/* Logo Placeholder */}
      <View className="w-20 h-20 bg-orange-50 rounded-2xl items-center justify-center mr-4">
        <Image 
            source={require('../assets/logo.png')} 
            style={{ width: 40, height: 40 }} 
            resizeMode="contain" 
        />
      </View>

      <View className="flex-1">
        {/* Tag */}
        <View style={{ backgroundColor: item.tagColor + '20' }} className="self-start px-2 py-0.5 rounded-md mb-1">
          <Text style={{ color: item.tagColor, fontSize: 10, fontWeight: 'bold' }}>{item.tag}</Text>
        </View>

        {/* Title */}
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-1">
          {item.title}
        </Text>

        {/* Subtitle */}
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[11px] mb-4">
          {item.subtitle}
        </Text>

        {/* Action Buttons */}
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => handleDetailsPress(item.id)}
            className="bg-brand-orange flex-row items-center px-4 py-2 rounded-full mr-2"
          >
            <Eye size={14} color="white" />
            <Text className="text-white font-bold text-xs ml-1.5">Détails</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-8 h-8 rounded-full border border-gray-200 items-center justify-center">
            {item.title.includes('Nord') ? (
              <Phone size={14} color="#6B7280" />
            ) : (
              <MessageCircle size={14} color="#E05017" />
            )}
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
            placeholder="Rechercher une organisation (ex: F..."
            className="flex-1 ml-3 font-bold text-gray-700"
            placeholderTextColor="#9CA3AF"
          />
          <SlidersHorizontal size={20} color="#4B5563" />
        </View>
      </View>

      {/* Filter Chips */}
      <View className="flex-row px-6 mt-6 mb-8">
        <TouchableOpacity className="bg-brand-orange flex-row items-center px-4 py-2.5 rounded-full mr-3">
          <Text className="text-white font-bold text-xs mr-2">Toutes les régions</Text>
          <ChevronDown size={14} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-white border border-gray-200 flex-row items-center px-4 py-2.5 rounded-full">
          <Text className="text-gray-700 font-bold text-xs mr-2">Secteur: Santé</Text>
          <X size={14} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View className="px-6 mb-4 flex-row justify-between items-center">
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-xs uppercase tracking-widest">Récemment consultés</Text>
        {!loading && <Text className="text-brand-orange font-bold text-xs">12 organisations</Text>}
      </View>
    </View>
  );

  const renderFooter = () => (
    <View className="px-6 mt-6 mb-10">
      <View className="flex-row justify-between items-center mb-4">
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-xs uppercase tracking-widest">Proximité (San Pédro)</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-brand-orange font-bold text-xs ml-1">Carte</Text>
        </TouchableOpacity>
      </View>
      <View className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
        <View className="h-40 w-full relative">
          <Image 
            source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=5.36,-4.00&zoom=12&size=600x300&maptype=roadmap&markers=color:red%7C5.36,-4.00' }} 
            className="w-full h-full"
            resizeMode="cover"
            defaultSource={require('../assets/logo.png')}
          />
          <View className="absolute top-4 left-4 bg-white/90 px-2 py-1 rounded-full flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
            <Text className="text-[10px] font-bold text-gray-800">ACTIF</Text>
          </View>
        </View>
        <View className="p-4 bg-white">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base">CRASC Bas-Sassandra</Text>
        </View>
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
          <TouchableOpacity className="bg-gray-100 p-2 rounded-full relative">
            <Bell size={20} color="#4B5563" />
            <View className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </TouchableOpacity>
        </View>

        <FlatList<CrascItem | number>
          data={loading ? [1, 2] : MOCK_CRASCS}
          renderItem={renderCard}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={loading ? null : renderFooter}
          showsVerticalScrollIndicator={false}
        />

        {/* Floating Action Button */}
        <TouchableOpacity 
          style={{ position: 'absolute', bottom: 30, right: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 }}
          className="w-14 h-14 bg-brand-orange rounded-full items-center justify-center"
        >
          <SlidersHorizontal size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

export default DirectoryModal;
