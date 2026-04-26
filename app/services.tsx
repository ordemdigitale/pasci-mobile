import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, CheckCircle, ChevronDown } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/dataService';

const logo = require('../assets/logo.png');

const SERVICES = [
  {
    id: 1,
    title: 'Appui-Conseil',
    description: 'Des conseils stratégiques pour des décisions éclairées et une croissance durable.'
  },
  {
    id: 2,
    title: 'Accompagnement',
    description: 'Un soutien personnalisé à chaque étape de la mise en œuvre de vos projets.'
  },
  {
    id: 3,
    title: 'Soutien Administratif',
    description: 'Formalisation et mise en conformité pour une structure solide et transparente.'
  },
  {
    id: 4,
    title: 'Rédaction',
    description: 'Rédaction de documents professionnels : statuts, règlements, projets, manuels.'
  },
  {
    id: 5,
    title: 'Formation',
    description: 'Un processus d\'apprentissage structuré qui permet à un individu ou à un groupe d\'acquérir des connaissances.'
  },
  {
    id: 6,
    title: 'Suivi-évaluation',
    description: 'Mise en place d\'outils et d\'indicateurs de performance pour mesurer l\'avancement et l\'impact des actions menées.'
  },
  {
    id: 7,
    title: 'Information',
    description: 'Nous vous donnons des informations sur les opportunités de financements, de formation et de réseautage.'
  },
];

const FAQ_ITEMS = [
  { id: 1, title: "Comment puis-je postuler à une offre d'emploi ?", answer: "Pour postuler à une offre d'emploi, veuillez consulter les offres disponibles sur notre site et cliquez sur le bouton Postuler." },
  { id: 2, title: "Quel est le processus de recrutement chez PDOC ?", answer: "Le processus de recrutement chez PDOC comprend plusieurs étapes : l'analyse de votre profil, un entretien technique, un entretien RH et enfin une proposition d'embauche." },
  { id: 3, title: "Puis-je envoyer une candidature spontanée ?", answer: "Oui, vous pouvez envoyer une candidature spontanée à travers notre formulaire en ligne ou par email à pdoc@plateforme-osci.org." },
  { id: 4, title: "Proposez-vous des stages ou des alternances ?", answer: "Oui, PDOC propose des stages et des alternances dans divers domaines techniques et administratifs. Consultez nos offres spécifiques pour plus d'informations." },
  { id: 5, title: "Comment savoir si ma candidature a été reçue ?", answer: "Vous recevrez un email de confirmation dès que votre candidature aura été reçue. Si vous ne recevez pas cet email dans les 24 heures suivantes, veuillez nous contacter." },
  { id: 6, title: "Quelles sont les valeurs du projet PDOC ?", answer: "Les valeurs du projet PDOC incluent l'innovation technologique, la collaboration interdisciplinaire et le respect de l'environnement." },
];

export default function ServicesScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number[]>([]);

  const toggleFaq = (id: number) => {
    setExpandedFaq(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const displayServices = SERVICES;

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
            <View key={service.id} className="bg-gray-50 rounded-[24px] p-5 mb-3 border border-gray-100">
              <View className="flex-row items-start mb-2">
                <View className="bg-brand-orange/10 w-9 h-9 rounded-full items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <CheckCircle size={18} color="#E05017" />
                </View>
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm flex-1">
                  {service.title}
                </Text>
              </View>

              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs leading-4 ml-12">
                {service.description}
              </Text>
            </View>
          ))}
        </View>

        {/* FAQ Section */}
        <View className="px-6 pb-6">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-xl text-gray-900 mb-4">
            Questions Fréquentes
          </Text>

          {FAQ_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleFaq(item.id)}
              className="bg-white border border-gray-200 rounded-[20px] mb-3 overflow-hidden"
            >
              <View className="px-5 py-4 flex-row items-center justify-between">
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm flex-1">
                  {item.title}
                </Text>
                <ChevronDown
                  size={20}
                  color="#9CA3AF"
                  style={{ transform: [{ rotate: expandedFaq.includes(item.id) ? '180deg' : '0deg' }] }}
                />
              </View>

              {expandedFaq.includes(item.id) && (
                <View className="px-5 pb-4 border-t border-gray-100">
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs leading-5">
                    {item.answer}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA Section */}
        <View className="px-6 pb-8">
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
