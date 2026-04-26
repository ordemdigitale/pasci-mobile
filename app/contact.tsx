import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Phone, Mail, Facebook, Linkedin } from 'lucide-react-native';

export default function ContactScreen() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    fonction: '',
    sexe: '',
    tranche_age: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires (marqués *).');
      return;
    }

    setLoading(true);
    // TODO: remplacer par un vrai endpoint API quand disponible
    setTimeout(() => {
      setLoading(false);
      setForm({ name: '', email: '', fonction: '', sexe: '', tranche_age: '', message: '' });
      Alert.alert('Message envoyé !', 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.');
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins_700Bold' }}>
          Contactez-nous
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero banner */}
        <View className="bg-brand-orange px-6 py-8">
          <Text className="text-white text-xl font-bold mb-1" style={{ fontFamily: 'Poppins_700Bold' }}>
            Nous contacter
          </Text>
          <Text className="text-orange-100 text-sm" style={{ fontFamily: 'Karla_400Regular' }}>
            Remplissez le formulaire et nous vous répondrons dans les plus brefs délais
          </Text>
        </View>

        <View className="px-6 pt-6">
          {/* Contact Form */}
          <View className="border border-gray-200 rounded-2xl p-6 mb-8">
            <Text className="text-gray-900 font-bold text-base mb-6" style={{ fontFamily: 'Poppins_700Bold' }}>
              Envoyez-nous un message
            </Text>

            {/* Name */}
            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Votre nom *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="Entrer votre nom"
                placeholderTextColor="#d1d5db"
                value={form.name}
                onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Email *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="Entrer votre adresse e-mail"
                placeholderTextColor="#d1d5db"
                value={form.email}
                onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Fonction */}
            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Fonction
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="Votre fonction"
                placeholderTextColor="#d1d5db"
                value={form.fonction}
                onChangeText={(v) => setForm((p) => ({ ...p, fonction: v }))}
              />
            </View>

            {/* Sexe et Tranche d'âge */}
            <View className="flex-row gap-4 mb-5">
              <View className="flex-1">
                <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                  Sexe
                </Text>
                <View className="border border-gray-300 rounded-lg overflow-hidden">
                  <View className="bg-white">
                    <TouchableOpacity
                      className="px-4 py-3"
                      onPress={() => {}}
                    >
                      <Text
                        style={{ fontFamily: 'Karla_400Regular' }}
                        className={form.sexe ? 'text-gray-900' : 'text-gray-400'}
                      >
                        {form.sexe || '-- Sélectionner --'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="bg-white border border-gray-300 rounded-lg mt-1">
                  {['Homme', 'Femme', 'Autre'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setForm((p) => ({ ...p, sexe: option }))}
                      className="px-4 py-2 border-b border-gray-100"
                    >
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-700">
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                  Tranche d'âge
                </Text>
                <View className="border border-gray-300 rounded-lg overflow-hidden">
                  <View className="bg-white">
                    <TouchableOpacity
                      className="px-4 py-3"
                      onPress={() => {}}
                    >
                      <Text
                        style={{ fontFamily: 'Karla_400Regular' }}
                        className={form.tranche_age ? 'text-gray-900' : 'text-gray-400'}
                      >
                        {form.tranche_age || '-- Sélectionner --'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="bg-white border border-gray-300 rounded-lg mt-1">
                  {['-18 ans', '18 à 35 ans', '+35 ans'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setForm((p) => ({ ...p, tranche_age: option }))}
                      className="px-4 py-2 border-b border-gray-100"
                    >
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-700">
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Message */}
            <View className="mb-6">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Message *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular', textAlignVertical: 'top' }}
                placeholder="Écrire votre message ici"
                placeholderTextColor="#d1d5db"
                value={form.message}
                onChangeText={(v) => setForm((p) => ({ ...p, message: v }))}
                multiline
                numberOfLines={6}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className="bg-brand-orange py-4 rounded-lg items-center"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white font-bold text-base">
                  Envoyer le message
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Contact Info Section */}
          <View className="border border-gray-200 rounded-2xl p-6 mb-8">
            <Text className="text-gray-900 font-bold text-base mb-6" style={{ fontFamily: 'Poppins_700Bold' }}>
              Nos coordonnées
            </Text>

            {/* Address */}
            <View className="flex-row items-start mb-6">
              <MapPin size={20} color="#E05017" style={{ marginRight: 12, marginTop: 2 }} />
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-sm mb-1" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                  Adresse du bureau
                </Text>
                <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Karla_400Regular' }}>
                  15, avenue Jean-Mermoz, Cocody Abidjan, Côte d'Ivoire
                </Text>
              </View>
            </View>

            {/* Phone */}
            <View className="flex-row items-start mb-6">
              <Phone size={20} color="#E05017" style={{ marginRight: 12, marginTop: 2 }} />
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-sm mb-1" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                  Numéro de téléphone
                </Text>
                <TouchableOpacity onPress={() => Linking.openURL('tel:+22505055657 41')}>
                  <Text className="text-brand-orange font-bold text-sm" style={{ fontFamily: 'Karla_400Regular' }}>
                    05 05 56 57 41
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Email */}
            <View className="flex-row items-start mb-6">
              <Mail size={20} color="#E05017" style={{ marginRight: 12, marginTop: 2 }} />
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-sm mb-1" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                  Contact par e-mail
                </Text>
                <TouchableOpacity onPress={() => Linking.openURL('mailto:pdoc@plateforme-osci.org')}>
                  <Text className="text-brand-orange font-bold text-sm" style={{ fontFamily: 'Karla_400Regular' }}>
                    pdoc@plateforme-osci.org
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Social Media */}
            <View>
              <Text className="text-gray-900 font-bold text-sm mb-3" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Nous suivre
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
                  <Facebook size={20} color="#E05017" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
                  <Linkedin size={20} color="#E05017" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Note */}
          <Text className="text-gray-400 text-xs text-center px-4" style={{ fontFamily: 'Karla_400Regular' }}>
            * Champs obligatoires
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
