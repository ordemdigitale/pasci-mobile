import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Image, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail, CheckCircle } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Champ requis', 'Veuillez entrer votre adresse email.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Email invalide', 'Veuillez entrer une adresse email valide.');
      return;
    }

    setLoading(true);
    try {
      // TODO: remplacer par l'endpoint API quand disponible
      // await apiClient.post('/auth/forgot-password', { email });
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
            <CheckCircle size={40} color="#16A34A" />
          </View>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl text-center mb-3">
            Email envoyé !
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm text-center leading-6 mb-4">
            Nous avons envoyé un lien de réinitialisation à{' '}
            <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-800">{email}</Text>.{' '}
            Vérifiez votre boîte de réception.
          </Text>

          <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 w-full mb-8">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-blue-800 text-xs text-center">
              Le lien expirera dans 24 heures. Si vous ne recevez pas l'email, vérifiez votre dossier spam.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setSubmitted(false)}
            className="w-full bg-brand-orange py-4 rounded-3xl items-center mb-4"
          >
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-base">Renvoyer l'email</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-sm">
              ← Retour à la connexion
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="px-6 py-4">
          <TouchableOpacity onPress={() => router.back()} className="bg-orange-50 p-2 rounded-full self-start">
            <ChevronLeft size={24} color="#E05017" />
          </TouchableOpacity>
        </View>

        {/* Logo & Titre */}
        <View className="px-8 mt-4 mb-10">
          <Image
            source={require('../assets/logo.png')}
            style={{ width: 60, height: 64, marginBottom: 24 }}
            resizeMode="contain"
          />
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-3xl text-gray-900 leading-tight">
            Mot de passe{"\n"}oublié ?
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm mt-2 leading-5">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </Text>
        </View>

        {/* Formulaire */}
        <View className="px-8 gap-y-6">

          {/* Champ Email */}
          <View>
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xs text-gray-400 uppercase tracking-widest mb-3 ml-1">
              Adresse Email
            </Text>
            <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100">
              <Mail size={20} color="#9CA3AF" />
              <TextInput
                placeholder="nom@organisation.ci"
                className="flex-1 ml-3 text-gray-700 font-bold"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Bouton */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`bg-brand-orange flex-row items-center justify-center p-5 rounded-3xl shadow-xl shadow-orange-200 mt-4 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-base">
                Envoyer le lien
              </Text>
            )}
          </TouchableOpacity>

          {/* Retour login */}
          <TouchableOpacity onPress={() => router.push('/login')} className="items-center mt-2">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm">
              Vous vous souvenez ?{' '}
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange">
                Se connecter
              </Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
