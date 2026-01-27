import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, Building2, ChevronLeft, ArrowRight, Phone } from 'lucide-react-native';

/**
 * Register Screen
 * Page d'inscription pour les nouvelles OSC / Collaborateurs
 */
export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView 
      className="flex-1 bg-white" 
      edges={['top']}
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
          
          {/* Header avec Retour */}
          <View className="px-6 py-4">
            <TouchableOpacity onPress={() => router.back()} className="bg-orange-50 p-2 rounded-full self-start">
              <ChevronLeft size={24} color="#E05017" />
            </TouchableOpacity>
          </View>

          {/* Logo & Titre */}
          <View className="px-8 mt-4 mb-8">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-3xl text-gray-900 leading-tight">
              Créer votre{"\n"}compte
            </Text>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm mt-2">
              Rejoignez le réseau Pasci pour bénéficier d'un accompagnement sur mesure.
            </Text>
          </View>

          {/* Formulaire d'inscription */}
          <View className="px-8 gap-y-5">
            
            {/* Nom Complet */}
            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xs text-gray-400 uppercase tracking-widest mb-2 ml-1">Nom Complet</Text>
              <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100">
                <User size={20} color="#9CA3AF" />
                <TextInput 
                  placeholder="Jean Dupont"
                  className="flex-1 ml-3 text-gray-700 font-bold"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Organisation */}
            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xs text-gray-400 uppercase tracking-widest mb-2 ml-1">Organisation / OSC</Text>
              <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100">
                <Building2 size={20} color="#9CA3AF" />
                <TextInput 
                  placeholder="Nom de votre structure"
                  className="flex-1 ml-3 text-gray-700 font-bold"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Téléphone */}
            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xs text-gray-400 uppercase tracking-widest mb-2 ml-1">Téléphone</Text>
              <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100">
                <Phone size={20} color="#9CA3AF" />
                <TextInput 
                  placeholder="+225 00 00 00 00 00"
                  className="flex-1 ml-3 text-gray-700 font-bold"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xs text-gray-400 uppercase tracking-widest mb-2 ml-1">Email professionnel</Text>
              <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100">
                <Mail size={20} color="#9CA3AF" />
                <TextInput 
                  placeholder="contact@ong-exemple.ci"
                  className="flex-1 ml-3 text-gray-700 font-bold"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Mot de passe */}
            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xs text-gray-400 uppercase tracking-widest mb-2 ml-1">Mot de passe</Text>
              <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100">
                <Lock size={20} color="#9CA3AF" />
                <TextInput 
                  placeholder="••••••••"
                  className="flex-1 ml-3 text-gray-700 font-bold"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
              </View>
            </View>

            {/* Conditions d'utilisation */}
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] text-center px-4 leading-4 mt-2">
              En créant un compte, vous acceptez nos <Text className="text-brand-orange font-bold">Conditions Générales</Text> et notre <Text className="text-brand-orange font-bold">Politique de Confidentialité</Text>.
            </Text>

            {/* Bouton Inscription */}
            <TouchableOpacity 
              onPress={() => router.replace('/(tabs)')}
              className="bg-brand-orange flex-row items-center justify-center p-5 rounded-3xl shadow-xl shadow-orange-200 mt-4"
            >
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-lg mr-2">Créer mon compte</Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>

            {/* Lien Connexion */}
            <View className="flex-row justify-center items-center mt-4">
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400">Déjà inscrit ?</Text>
                <TouchableOpacity onPress={() => router.push('/login')} className="ml-2">
                    <Text className="text-brand-orange font-bold">Se connecter</Text>
                </TouchableOpacity>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
