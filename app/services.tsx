import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, CheckCircle, ChevronDown, Phone } from 'lucide-react-native';
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
  { id: 1, question: "Comment mon OSC peut-elle adhérer à la PdoC ?", answer: "Remplissez le formulaire « Rejoindre » en indiquant votre CRASC, votre région et votre domaine prioritaire. Votre demande est examinée par l'équipe PdoC ; dès sa validation, votre OSC apparaît dans l'annuaire et dans son pôle de concertation." },
  { id: 2, question: "Comment recevoir mes identifiants de connexion ?", answer: "À la validation de votre adhésion, un email contenant votre identifiant (votre adresse email) et votre mot de passe est envoyé à l'adresse indiquée dans le formulaire. Pensez à vérifier vos courriers indésirables." },
  { id: 3, question: "Comment mettre à jour les informations de mon OSC ?", answer: "Connectez-vous, ouvrez l'espace de votre OSC puis « Modifier ». Les modifications sont vérifiées par un administrateur avant d'être publiées." },
  { id: 4, question: "Qu'est-ce qu'un pôle de concertation ?", answer: "C'est un espace d'échange entre OSC d'un même domaine (santé, éducation, agriculture…). Votre OSC est inscrite dans le pôle de son premier domaine prioritaire ; elle peut y lancer des discussions et participer aux sondages." },
  { id: 5, question: "Comment répondre à une offre d'emploi ou de projet ?", answer: "Consultez l'espace collaboratif : chaque offre précise sa date limite et renvoie, via « Plus d'informations », vers les modalités de candidature de l'organisme qui la publie." },
  { id: 6, question: "J'ai oublié mon mot de passe, que faire ?", answer: "Cliquez sur « Mot de passe oublié » sur la page de connexion : un lien de réinitialisation, valable une heure, vous est envoyé par email. Pour toute autre question : pdoc@plateforme-osci.org." },
];

export default function ServicesScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number[]>([]);
  const { data: apiFaq, isError: faqError } = useQuery({
    queryKey: ['faq'],
    queryFn: dataService.getFaq,
  });

  const toggleFaq = (id: number) => {
    setExpandedFaq(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const displayServices = SERVICES;
  const displayFaq = faqError ? FAQ_ITEMS : (apiFaq ?? FAQ_ITEMS);

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
            Services Stratégiques PdoC
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm">
            Des accompagnements adaptés à vos besoins pour renforcer votre organisation
          </Text>
        </View>

        {/* Quick Access */}
        <View className="px-6 pb-2">
          <TouchableOpacity
            onPress={() => router.push('/numeros-utiles')}
            className="bg-[#052838] rounded-[24px] p-5 flex-row items-center"
          >
            <View className="bg-white/10 w-12 h-12 rounded-full items-center justify-center mr-4">
              <Phone size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-sm mb-1">
                Numéros utiles
              </Text>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-white/75 text-xs">
                Accédez rapidement aux numéros d’urgence et services essentiels.
              </Text>
            </View>
          </TouchableOpacity>
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

          {displayFaq.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleFaq(item.id)}
              className="bg-white border border-gray-200 rounded-[20px] mb-3 overflow-hidden"
            >
              <View className="px-5 py-4 flex-row items-center justify-between">
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm flex-1">
                  {item.question}
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
