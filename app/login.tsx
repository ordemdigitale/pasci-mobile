import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, ChevronLeft, ArrowRight } from 'lucide-react-native';
import { authService } from '../services/authService';

/**
 * Login Screen
 * Page d'authentification inspirée du design système Pasci
 */
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erreur de connexion', 'Identifiants invalides ou problème réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView 
      className="flex-1 bg-white" 
      edges={['top']}
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
          
          {/* Header avec Retour */}
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
              Content de vous{"\n"}revoir !
            </Text>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm mt-2">
              Connectez-vous pour accéder à votre espace collaborateur et vos formations.
            </Text>
          </View>

          {/* Formulaire (Vues uniquement pour l'instant) */}
          <View className="px-8 gap-y-6">
            
            {/* Champ Email */}
            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xs text-gray-400 uppercase tracking-widest mb-3 ml-1">Adresse Email</Text>
              <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100">
                <Mail size={20} color="#9CA3AF" />
                <TextInput 
                  placeholder="nom@organisation.ci"
                  className="flex-1 ml-3 text-gray-700 font-bold"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Champ Mot de passe */}
            <View>
                <View className="flex-row justify-between items-center mb-3 ml-1">
                    <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xs text-gray-400 uppercase tracking-widest">Mot de passe</Text>
                    <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                        <Text className="text-brand-orange text-[10px] font-bold">Oublié ?</Text>
                    </TouchableOpacity>
                </View>
              <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100">
                <Lock size={20} color="#9CA3AF" />
                <TextInput 
                  placeholder="••••••••"
                  className="flex-1 ml-3 text-gray-700 font-bold"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Eye size={20} color={showPassword ? "#E05017" : "#9CA3AF"} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bouton Connexion */}
            <TouchableOpacity 
              onPress={handleLogin}
              disabled={loading}
              className={`bg-brand-orange flex-row items-center justify-center p-5 rounded-3xl shadow-xl shadow-orange-200 mt-4 ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-lg mr-2">Se connecter</Text>
                  <ArrowRight size={20} color="white" />
                </>
              )}
            </TouchableOpacity>

            {/* Séparateur */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-[1px] bg-gray-100" />
              <Text className="mx-4 text-gray-300 text-xs font-bold">OU</Text>
              <View className="flex-1 h-[1px] bg-gray-100" />
            </View>

            {/* Inscription */}
            <View className="flex-row justify-center items-center">
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400">Pas encore de compte ?</Text>
                <TouchableOpacity onPress={() => router.push('/register')} className="ml-2">
                    <Text className="text-brand-orange font-bold">Créer un profil</Text>
                </TouchableOpacity>
            </View>

          </View>

        </ScrollView>
    </SafeAreaView>
  );
}
