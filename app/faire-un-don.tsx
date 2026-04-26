import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Heart, Wallet } from 'lucide-react-native';

const logo = require('../assets/logo.png');

export default function FaireUnDonScreen() {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const donationAmounts = [5000, 10000, 25000, 50000, 100000];

  const handleDonate = (amount: number) => {
    router.push({
      pathname: '/paiement-simulation',
      params: { amount: amount.toString(), type: 'don' }
    });
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
          Faire un Don
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Hero Section */}
        <View className="px-6 pt-6 pb-4">
          <View className="bg-brand-orange/10 w-14 h-14 rounded-full items-center justify-center mb-4">
            <Heart size={28} color="#E05017" />
          </View>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-2xl text-gray-900 mb-2">
            Soutenir PDOC
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm">
            Votre contribution aide à renforcer les organisations de la société civile en Côte d'Ivoire
          </Text>
        </View>

        {/* Impact Section */}
        <View className="px-6 py-4">
          <View className="bg-green-50 rounded-[24px] p-4 border border-green-100">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-3">
              Votre impact:
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-center mb-2">
                <View className="w-2 h-2 rounded-full bg-green-600 mr-3" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs">
                  Formations et renforcement de capacités
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View className="w-2 h-2 rounded-full bg-green-600 mr-3" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs">
                  Appui-conseil et accompagnement
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-green-600 mr-3" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs">
                  Développement des ressources documentaires
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Donation Amounts */}
        <View className="px-6 py-4">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-3">
            Montant du don (FCFA)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {donationAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => setSelectedAmount(amount)}
                className={`flex-1 min-w-[100px] py-3 rounded-[16px] items-center border-2 ${
                  selectedAmount === amount
                    ? 'bg-brand-orange border-brand-orange'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                  className={`text-sm ${selectedAmount === amount ? 'text-white' : 'text-gray-900'}`}
                >
                  {amount.toLocaleString('fr-FR')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Amount */}
        <View className="px-6 py-4">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-2">
            Ou un montant personnalisé
          </Text>
          <TextInput
            placeholder="Ex: 15000"
            placeholderTextColor="#D1D5DB"
            keyboardType="numeric"
            value={customAmount}
            onChangeText={setCustomAmount}
            className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-3 text-gray-900"
            style={{ fontFamily: 'Karla_400Regular' }}
          />
        </View>

        {/* Donate Button */}
        <View className="px-6 pb-6">
          <TouchableOpacity
            onPress={() => {
              const amount = customAmount ? parseInt(customAmount) : selectedAmount;
              if (amount && amount > 0) {
                handleDonate(amount);
              }
            }}
            disabled={!selectedAmount && !customAmount}
            className={`py-4 rounded-[24px] flex-row items-center justify-center ${
              selectedAmount || customAmount ? 'bg-brand-orange' : 'bg-gray-300'
            }`}
          >
            <Wallet size={20} color="white" />
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-base ml-2">
              Faire un don
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
