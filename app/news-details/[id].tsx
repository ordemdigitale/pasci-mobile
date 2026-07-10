import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  ChevronLeft, 
  ArrowUp,
  Calendar,
  User,
  Share2
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';

const { width } = Dimensions.get('window');

// Helper to strip HTML tags from content
const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
};

export default function NewsDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [fontSize, setFontSize] = useState(16);
  const scrollRef = useRef<ScrollView>(null);
  
  const { data, isLoading } = useQuery({
    queryKey: ['news-detail', id],
    queryFn: () => dataService.getNewsById(id as string),
    enabled: !!id,
  });

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const onShare = async () => {
    if (!data) return;
    try {
      await Share.share({
        message: `${data.title}\n\nRetrouvez cette actualité sur la plateforme PdoC.`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-50">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={120} height={16} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <ScrollView className="flex-1 px-6 mt-6">
          <Skeleton width="100%" height={250} borderRadius={32} />
          <Skeleton width="100%" height={30} style={{ marginTop: 24 }} />
          <Skeleton width="100%" height={200} style={{ marginTop: 24 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!data) return null;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white z-10 border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View className="items-center">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Actualité</Text>
            <Text className="text-brand-orange text-[10px] font-bold uppercase tracking-widest">
                {data.crasc?.name || 'PASCI INFO'}
            </Text>
        </View>
        <TouchableOpacity onPress={onShare} className="bg-gray-50 p-2 rounded-full">
          <Share2 size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollRef}
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {/* Featured Image */}
        <View className="px-4 mt-6">
          <View className="rounded-[40px] overflow-hidden shadow-2xl shadow-black/10">
            <Image 
              source={data.thumbnail_url ? { uri: data.thumbnail_url } : require('../../assets/hero-image.png')} 
              style={{ width: '100%', height: 280 }} 
              resizeMode="cover" 
            />
            {/* Overlay Badges */}
            <View className="absolute top-6 left-6 flex-row gap-2">
                <View className="bg-brand-orange px-4 py-1.5 rounded-full">
                    <Text className="text-white text-[10px] font-bold uppercase tracking-widest">ACTUALITÉ</Text>
                </View>
                {data.osc && (
                    <View className="bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md">
                        <Text className="text-white text-[10px] font-bold uppercase tracking-widest">{data.osc.ville}</Text>
                    </View>
                )}
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View className="px-8 mt-10">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl leading-8 mb-6">
            {data.title}
          </Text>

          {/* Meta Info */}
          <View className="flex-row items-center justify-between mb-8 pb-8 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center mr-3 overflow-hidden">
                {data.osc?.thumbnail_url ? (
                    <Image source={{ uri: data.osc.thumbnail_url }} style={{ width: 40, height: 40 }} />
                ) : (
                    <User size={18} color="#E05017" />
                )}
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-xs" >
                    {data.osc?.name || 'Équipe PASCI'}
                </Text>
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px]">
                    {data.osc ? 'Organisation' : 'Auteur'}
                </Text>
                <View className="flex-row items-center mt-1">
                <Calendar size={14} color="#9ca3af" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1 ">
                    {new Date(data.created_at).toLocaleDateString('fr-FR')}
                </Text>
              </View>
              </View>
            </View>
            
          </View>

          {/* Article Text */}
          <View className="relative">
            <Text 
              style={{ 
                fontFamily: 'Karla_400Regular', 
                fontSize: fontSize,
                lineHeight: fontSize * 1.6
              }} 
              className="text-gray-600 mb-6"
            >
              {stripHtml(data.content)}
            </Text>
          </View>
          
          {/* Related OSC/CRASC Info Card */}
          {(data.crasc || data.osc) && (
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => {
                    if (data.crasc) router.push(`/crasc-details/${data.crasc.slug}`);
                    else if (data.osc) router.push(`/osc-details/${data.osc.slug}`);
                }}
                className="mt-8 p-6 bg-gray-50 rounded-[32px] border border-gray-100 shadow-sm"
              >
                  <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[10px] uppercase tracking-widest mb-4">Source de l'information</Text>
                  <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center mr-4 shadow-sm overflow-hidden">
                          {data.osc?.thumbnail_url ? (
                              <Image source={{ uri: data.osc.thumbnail_url }} style={{ width: 32, height: 32 }} resizeMode="contain" />
                          ) : (
                              <Image source={require('../../assets/logo.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
                          )}
                      </View>
                      <View className="flex-1">
                          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm">
                              {data.crasc?.name || data.osc?.name}
                          </Text>
                          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px]">
                              {data.crasc ? "Pôle Régional d'Appui" : "Organisation Membre"}
                          </Text>
                      </View>
                      <View className="bg-white p-2 rounded-full shadow-sm">
                          <ChevronLeft size={16} color="#E05017" style={{ transform: [{ rotate: '180deg'}] }} />
                      </View>
                  </View>
              </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Controls */}
      <View className="absolute bottom-10 left-0 right-0 px-8 flex-row justify-between items-center">
        <View className="bg-white/95 px-5 py-3 rounded-full border border-gray-100 flex-row items-center gap-6 shadow-xl backdrop-blur-md">
          <TouchableOpacity onPress={() => setFontSize(prev => Math.max(14, prev - 2))}>
            <Text className="text-gray-400 font-bold text-lg">A-</Text>
          </TouchableOpacity>
          <View className="w-[1px] h-4 bg-gray-200" />
          <TouchableOpacity onPress={() => setFontSize(prev => Math.min(24, prev + 2))}>
            <Text className="text-gray-900 font-bold text-lg">A+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={scrollToTop}
          className="bg-brand-orange w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-orange-300"
        >
          <ArrowUp size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
