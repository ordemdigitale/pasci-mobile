import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, Share, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  ChevronLeft, 
  Share2, 
  Mail, 
  Phone, 
  ArrowRight
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';

const { width } = Dimensions.get('window');

// Mock data based on the maquette and web structure
const CRASC_DATA = {
  'crasc-nord': {
    name: 'CRASC Abidjan Nord',
    region: 'Région des Lagunes',
    status: 'BUREAU ACTIF',
    membersCount: 142,
    membersGrowth: '+12%',
    activeProjects: 28,
    projectStatus: 'en cours',
    description: 'Le CRASC Abidjan Nord coordonne les actions de la société civile dans les communes d’Abidjan Nord. Il se concentre sur l’éducation, la santé communautaire et le renforcement des capacités institutionnelles des OSC locales pour un impact durable.',
    oscs: [
      { id: '1', name: 'ONG Bloom', category: 'Protection de l’enfance & Femmes', logo: null, color: '#FEF3C7' },
      { id: '2', name: 'Action Côte d’Ivoire', category: 'Développement rural', logo: null, color: '#DBEAFE' },
      { id: '3', name: 'Espace Citoyen', category: 'Gouvernance & Transparence', logo: null, color: '#DCFCE7' },
      { id: '4', name: 'Santé pour Tous', category: 'Santé & Prévention', logo: null, color: '#FEE2E2' },
    ]
  }
};

export default function CrascDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const data = CRASC_DATA[id as string] || CRASC_DATA['crasc-nord'];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Découvrez le ${data.name} sur la plateforme PASCI.`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderHeader = () => (
    <View className="mb-6">
      {/* Main Info Card */}
      <View className="bg-white rounded-[40px] p-6 border border-gray-100 shadow-xl shadow-gray-200 elevation-5">
        <View className="flex-row items-center mb-8">
          <View className="w-20 h-20 bg-orange-50 rounded-3xl items-center justify-center mr-4">
            <Image 
              source={require('../../assets/logo.png')} 
              style={{ width: 45, height: 45 }} 
              resizeMode="contain" 
            />
          </View>
          <View className="flex-1">
            <View className="bg-green-100 self-start px-3 py-1 rounded-lg mb-2">
              <Text className="text-green-600 text-[10px] font-bold">{data.status}</Text>
            </View>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl" numberOfLines={1}>Coordination Régionale</Text>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm">{data.region}</Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <View className="bg-gray-50 rounded-3xl p-4 w-[48%] items-center">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] uppercase mb-2">OSC Membres</Text>
            <View className="flex-row items-baseline">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl">{data.membersCount}</Text>
              <Text className="text-green-500 text-xs font-bold ml-1">{data.membersGrowth}</Text>
            </View>
          </View>
          <View className="bg-gray-50 rounded-3xl p-4 w-[48%] items-center">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] uppercase mb-2">Projets Actifs</Text>
            <View className="flex-row items-baseline">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl">{data.activeProjects}</Text>
              <Text className="text-gray-400 text-[10px] ml-1">{data.projectStatus}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* About Section */}
      <View className="px-2 mt-10">
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-xs uppercase tracking-widest mb-4">À propos du pôle</Text>
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-sm">
          {data.description}
        </Text>
      </View>

      {/* Contact Buttons */}
      <View className="flex-row justify-between mt-8">
        <TouchableOpacity className="flex-row items-center justify-center bg-white border border-gray-100 shadow-sm py-4 rounded-3xl w-[48%]">
          <Mail size={18} color="#E05017" />
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 ml-2">Email</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-center bg-white border border-gray-100 shadow-sm py-4 rounded-3xl w-[48%]">
          <Phone size={18} color="#E05017" />
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 ml-2">Téléphone</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center mt-10 mb-4 px-2">
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-xs uppercase tracking-widest">Liste des OSC Membres</Text>
        <TouchableOpacity>
          <Text className="text-brand-orange font-bold text-xs">Voir tout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOscItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/osc-details/${item.id}`)}
      className="bg-white rounded-3xl p-4 mb-4 border border-gray-50 shadow-sm flex-row items-center"
    >
      <View style={{ backgroundColor: item.color }} className="w-14 h-14 rounded-2xl items-center justify-center mr-4">
        <Text style={{ color: '#4B5563', fontWeight: 'bold' }}>{item.name.substring(0, 2).toUpperCase()}</Text>
      </View>
      <View className="flex-1">
        <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm" numberOfLines={1}>{item.name}</Text>
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] mt-0.5" numberOfLines={1}>{item.category}</Text>
      </View>
      <View className="bg-orange-50 px-3 py-1.5 rounded-full">
        <Text className="text-brand-orange font-bold text-[10px]">PROFIL</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-50">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={120} height={16} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <View className="px-6 mt-6">
          <Skeleton width="100%" height={250} borderRadius={32} />
          <Skeleton width="100%" height={100} style={{ marginTop: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Fixed */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white z-10">
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

      <FlatList
        data={data.oscs}
        renderItem={renderOscItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}