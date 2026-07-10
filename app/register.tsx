import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, ChevronLeft, ArrowRight, Eye, EyeOff } from 'lucide-react-native';
import { authService } from '../services/authService';

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Mot de passe trop court', 'Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      // Connexion automatique après inscription
      await authService.login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erreur d\'inscription', error.message || 'Une erreur est survenue. Vérifiez vos informations.');
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

          {/* Header */}
          <View className="px-6 py-4">
            <TouchableOpacity onPress={() => router.back()} className="bg-orange-50 p-2 rounded-full self-start">
              <ChevronLeft size={24} color="#E05017" />
            </TouchableOpacity>
          </View>

          {/* Titre */}
          <View className="px-8 mt-4 mb-8">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-3xl text-gray-900 leading-tight">
              Créer votre{"\n"}compte
            </Text>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm mt-2">
              Rejoignez le réseau PdoC pour bénéficier d'un accompagnement sur mesure.
            </Text>
          </View>

          <View className="px-8 gap-y-5">

            {/* Prénom */}
            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xs text-gray-400 uppercase tracking-widest mb-2 ml-1">Prénom *</Text>
              <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100">
                <User size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Votre prénom"
                  className="flex-1 ml-3 text-gray-700 font-bold"
                  placeholderTextColor="#9CA3AF"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
            </View>

            {/* Nom */}
            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xs text-gray-400 uppercase tracking-widest mb-2 ml-1">Nom *</Text>
              <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100">
                <User size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Votre nom de famille"
                  className="flex-1 ml-3 text-gray-700 font-bold"
                  placeholderTextColor="#9CA3AF"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xs text-gray-400 uppercase tracking-widest mb-2 ml-1">Email professionnel *</Text>
              <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100">
                <Mail size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="contact@organisation.ci"
                  className="flex-1 ml-3 text-gray-700 font-bold"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Mot de passe */}
            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xs text-gray-400 uppercase tracking-widest mb-2 ml-1">Mot de passe *</Text>
              <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100">
                <Lock size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="8 caractères minimum"
                  className="flex-1 ml-3 text-gray-700 font-bold"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirmation mot de passe */}
            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-xs text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirmer le mot de passe *</Text>
              <View className={`bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border ${confirmPassword && confirmPassword !== password ? 'border-red-200' : 'border-gray-100'}`}>
                <Lock size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Répétez votre mot de passe"
                  className="flex-1 ml-3 text-gray-700 font-bold"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                </TouchableOpacity>
              </View>
              {confirmPassword && confirmPassword !== password && (
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-red-400 text-[10px] mt-1 ml-1">
                  Les mots de passe ne correspondent pas
                </Text>
              )}
            </View>

            {/* CGU */}
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] text-center px-4 leading-4 mt-2">
              En créant un compte, vous acceptez nos{' '}
              <Text className="text-brand-orange font-bold">Conditions Générales</Text>{' '}
              et notre{' '}
              <Text className="text-brand-orange font-bold">Politique de Confidentialité</Text>.
            </Text>

            {/* Bouton inscription */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className={`bg-brand-orange flex-row items-center justify-center p-5 rounded-3xl shadow-xl shadow-orange-200 mt-4 ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-lg mr-2">Créer mon compte</Text>
                  <ArrowRight size={20} color="white" />
                </>
              )}
            </TouchableOpacity>

            {/* Lien connexion */}
            <View className="flex-row justify-center items-center mt-4">
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400">Déjà inscrit ?</Text>
              <TouchableOpacity onPress={() => router.push('/login')} className="ml-2">
                <Text className="text-brand-orange font-bold">Se connecter</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
    </SafeAreaView>
  );
}
