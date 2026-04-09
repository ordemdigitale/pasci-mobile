import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Eye, Heart, Mail, Building2 } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/dataService';
import { PTF } from '../services/types';

const { width } = Dimensions.get('window');

const OBJECTIFS = [
  { id: 1, title: 'Accès à l\'information', desc: 'Faciliter l\'accès à l\'information sur toutes les opportunités d\'appuis techniques et financiers pour les OSC.' },
  { id: 2, title: 'Renforcement des capacités', desc: 'Renforcer les capacités techniques, organisationnelles et institutionnelles des Organisations de la Société Civile de sa zone.' },
  { id: 3, title: 'Appui-conseils et performances', desc: 'Améliorer les conditions et cadres de travail des OSC, les accompagner, leur apporter des appuis-conseils et des connaissances pour améliorer leurs performances, afin qu\'elles deviennent des interlocuteurs crédibles, reconnus, informés et compétents.' },
  { id: 4, title: 'Cadre d\'échanges', desc: 'Créer un cadre d\'échanges et de mutualisation de différents services au bénéfice des OSC.' },
];

const ZONES_COUVERTURE = [
  { id: 'centre', title: 'CRASC Centre', count: 5, regions: 'Bélier, Gbêkè, Hambol, Marahoué, N\'zi', color: '#F59E42' },
  { id: 'est', title: 'CRASC Est', count: 4, regions: 'Bounkani, Gontougo, Iffou, Moronou', color: '#FF6B8A' },
  { id: 'nord', title: 'CRASC Nord', count: 7, regions: 'Bagoué, Béré, Kabadougou, Poro, Folon, Tchologo, Worodougou', color: '#5A7D5A' },
  { id: 'ouest', title: 'CRASC Ouest', count: 5, regions: 'Bafing, Cavally, Guémon, Haut-Sassandra, Tonkpi', color: '#2E86C1' },
  { id: 'sud', title: 'CRASC Sud', count: 10, regions: 'Agnéby-Tiassa, Gbokle, Goh, Me, San-Pedro, Grands-Ponts, Indénié-Djuablin, Loh-Djiboua, Nawa, Sud-Comoé, Abidjan', color: '#4FC3DC' },
];

const STRUCTURATION = [
  'L\'Assemblée Générale',
  'Le Conseil d\'Administration',
  'La Direction Exécutive',
  'Délégations régionales',
  'Le Commissariat aux comptes',
];

export default function AproposScreen() {
  const router = useRouter();

  const { data: ptfList } = useQuery({
    queryKey: ['ptf'],
    queryFn: dataService.getPtfList,
  });

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
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-[10px] uppercase tracking-widest mb-4">Présentation</Text>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl leading-9 mb-6">Présentation de la plateforme</Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-base mb-6">
            Cette Plateforme digitale est la résultante d’une démarche alliant à la fois, inclusivité, représentativité, accessibilité et pérennité. Elle vise à accroitre la visibilité des OSC, la synergie d’action et le partage d’expérience.
          </Text>
          
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl leading-9 mb-6">Présentation du CRASC</Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-base mb-6">
            Le Centre Régional d’Appui à la Société Civile (CRASC) est un dispositif régional de mutualisation des compétences et des services au bénéfice des OSC de la Côte d'Ivoire. Sa mission essentielle est de renforcer les capacités techniques, organisationnelles et institutionnelles des OSC.
          </Text>

          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-[10px] uppercase tracking-widest mb-4">Historique de mise en place des CRASC</Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-base mb-4">
            En Côte d'Ivoire le Mapping en Juillet 2010 de la société civile a fait ressortir les principales difficultés auxquelles la société civile est confrontée. Pour combler ces multiples insuffisances, les principales stratégies à moyen et long termes identifiées par l'État de Côte d'Ivoire et l'Union Européenne ont conduit à la création d'un programme d'appui aux organisations de la société civile ivoirienne intitulé LIANE (Leadership & Initiatives des Acteurs Non Étatiques).
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-base mb-6">
            L'un des résultats du projet LIANE I, piloté par le CERAP, dans le cadre du processus de renforcement des capacités a été la création du "Centre Régional d'Appui à la Société Civile (CRASC)" en Juillet 2015, pour pérenniser les acquis du projet.
          </Text>

          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl mb-4">Missions des CRASC</Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-base">
            La mission essentielle des CRASC est de renforcer les capacités techniques, organisationnelles et institutionnelles des OSC de leur zone de couverture.
          </Text>
        </View>

        {/* Objectifs Clés Section */}
        <View className="bg-orange-50/30 mt-12 px-8 py-12">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl mb-10">Objectifs des CRASC</Text>
          
          {OBJECTIFS.map((obj, index) => (
            <View key={obj.id} className="flex-row mb-10 relative">
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

        {/* Structuration Section */}
        <View className="px-8 mt-12">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl mb-6">Structuration</Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 mb-6 leading-6">
            Les CRASC disposent de 5 organes de gestion pour assurer leur bon fonctionnement et leur transparence :
          </Text>
          <View className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm">
            {STRUCTURATION.map((item, index) => (
              <View key={index} className={`flex-row items-center py-3 ${index !== STRUCTURATION.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <View className="w-2 h-2 rounded-full bg-brand-orange mr-4" />
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-700 text-sm">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Zones de couverture */}
        <View className="px-8 mt-12 mb-6">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl mb-6">Zones de couverture</Text>
          {ZONES_COUVERTURE.map((zone) => (
            <View key={zone.id} className="bg-white border border-gray-100 p-5 rounded-[32px] mb-4 shadow-sm">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View style={{ backgroundColor: zone.color }} className="w-3 h-3 rounded-full mr-3" />
                  <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base">{zone.title}</Text>
                </View>
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-[10px] font-bold text-gray-600">{zone.count} Régions</Text>
                </View>
              </View>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs leading-5">
                Régions : {zone.regions}
              </Text>
            </View>
          ))}
        </View>

        {/* Nos Partenaires */}
        {ptfList && ptfList.length > 0 && (
          <View className="mt-12 px-6">
            <View className="flex-row justify-between items-center mb-8">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Nos Partenaires</Text>
              <TouchableOpacity onPress={() => router.push('/annuaire-partenaires')}>
                <Text className="text-brand-orange font-bold text-xs uppercase">Voir tout</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
              {ptfList.slice(0, 6).map((ptf: PTF) => (
                <View key={ptf.id} className="bg-white border border-gray-100 p-5 rounded-[32px] w-40 mx-2 items-center shadow-sm">
                  <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mb-4">
                    {ptf.thumbnail_url ? (
                      <Image source={{ uri: ptf.thumbnail_url }} className="w-10 h-10" resizeMode="contain" />
                    ) : (
                      <Building2 size={28} color="#E05017" />
                    )}
                  </View>
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 10 }} className="text-gray-900 text-center mb-1" numberOfLines={2}>
                    {ptf.name}
                  </Text>
                  {ptf.pays && (
                    <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 8 }} className="text-gray-400 text-center">{ptf.pays}</Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

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