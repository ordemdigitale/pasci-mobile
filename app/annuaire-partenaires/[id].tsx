import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Share, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Layers
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';

export default function PartnerDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const slug = id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['ptf', slug],
    queryFn: () => dataService.getPtfBySlug(slug),
    enabled: !!slug,
  });

  const onShare = async () => {
    if (!data) return;
    try {
      await Share.share({ message: `Partenaire PASCI : ${data.name}` });
    } catch (error) { console.log(error); }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-50">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={100} height={20} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <View className="items-center mt-10 px-6">
          <Skeleton width={100} height={100} borderRadius={24} style={{ marginBottom: 20 }} />
          <Skeleton width="80%" height={24} style={{ marginBottom: 12 }} />
          <Skeleton width="60%" height={16} style={{ marginBottom: 30 }} />
          <Skeleton width="100%" height={120} borderRadius={24} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={200} borderRadius={24} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <Building2 size={60} color="#D1D5DB" />
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-center px-8 mt-4">
          Partenaire introuvable ou indisponible.
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-brand-orange px-8 py-3 rounded-2xl">
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white">Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white">
        <TouchableOpacity onPress={() => router.back()} className="bg-orange-50 p-2 rounded-full">
          <ChevronLeft size={24} color="#E05017" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Détails PTF</Text>
        <TouchableOpacity onPress={onShare} className="p-2">
          <Share2 size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center py-8 px-6">
          <View className="w-24 h-24 bg-white rounded-3xl items-center justify-center shadow-lg border border-gray-100 mb-6">
            {data.thumbnail_url ? (
              <Image source={{ uri: data.thumbnail_url }} style={{ width: 72, height: 72 }} resizeMode="contain" />
            ) : (
              <Building2 size={40} color="#E05017" />
            )}
          </View>

          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl text-center px-4 mb-3">
            {data.name}
          </Text>

          {data.pays && (
            <View className="flex-row items-center bg-gray-50 px-4 py-2 rounded-full">
              <MapPin size={12} color="#9CA3AF" />
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs ml-1">{data.pays}</Text>
            </View>
          )}

          {data.date_creation && (
            <View className="flex-row items-center mt-2">
              <Calendar size={12} color="#9CA3AF" />
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs ml-1">
                Depuis {new Date(data.date_creation).getFullYear()}
              </Text>
            </View>
          )}
        </View>

        <View className="bg-gray-50/50 pt-6 pb-20">
          {/* Domaines */}
          {data.domaines_list && data.domaines_list.length > 0 && (
            <View className="px-6 mb-8">
              <View className="flex-row items-center mb-4">
                <Layers size={16} color="#E05017" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base ml-2">
                  Domaines d'intervention
                </Text>
              </View>
              <View className="flex-row flex-wrap">
                {data.domaines_list.map((domaine, i) => (
                  <View key={i} className="bg-white px-4 py-2 rounded-xl mr-2 mb-2 border border-orange-100 shadow-sm">
                    <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-xs">{domaine}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          {data.description && (
            <View className="px-6 mb-8">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-3">
                À propos
              </Text>
              <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 leading-6 text-sm">
                  {data.description}
                </Text>
              </View>
            </View>
          )}

          {/* Mission */}
          {data.mission && (
            <View className="px-6 mb-8">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-3">Mission</Text>
              <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 leading-6 text-sm">
                  {data.mission}
                </Text>
              </View>
            </View>
          )}

          {/* Vision */}
          {data.vision && (
            <View className="px-6 mb-8">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-3">Vision</Text>
              <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 leading-6 text-sm">
                  {data.vision}
                </Text>
              </View>
            </View>
          )}

          {/* Contact */}
          <View className="px-6">
            <View className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-5">
                Contact & Informations
              </Text>

              {data.website && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(data.website!.startsWith('http') ? data.website! : `https://${data.website}`)}
                  className="flex-row items-center mb-5"
                >
                  <View className="bg-orange-50 p-2.5 rounded-xl mr-4">
                    <Globe size={20} color="#E05017" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase mb-0.5">Site Web</Text>
                    <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-sm">{data.website}</Text>
                  </View>
                </TouchableOpacity>
              )}

              {data.address && (
                <View className="flex-row items-start mb-5">
                  <View className="bg-orange-50 p-2.5 rounded-xl mr-4">
                    <MapPin size={20} color="#E05017" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase mb-0.5">Adresse</Text>
                    <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-800 text-sm leading-5">{data.address}</Text>
                  </View>
                </View>
              )}

              {data.email && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`mailto:${data.email}`)}
                  className="flex-row items-center mb-5"
                >
                  <View className="bg-orange-50 p-2.5 rounded-xl mr-4">
                    <Mail size={20} color="#E05017" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase mb-0.5">Email</Text>
                    <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-800 text-sm">{data.email}</Text>
                  </View>
                </TouchableOpacity>
              )}

              {data.phone && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${data.phone}`)}
                  className="flex-row items-center"
                >
                  <View className="bg-orange-50 p-2.5 rounded-xl mr-4">
                    <Phone size={20} color="#E05017" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase mb-0.5">Téléphone</Text>
                    <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-800 text-sm">{data.phone}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
