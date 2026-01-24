import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Eye, Heart, Mail } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const OBJECTIFS = [
  { id: 1, title: 'Renforcement Technique', desc: 'Formations spécialisées sur la gestion de projet et le plaidoyer politique.' },
  { id: 2, title: 'Soutien Financier', desc: 'Octroi de subventions pour des projets à fort impact social en Côte d’Ivoire.' },
  { id: 3, title: 'Mise en Réseau', desc: 'Création de ponts entre les OSC et les institutions étatiques.' },
];

const PARTENAIRES = [
  { name: 'Union Européen...', role: 'PRINCIPAL BAILLEUR', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/1200px-Flag_of_Europe.svg.png' },
  { name: 'Coordination OSC', role: 'PARTENAIRE TECHNIQUE', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
  { name: 'Ministère...', role: 'APPUI INSTITUTIONNEL', image: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png' },
];

export default function AproposScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color="#E05017" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg flex-1 text-center pr-8">À Propos de PASCI</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="px-6 mt-6">
          <View className="relative rounded-[40px] overflow-hidden">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop' }} 
              className="w-full h-64" 
              resizeMode="cover" 
            />
            <View className="absolute inset-0 bg-black/20" />
            <View className="absolute bottom-8 left-8">
              <Text className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">Impact Côte d'Ivoire</Text>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-3xl">Le Projet PASCI</Text>
            </View>
          </View>
        </View>

        {/* Mission Section */}
        <View className="px-8 mt-10">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-[10px] uppercase tracking-widest mb-4">Notre Mission</Text>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl leading-9 mb-6">
            Transformer la société civile pour une Côte d'Ivoire plus inclusive.
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-base">
            Le Projet d'Appui à la Société Civile Ivoirienne (PASCI) est une initiative stratégique visant à renforcer les capacités techniques, financières et de plaidoyer des organisations locales. Nous croyons en une gouvernance participative où chaque voix compte.
          </Text>
        </View>

        {/* Vision & Valeurs Cards */}
        <View className="px-6 mt-10 flex-row justify-between">
          <View className="bg-white border border-gray-100 p-6 rounded-[32px] w-[48%] shadow-sm">
            <View className="bg-orange-50 w-12 h-12 rounded-2xl items-center justify-center mb-4">
              <Eye size={24} color="#E05017" />
            </View>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-2">Vision</Text>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] leading-4">Une société civile autonome et professionnelle.</Text>
          </View>
          <View className="bg-white border border-gray-100 p-6 rounded-[32px] w-[48%] shadow-sm">
            <View className="bg-orange-50 w-12 h-12 rounded-2xl items-center justify-center mb-4">
              <Heart size={24} color="#E05017" />
            </View>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-2">Valeurs</Text>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] leading-4">Intégrité, inclusion et transparence radicale.</Text>
          </View>
        </View>

        {/* Objectifs Clés Section */}
        <View className="bg-orange-50/30 mt-12 px-8 py-12">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl mb-10">Objectifs Clés</Text>
          
          {OBJECTIFS.map((obj, index) => (
            <View key={obj.id} className="flex-row mb-10 relative">
              {index !== OBJECTIFS.length - 1 && (
                <View className="absolute left-4 top-10 w-[1px] h-16 bg-orange-200" />
              )}
              <View className="w-9 h-9 bg-brand-orange rounded-full items-center justify-center z-10">
                <Text className="text-white font-bold">{obj.id}</Text>
              </View>
              <View className="flex-1 ml-6">
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-2">{obj.title}</Text>
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm leading-5">{obj.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Nos Partenaires */}
        <View className="mt-12 px-6">
          <View className="flex-row justify-between items-center mb-8">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Nos Partenaires</Text>
            <TouchableOpacity><Text className="text-brand-orange font-bold text-xs uppercase">Voir tout</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
            {PARTENAIRES.map((p, i) => (
              <View key={i} className="bg-white border border-gray-100 p-5 rounded-[32px] w-40 mx-2 items-center shadow-sm">
                <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mb-4">
                  <Image source={{ uri: p.image }} className="w-10 h-10" resizeMode="contain" />
                </View>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 10 }} className="text-gray-900 text-center mb-1">{p.name}</Text>
                <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 8 }} className="text-gray-400 text-center">{p.role}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Contact Button */}
        <View className="px-6 mt-12 mb-6">
          <TouchableOpacity className="bg-brand-orange py-5 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-orange-300">
            <Mail size={20} color="white" />
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-lg ml-3">Nous Contacter</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text className="text-center text-gray-300 text-[10px] mb-10 uppercase tracking-widest">
          PASCI CÔTE D'IVOIRE © 2024 - TOUS DROITS RÉSERVÉS
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}