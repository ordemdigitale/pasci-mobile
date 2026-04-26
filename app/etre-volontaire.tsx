import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Users, Mail, Phone } from 'lucide-react-native';

const logo = require('../assets/logo.png');

export default function EtreVolontaireScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: '',
  });

  const interests = [
    'Formation et renforcement',
    'Appui-conseil',
    'Gestion de projets',
    'Communication',
    'Autre',
  ];

  const handleSubmit = () => {
    if (formData.firstName && formData.lastName && formData.email) {
      router.push('/contact');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color="#E05017" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg flex-1">
          Être Volontaire
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Hero Section */}
        <View className="px-6 pt-6 pb-4">
          <View className="bg-brand-orange/10 w-14 h-14 rounded-full items-center justify-center mb-4">
            <Users size={28} color="#E05017" />
          </View>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-2xl text-gray-900 mb-2">
            Rejoignez Notre Équipe
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm">
            Participez à nos initiatives et contribuez au renforcement de la société civile
          </Text>
        </View>

        {/* Why Volunteer Section */}
        <View className="px-6 py-4">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-3">
            Pourquoi se porter volontaire?
          </Text>
          <View className="space-y-3">
            {[
              'Développer vos compétences professionnelles',
              'Créer du réseau dans le secteur de l\'OSC',
              'Contribuer à un impact social positif',
              'Flexible et adapté à votre disponibilité',
            ].map((reason, idx) => (
              <View key={idx} className="flex-row items-start">
                <View className="w-5 h-5 bg-brand-orange rounded-full items-center justify-center mr-3 mt-0.5">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm flex-1">
                  {reason}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Form Section */}
        <View className="px-6 py-4">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-3">
            Informations Personnelles
          </Text>

          {/* First Name */}
          <TextInput
            placeholder="Prénom"
            placeholderTextColor="#D1D5DB"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-3 text-gray-900 mb-3"
            style={{ fontFamily: 'Karla_400Regular' }}
          />

          {/* Last Name */}
          <TextInput
            placeholder="Nom"
            placeholderTextColor="#D1D5DB"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-3 text-gray-900 mb-3"
            style={{ fontFamily: 'Karla_400Regular' }}
          />

          {/* Email */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#D1D5DB"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-3 text-gray-900 mb-3"
            style={{ fontFamily: 'Karla_400Regular' }}
          />

          {/* Phone */}
          <TextInput
            placeholder="Téléphone (optionnel)"
            placeholderTextColor="#D1D5DB"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-3 text-gray-900 mb-3"
            style={{ fontFamily: 'Karla_400Regular' }}
          />
        </View>

        {/* Interest Section */}
        <View className="px-6 py-4">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-3">
            Domaines d'intérêt
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {interests.map((interest) => (
              <TouchableOpacity
                key={interest}
                onPress={() => setFormData({ ...formData, interest })}
                className={`px-4 py-2 rounded-full border ${
                  formData.interest === interest
                    ? 'bg-brand-orange border-brand-orange'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text
                  style={{ fontFamily: 'Karla_700Bold' }}
                  className={`text-xs ${formData.interest === interest ? 'text-white' : 'text-gray-600'}`}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <View className="px-6 pb-6">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!formData.firstName || !formData.lastName || !formData.email}
            className={`py-4 rounded-[24px] flex-row items-center justify-center ${
              formData.firstName && formData.lastName && formData.email
                ? 'bg-brand-orange'
                : 'bg-gray-300'
            }`}
          >
            <Mail size={20} color="white" />
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-base ml-2">
              Envoyer ma candidature
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View className="px-6 pb-6">
          <View className="bg-blue-50 rounded-[16px] p-4 border border-blue-100">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs">
              Nous examinerons votre demande et vous contacterons sous peu pour discuter des opportunités de bénévolat disponibles.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
