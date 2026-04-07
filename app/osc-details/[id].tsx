import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  MapPin, 
  Users, 
  GraduationCap, 
  Stethoscope,
  Info,
  Phone,
  Mail,
  Globe,
  ChevronRight,
  Bookmark,
  BadgeCheck
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';

const { width } = Dimensions.get('window');

export default function OscDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['osc', id],
    queryFn: () => dataService.getPartnerById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-50">
          <Skeleton width={40} height={40} borderRadius={20} />
          <View className="items-center">
            <Skeleton width={100} height={14} style={{ marginBottom: 4 }} />
            <Skeleton width={80} height={10} />
          </View>
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <View className="px-6 mt-6 items-center">
          <Skeleton width="100%" height={280} borderRadius={48} />
          <Skeleton width="100%" height={80} borderRadius={24} style={{ marginTop: 24 }} />
          <Skeleton width="100%" height={150} borderRadius={24} style={{ marginTop: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 py-4 flex-row justify-between items-center">
          <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full">
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900">Erreur</Text>
          <View style={{ width: 40 }} />
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-center">
            Impossible de charger les détails de cette organisation
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View className="items-center">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[11px] uppercase tracking-widest">Détails de l'OSC</Text>
          <View className="flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-brand-orange mr-1.5" />
            <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-[9px] uppercase tracking-widest">Membre du réseau pasci</Text>
          </View>
        </View>
        <View className="bg-gray-50 p-2 rounded-full"/>
         
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View className="px-6 mt-4">
          <View className="bg-white rounded-[48px] p-8 items-center border border-gray-100 shadow-2xl shadow-gray-300 elevation-10">
            <View className="relative mb-6">
              <View className="w-28 h-28 bg-orange-50 rounded-[36px] items-center justify-center overflow-hidden">
                {data.thumbnail_url ? (
                  <Image 
                    source={{ uri: data.thumbnail_url }} 
                    style={{ width: 112, height: 112 }} 
                    resizeMode="cover" 
                  />
                ) : (
                  <Image 
                    source={require('../../assets/logo.png')} 
                    style={{ width: 60, height: 60 }} 
                    resizeMode="contain" 
                  />
                )}
              </View>
              <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                <View className="bg-[#2a591d] rounded-full p-1">
                  <BadgeCheck size={16} color="white" />
                </View>
              </View>
            </View>

            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl text-center mb-6 px-4">
              {data.name}
            </Text>

            {/* Location Info */}
            <View className="bg-gray-50 flex-row items-center px-5 py-2.5 rounded-2xl">
              <MapPin size={14} color="#E05017" />
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs ml-2">
                {data.ville ? `${data.address ? data.address + ', ' : ''}${data.ville}` : data.address || 'Localisation non disponible'}
              </Text>
            </View>
          </View>
        </View>

        {/* Connection Card */}
        {data.crasc && (
          <TouchableOpacity 
            onPress={() => router.push(`/crasc-details/${data.crasc.slug}`)}
            className="mx-6 mt-8 bg-white rounded-3xl p-5 border border-orange-100 flex-row items-center shadow-sm"
          >
            <View className="bg-brand-orange p-3 rounded-2xl mr-4">
              <Users size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-[10px] uppercase">Rattaché au crasc :</Text>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm">{data.crasc.name}</Text>
            </View>
            <ChevronRight size={20} color="#D1D5DB" />
          </TouchableOpacity>
        )}

        {/* About Section */}
        <View className="px-8 mt-10">
          <View className="flex-row items-center mb-4">
            <View className="bg-brand-orange/10 p-1.5 rounded-lg mr-3">
              <Info size={16} color="#E05017" />
            </View>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[11px] uppercase tracking-widest">À propos de l'organisation</Text>
          </View>
          <View className="bg-white rounded-3xl p-6 border border-gray-50">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 leading-6 text-base">
              {data.description || `${data.name} est une organisation membre du réseau PASCI basée à ${data.ville || 'Côte d\'Ivoire'}. Elle contribue activement au développement et à la promotion de la société civile.`}
            </Text>
          </View>
        </View>

        {/* Coordinates Section */}
        <View className="px-8 mt-8 mb-24">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[11px] uppercase tracking-widest mb-4">Coordonnées</Text>
          
          <View className="space-y-4">
            {data.phone && (
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${data.phone}`)} className="flex-row items-center py-3 px-4 bg-white rounded-2xl border border-gray-50">
                <Phone size={18} color="#E05017" />
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-900 ml-4 text-sm">{data.phone}</Text>
              </TouchableOpacity>
            )}
            
            {data.email && (
              <TouchableOpacity onPress={() => Linking.openURL(`mailto:${data.email}`)} className="flex-row items-center py-3 px-4 bg-white rounded-2xl border border-gray-50">
                <Mail size={18} color="#E05017" />
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-900 ml-4 text-sm">{data.email}</Text>
              </TouchableOpacity>
            )}
            
            {data.website && (
              <TouchableOpacity onPress={() => Linking.openURL(`http://${data.website}`)} className="flex-row items-center py-3 px-4 bg-white rounded-2xl border border-gray-50">
                <Globe size={18} color="#E05017" />
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-900 ml-4 text-sm">{data.website}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      
    </SafeAreaView>
  );
}
