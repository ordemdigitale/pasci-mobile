import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

// Service Icons
const iconAppui = require('../assets/icons/icon-appui-conseil.png');
const iconAccompagnement = require('../assets/icons/icon-accompagnement.png');
const iconAdmin = require('../assets/icons/icon-soutien-administratif.png');
const iconRedaction = require('../assets/icons/icon-redaction.png');
const iconFormation = require('../assets/icons/icon-formation.png');
const iconSuivi = require('../assets/icons/icon-suivi-evaluation.png');

const SERVICES_DATA = [
  {
    id: '1',
    title: 'Appui-Conseil',
    description: 'Des conseils stratégiques pour des décisions éclairées et une croissance durable.',
    longDescription: "Dans le cadre des appuis et conseils, le CERAP organisé une tournée d'explication sur processus de soumission et les conditions d'éligibilité aux microfinancements et aux subventions. À cette occasion, les équipes ont mis l’accent sur les erreurs à éviter.",
    icon: iconAppui,
    color: '#E0EEFF',
  },
  {
    id: '2',
    title: 'Accompagnement',
    description: 'Un soutien personnalisé à chaque étape de la mise en œuvre de vos projets.',
    longDescription: "L'accompagnement de PASCI va au-delà du simple conseil. Nous marchons à vos côtés pour la mise en œuvre concrète de vos plans d'action. Cet accompagnement peut prendre la forme de coaching d'équipes, de renforcement des capacités, de mentorat pour les leaders ou de gestion déléguée de certaines fonctions clés. Notre objectif est de transférer des compétences et de garantir l'autonomie de vos structures à long terme.",
    icon: iconAccompagnement,
    color: '#E0FBEA',
  },
  {
    id: '3',
    title: 'Soutien Administratif',
    description: 'Formalisation et mise en conformité pour une structure solide et transparente.',
    longDescription: 'Nous vous assistons dans la formalisation de vos statuts, la rédaction de vos règlements intérieurs et la mise en conformité avec les exigences légales et réglementaires. Notre objectif est de structurer votre organisation pour qu\'elle opère en toute légalité et efficacité, en minimisant les risques.',
    icon: iconAdmin,
    color: '#FFF4E0',
  },
  {
    id: '4',
    title: 'Rédaction',
    description: 'Rédaction de documents professionnels : statuts, règlements, projets, manuels.',
    longDescription: 'Qu’il s’agisse de rapports, de notes de synthèse ou de propositions de projets, notre équipe rédige des documents professionnels qui captent l’attention de vos partenaires.',
    icon: iconRedaction,
    color: '#FFF0F0',
  },
  {
    id: '5',
    title: 'Formation',
    description: "Un processus d'apprentissage structuré qui permet à un individu ou à un groupe d'acquérir des connaissances.",
    longDescription: "En s'appuyant sur une démarche structurée, ce type d'apprentissage permet non seulement de transmettre des connaissances, mais aussi de développer l'esprit critique, l'autonomie et la capacité à appliquer les acquis dans des contextes réels. Il favorise également l'apprentissage collectif, en encourageant le partage d'expériences et la collaboration entre les participants.",
    icon: iconFormation,
    color: '#F3E8FF',
  },
  {
    id: '6',
    title: 'Suivi-Évaluation',
    description: "Mise en place d'outils et d'indicateurs de performance pour mesurer l’avancement et l’impact des actions menées.",
    longDescription: "Au-delà de la mesure, le suivi-évaluation constitue un véritable outil d'aide à la décision. Il permet d'ajuster les stratégies en temps réel, d'optimiser l'utilisation des ressources et de renforcer l'impact des interventions. En assurant une traçabilité des résultats et une évaluation rigoureuse des effets produits, ce service contribue à la transparence, à la redevabilité et à l'amélioration continue des actions menées.",
    icon: iconSuivi,
    color: '#E0F7F7',
  },
];

export default function ServicesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredServices = SERVICES_DATA.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderServiceItem = ({ item }) => (
    <View 
      className="bg-white rounded-[32px] p-6 mb-6 border border-gray-100 shadow-sm shadow-gray-200 elevation-2"
    >
      <View className="flex-row items-center mb-4">
        <View style={{ backgroundColor: item.color }} className="w-16 h-16 rounded-[20px] items-center justify-center mr-4">
          <Image source={item.icon} style={{ width: 32, height: 32 }} resizeMode="contain" />
        </View>
        <View className="flex-1">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg leading-6">
            {item.title}
          </Text>
        </View>
      </View>
      
      <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-[13px] mb-3 leading-5">
        {item.description}
      </Text>
      
      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm leading-6">
        {item.longDescription}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* Search bar */}
      <View className="bg-gray-100 flex-row items-center px-4 py-3 rounded-2xl mb-8">
        <Search size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Rechercher un service..."
          className="flex-1 ml-3 font-bold text-gray-700"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Titles */}
      <View className="mb-8">
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-[10px] uppercase tracking-[2px] mb-2">
          NOS EXPERTISES
        </Text>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-3xl leading-9">
          Des Services Stratégiques
        </Text>
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm mt-2">
          Au CRASC, nous vous offrons un accompagnement sur mesure pour garantir la conformité et l'efficacité de vos initiatives.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Custom Bar Header */}
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} color="#E05017" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900 flex-1 text-center pr-8">Catalogue des Services</Text>
      </View>

      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
      />
    </SafeAreaView>
  );
}
