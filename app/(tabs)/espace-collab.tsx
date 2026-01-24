import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Dimensions, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Search, 
  Users, 
  Leaf, 
  GraduationCap, 
  HeartPulse, 
  Gavel, 
  Tractor, 
  Venus, 
  Rocket,
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const POLE_CATEGORIES = ['Tous les secteurs', 'Environnement', 'Éducation', 'Santé'];
const JOB_CATEGORIES = ['Tout', 'Temps plein', 'Partiel', 'Consultance'];

const POLES = [
  { id: '1', name: 'Environnement', members: '1.2k membres', icon: Leaf, color: '#DCFCE7', iconColor: '#166534', joined: false },
  { id: '2', name: 'Droits Humains', members: '862 membres', icon: Users, color: '#EFF6FF', iconColor: '#1E40AF', joined: true },
  { id: '3', name: 'Éducation', members: '2.5k membres', icon: GraduationCap, color: '#FFF7ED', iconColor: '#9A3412', joined: false },
  { id: '4', name: 'Santé Publique', members: '567 membres', icon: HeartPulse, color: '#F5F3FF', iconColor: '#5B21B6', joined: false },
  { id: '5', name: 'Gouvernance', members: '328 membres', icon: Gavel, color: '#FFF1F2', iconColor: '#9F1239', joined: false },
  { id: '6', name: 'Développement...', members: '915 membres', icon: Tractor, color: '#FEF9C3', iconColor: '#854D0E', joined: false },
  { id: '7', name: 'Genre & Égalité', members: '654 membres', icon: Venus, color: '#FDF2F8', iconColor: '#9D174D', joined: false },
  { id: '8', name: 'Jeunesse', members: '2.1k membres', icon: Rocket, color: '#ECFEFF', iconColor: '#0E7490', joined: false },
];

const JOBS = [
  { id: '1', title: 'Chef de Projet Développement Social', company: 'ONG Solidarité Plus', location: 'Abidjan', type: 'Temps plein', time: 'Il y a 2h', color: '#064E3B' },
  { id: '2', title: 'Coordonnateur de Plaidoyer Environnemental', company: 'Green Horizon CI', location: 'Bouaké', type: 'Part-time', time: 'Hier', color: '#14532D', saved: true },
  { id: '3', title: 'Expert en Monitoring & Évaluation', company: 'Réseau Santé Ivoirien', location: 'Korhogo', type: 'Consultant', time: 'Il y a 3j', color: '#451A03' },
  { id: '4', title: 'Animateur socio-éducatif', company: 'Éducation Pour Tous CI', location: 'Yamoussoukro', type: 'Temps plein', time: 'Il y a 1 sem.', color: '#7C2D12' },
];

export default function EspaceCollabScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pôles'); // 'Pôles' or 'Offres'
  const [selectedCat, setSelectedCat] = useState('Tous les secteurs');

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderPoleItem = ({ item }) => (
    <View 
      style={{ width: CARD_WIDTH }} 
      className="bg-white rounded-[32px] p-5 mb-5 items-center border border-gray-100 shadow-sm shadow-gray-200"
    >
      <View style={{ backgroundColor: item.color }} className="w-16 h-16 rounded-3xl items-center justify-center mb-4">
        <item.icon size={30} color={item.iconColor} />
      </View>
      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-[13px] text-center mb-1" numberOfLines={1}>
        {item.name}
      </Text>
      <View className="flex-row items-center mb-5">
        <Users size={10} color="#9CA3AF" />
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[9px] ml-1">
          {item.members}
        </Text>
      </View>
      <TouchableOpacity 
        className={`w-full py-2.5 rounded-2xl items-center ${item.joined ? 'bg-brand-orange' : 'bg-orange-50'}`}
      >
        <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className={`text-[11px] ${item.joined ? 'text-white' : 'text-brand-orange'}`}>
          {item.joined ? 'Membre' : 'Rejoindre'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderJobItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/job-details/${item.id}`)}
      className="bg-white rounded-[32px] p-6 mb-4 mx-6 border border-gray-100 shadow-sm relative"
    >
      <TouchableOpacity className="absolute top-6 right-6">
        <Bookmark size={20} color={item.saved ? '#E05017' : '#D1D5DB'} fill={item.saved ? '#E05017' : 'transparent'} />
      </TouchableOpacity>
      
      <View className="flex-row items-center mb-4">
        <View style={{ backgroundColor: item.color }} className="w-14 h-14 rounded-2xl items-center justify-center mr-4">
          <Leaf size={24} color="white" />
        </View>
        <View className="flex-1 pr-6">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm leading-5 mb-1">
            {item.title}
          </Text>
          <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-xs">
            {item.company}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mb-3">
        <View className="bg-gray-100 flex-row items-center px-3 py-1.5 rounded-xl mr-3">
          <MapPin size={12} color="#4B5563" />
          <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-600 text-[10px] ml-1.5">{item.location}</Text>
        </View>
        <View className={`flex-row items-center px-3 py-1.5 rounded-xl ${item.type === 'Consultant' ? 'bg-purple-50' : item.type === 'Part-time' ? 'bg-blue-50' : 'bg-green-50'}`}>
          <Briefcase size={12} color={item.type === 'Consultant' ? '#7C3AED' : item.type === 'Part-time' ? '#2563EB' : '#10B981'} />
          <Text style={{ fontFamily: 'Karla_700Bold' }} className={`text-[10px] ml-1.5 ${item.type === 'Consultant' ? 'text-purple-600' : item.type === 'Part-time' ? 'text-blue-600' : 'text-green-600'}`}>
            {item.type}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center bg-gray-50 self-start px-3 py-1 rounded-lg">
        <Clock size={12} color="#9CA3AF" />
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1.5">{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSkeleton = () => (
    activeTab === 'Pôles' ? (
      <View style={{ width: CARD_WIDTH }} className="bg-white rounded-[32px] p-5 mb-5 items-center border border-gray-100 shadow-sm">
        <Skeleton width={64} height={64} borderRadius={24} style={{ marginBottom: 16 }} />
        <Skeleton width="80%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="50%" height={10} style={{ marginBottom: 20 }} />
        <Skeleton width="100%" height={32} borderRadius={12} />
      </View>
    ) : (
      <View className="bg-white rounded-[32px] p-6 mb-4 mx-6 border border-gray-100 shadow-sm">
        <View className="flex-row items-center mb-4">
          <Skeleton width={56} height={56} borderRadius={16} style={{ marginRight: 16 }} />
          <View className="flex-1">
            <Skeleton width="90%" height={16} style={{ marginBottom: 8 }} />
            <Skeleton width="60%" height={12} />
          </View>
        </View>
        <View className="flex-row mb-3">
          <Skeleton width={80} height={24} borderRadius={12} style={{ marginRight: 12 }} />
          <Skeleton width={80} height={24} borderRadius={12} />
        </View>
        <Skeleton width={60} height={16} borderRadius={8} />
      </View>
    )
  );

  const renderHeader = () => (
    <View className="px-6 pt-4">
      {/* Tab Switcher */}
      <View className="flex-row bg-gray-100 p-1.5 rounded-[24px] mb-6">
        <TouchableOpacity 
          onPress={() => { setActiveTab('Pôles'); setSelectedCat('Tous les secteurs'); }}
          className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'Pôles' ? 'bg-white shadow-sm' : ''}`}
        >
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className={`text-xs ${activeTab === 'Pôles' ? 'text-gray-900' : 'text-gray-400'}`}>Pôles de concertation</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => { setActiveTab('Offres'); setSelectedCat('Tout'); }}
          className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'Offres' ? 'bg-white shadow-sm' : ''}`}
        >
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className={`text-xs ${activeTab === 'Offres' ? 'text-gray-900' : 'text-gray-400'}`}>Offres d'emploi</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View className="bg-white flex-row items-center px-4 py-3 rounded-2xl border border-gray-100 mb-6 shadow-sm">
        <Search size={20} color="#9CA3AF" />
        <TextInput
          placeholder={activeTab === 'Pôles' ? "Rechercher un pôle d'intérêt..." : "Poste, domaine ou ville..."}
          className="flex-1 ml-3 font-bold text-gray-700"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Categories Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-2">
        {(activeTab === 'Pôles' ? POLE_CATEGORIES : JOB_CATEGORIES).map((cat) => (
          <TouchableOpacity 
            key={cat}
            onPress={() => setSelectedCat(cat)}
            style={{ 
              backgroundColor: selectedCat === cat ? '#E05017' : 'white',
              borderColor: selectedCat === cat ? '#E05017' : '#E5E7EB'
            }}
            className="px-5 py-2 rounded-full border mx-2 shadow-sm"
          >
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className={selectedCat === cat ? "text-white text-[11px]" : "text-gray-600 text-[11px]"}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activeTab === 'Offres' && !loading && (
        <View className="flex-row justify-between items-center mb-6">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[10px] uppercase tracking-widest">Résultats ({JOBS.length} offres)</Text>
          <SlidersHorizontal size={18} color="#E05017" />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={loading ? [1, 2, 3, 4] : (activeTab === 'Pôles' ? POLES : JOBS)}
        renderItem={loading ? renderSkeleton : (activeTab === 'Pôles' ? renderPoleItem : renderJobItem)}
        keyExtractor={(item, index) => index.toString()}
        numColumns={activeTab === 'Pôles' ? 2 : 1}
        key={activeTab} // Force re-render when switching tabs to change numColumns
        columnWrapperStyle={activeTab === 'Pôles' ? { justifyContent: 'space-between', paddingHorizontal: 24 } : null}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}