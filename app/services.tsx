import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, CheckCircle } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/dataService';

const logo = require('../assets/logo.png');

export default function ServicesScreen() {
  const router = useRouter();

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => dataService.getServices?.() || Promise.resolve([]),
  });

  const defaultServices = [
    {
      id: 1,
      title: 'Appui-Conseil',
      description: 'Bénéficiez d\'un accompagnement personnalisé pour développer votre organisation',
      features: ['Diagnostic stratégique', 'Plan de développement', 'Suivi régulier']
    },
    {
      id: 2,
      title: 'Renforcement des Capacités',
      description: 'Améliorez les compétences de votre équipe avec nos formations spécialisées',
      features: ['Formations sur mesure', 'Ateliers pratiques', 'Mentorat']
    },
    {
      id: 3,
      title: 'Ressources Documentaires',
      description: 'Accédez à une bibliothèque complète de documents et guides utiles',
      features: ['Templates', 'Guides pratiques', 'Cas d\'étude']
    },
    {
      id: 4,
      title: 'Mise en Réseau',
      description: 'Connectez-vous avec d\'autres organisations et partenaires',
      features: ['Réseautage', 'Collaborations', 'Partenariats']
    },
  ];

  const displayServices = services && services.length > 0 ? services : defaultServices;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color="#E05017" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg flex-1">
          Nos Services
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Hero Section */}
        <View className="px-6 pt-6 pb-4">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-2xl text-gray-900 mb-2">
            Services Stratégiques PDOC
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm">
            Des accompagnements adaptés à vos besoins pour renforcer votre organisation
          </Text>
        </View>

        {/* Services List */}
        <View className="px-6 pb-6">
          {displayServices.map((service: any) => (
            <View key={service.id} className="bg-gray-50 rounded-[32px] p-6 mb-4 border border-gray-100">
              <View className="flex-row items-center mb-3">
                <View className="bg-brand-orange/10 w-10 h-10 rounded-full items-center justify-center mr-3">
                  <CheckCircle size={20} color="#E05017" />
                </View>
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base flex-1">
                  {service.title}
                </Text>
              </View>
              
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm leading-5 mb-4">
                {service.description}
              </Text>

              {(service.features || []).length > 0 && (
                <View className="bg-white rounded-xl p-3">
                  {service.features.map((feature: string, idx: number) => (
                    <View key={idx} className="flex-row items-center mb-2">
                      <View className="w-1.5 h-1.5 rounded-full bg-brand-orange mr-2" />
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs">
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* CTA Section */}
        <View className="px-6 pb-6">
          <TouchableOpacity
            onPress={() => router.push('/contact')}
            className="bg-brand-orange py-4 rounded-[24px] flex-row items-center justify-center shadow-lg"
          >
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-base">
              Nous Contacter
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
