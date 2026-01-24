import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  Clock, 
  Video, 
  Calendar, 
  MapPin, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react-native';
import Skeleton from '../components/ui/Skeleton';

const { width } = Dimensions.get('window');

const CATEGORIES = ['Tous', 'Gouvernance', 'Plaidoyer', 'Finance', 'Management'];

const COURSES = [
  {
    id: '1',
    title: 'Mobilisation citoyenne et stratégies de plaidoyer numérique',
    tag: 'PLAIDOYER DIGITAL',
    status: 'INSCRIT',
    duration: '4 Semaines',
    mode: 'En ligne',
    progress: 0.6,
    type: 'continue',
    color: '#E05017'
  },
  {
    id: '2',
    title: 'Gestion de projets complexes en milieu associatif',
    tag: 'MANAGEMENT',
    status: 'OUVERT',
    date: '25 Nov 2023',
    location: 'Yamoussoukro',
    type: 'open',
    color: '#3B82F6'
  },
  {
    id: '3',
    title: 'Intégration de l’approche genre dans les projets de développement',
    tag: 'GENRE & INCLUSION',
    status: 'OUVERT',
    date: '05 Déc 2023',
    mode: 'Hybride',
    type: 'open',
    color: '#10B981'
  }
];

export default function FormationsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const renderHeader = () => (
    <View className="px-6 pt-4">
      {/* Search & Filter Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-2xl text-gray-900">Catalogue</Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-brand-orange text-[10px] font-bold uppercase tracking-widest">Pasci Project</Text>
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
        {CATEGORIES.map((cat) => (
          <TouchableOpacity 
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={{ 
              backgroundColor: selectedCategory === cat ? '#E05017' : 'white',
              borderColor: selectedCategory === cat ? '#E05017' : '#E5E7EB'
            }}
            className="px-6 py-2.5 rounded-full border mx-2 shadow-sm"
          >
            <Text 
              style={{ fontFamily: 'Poppins_600SemiBold' }} 
              className={selectedCategory === cat ? "text-white text-xs" : "text-gray-600 text-xs"}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Section */}
      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-xs uppercase tracking-widest mb-4">À la une</Text>
      <TouchableOpacity className="bg-gray-900 rounded-[40px] overflow-hidden mb-10 shadow-xl shadow-gray-400">
        <Image 
          source={require('../assets/hero-image.png')} 
          className="w-full h-64 opacity-60"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 p-8">
          <View className="bg-brand-orange self-start px-3 py-1 rounded-lg mb-3">
            <Text className="text-white text-[10px] font-bold uppercase">Urgent</Text>
          </View>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-2xl leading-8 mb-4">
            Transparence Financière pour les OSC
          </Text>
          <View className="flex-row items-center">
            <Calendar size={14} color="white" />
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-white text-xs ml-1.5 mr-4">12 Oct 2023</Text>
            <MapPin size={14} color="white" />
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-white text-xs ml-1.5">Abidjan</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View className="flex-row justify-between items-center mb-6">
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900">Formations disponibles</Text>
        <Text className="text-brand-orange font-bold text-xs">14 modules</Text>
      </View>
    </View>
  );

  const renderCourseItem = ({ item }) => (
    <View className="bg-white rounded-[40px] p-6 mb-6 mx-6 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <View className="bg-orange-50 px-3 py-1 rounded-lg">
          <Text style={{ color: '#E05017', fontSize: 9, fontWeight: 'bold' }}>{item.tag}</Text>
        </View>
        {item.status === 'INSCRIT' ? (
          <View className="flex-row items-center">
            <CheckCircle2 size={14} color="#10B981" />
            <Text className="text-green-500 font-bold text-[10px] ml-1.5">INSCRIT</Text>
          </View>
        ) : (
          <Text className="text-gray-400 font-bold text-[10px]">{item.status}</Text>
        )}
      </View>

      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-4 leading-6">
        {item.title}
      </Text>

      <View className="flex-row items-center mb-6">
        {item.duration && (
          <>
            <Clock size={14} color="#9CA3AF" />
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs ml-1.5 mr-4">{item.duration}</Text>
          </>
        )}
        {item.mode && (
          <>
            <Video size={14} color="#9CA3AF" />
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs ml-1.5 mr-4">{item.mode}</Text>
          </>
        )}
        {item.location && (
          <>
            <MapPin size={14} color="#9CA3AF" />
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs ml-1.5 mr-4">{item.location}</Text>
          </>
        )}
        {item.date && (
          <>
            <Calendar size={14} color="#9CA3AF" />
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs ml-1.5">{item.date}</Text>
          </>
        )}
      </View>

      {item.type === 'continue' ? (
        <>
          <View className="h-1.5 w-full bg-gray-100 rounded-full mb-6 overflow-hidden">
            <View style={{ width: `${item.progress * 100}%` }} className="h-full bg-brand-orange" />
          </View>
          <TouchableOpacity 
            onPress={() => router.push({ pathname: `/course-details/${item.id}`, params: { subscribed: 'true' } })}
            className="bg-gray-50 py-4 rounded-2xl items-center border border-gray-100"
          >
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm">Continuer le module</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity 
          onPress={() => router.push({ pathname: `/course-details/${item.id}`, params: { subscribed: 'false' } })}
          className="bg-brand-orange py-4 rounded-2xl items-center shadow-lg shadow-orange-200"
        >
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white text-sm">S'inscrire maintenant</Text>
        </TouchableOpacity>
      )}
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
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={loading ? [1, 2, 3] : COURSES}
        renderItem={loading ? renderSkeleton : renderCourseItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

