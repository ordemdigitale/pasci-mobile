import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, FileText, Target } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import TexteFormate from '../../components/TexteFormate';

const { width } = Dimensions.get('window');

/** « Voir plus » d'une image du carrousel : descriptif de l'activité illustrée. */
export default function SlideDescriptifScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: slide, isLoading, isError } = useQuery({
    queryKey: ['hero-slide', id],
    queryFn: () => dataService.getHeroSlide(id as string),
    enabled: !!id,
    retry: false,
  });

  const entete = (
    <View className="px-6 py-4 flex-row items-center border-b border-gray-50">
      <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full mr-3">
        <ChevronLeft size={24} color="#1F2937" />
      </TouchableOpacity>
      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg flex-1" numberOfLines={1}>
        Activité
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />
        {entete}
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#E05017" size="large" /></View>
      </SafeAreaView>
    );
  }

  if (isError || !slide) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />
        {entete}
        <View className="flex-1 items-center justify-center px-8">
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-center">
            Cette activité n'est plus affichée.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const photos = [slide.photo1_url, slide.photo2_url].filter(Boolean) as string[];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      {entete}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Image source={{ uri: slide.image_url }} style={{ width, height: (width * 9) / 16 }} resizeMode="cover" />
        <View className="px-6 pt-5">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-[#2a591d] text-xl mb-2">{slide.title || 'Activité'}</Text>
          {!!slide.description && (
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm leading-5 mb-5">{slide.description}</Text>
          )}

          {!!slide.objectif && (
            <View className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <Target size={16} color="#E05017" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm ml-2">Objectif de l'activité</Text>
              </View>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-700 text-sm leading-5">{slide.objectif}</Text>
            </View>
          )}
          {!!slide.resume && (
            <View className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <FileText size={16} color="#2a591d" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm ml-2">Résumé de l'activité</Text>
              </View>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-700 text-sm leading-5">{slide.resume}</Text>
            </View>
          )}

          {photos.map((url) => (
            <Image key={url} source={{ uri: url }} className="w-full rounded-2xl mb-4" style={{ height: ((width - 48) * 3) / 4 }} resizeMode="cover" />
          ))}

          {!!slide.article && (
            <View className="mt-2">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-2">Article</Text>
              <TexteFormate texte={slide.article} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
