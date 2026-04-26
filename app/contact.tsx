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
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    // TODO: remplacer par un vrai endpoint API quand disponible
    setTimeout(() => {
      setLoading(false);
      setForm({ name: '', email: '', message: '' });
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
        <View className="bg-[#E05017] px-6 py-8">
          <Text className="text-white text-xl font-bold mb-1" style={{ fontFamily: 'Poppins_700Bold' }}>
            Contactez-nous
          </Text>
          <Text className="text-orange-100 text-sm" style={{ fontFamily: 'Karla_400Regular' }}>
            Nous sommes à votre écoute
          </Text>
        </View>

        <View className="px-4 pt-6 space-y-6">
          {/* Contact Form */}
          <View className="border border-gray-200 rounded-xl p-4 space-y-4">
            <Text className="text-gray-900 font-bold text-base mb-2" style={{ fontFamily: 'Poppins_600SemiBold' }}>
              Envoyez-nous un message
            </Text>

            {/* Name */}
            <View>
              <Text className="text-gray-700 text-sm mb-1" style={{ fontFamily: 'Karla_400Regular' }}>
                Nom complet
              </Text>
              <TextInput
                className="border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="Votre nom complet"
                placeholderTextColor="#9ca3af"
                value={form.name}
                onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View>
              <Text className="text-gray-700 text-sm mb-1" style={{ fontFamily: 'Karla_400Regular' }}>
                Adresse e-mail
              </Text>
              <TextInput
                className="border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="votre@email.com"
                placeholderTextColor="#9ca3af"
                value={form.email}
                onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Message */}
            <View>
              <Text className="text-gray-700 text-sm mb-1" style={{ fontFamily: 'Karla_400Regular' }}>
                Message
              </Text>
              <TextInput
                className="border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-gray-50"
                style={{ fontFamily: 'Karla_400Regular', textAlignVertical: 'top' }}
                placeholder="Votre message..."
                placeholderTextColor="#9ca3af"
                value={form.message}
                onChangeText={(v) => setForm((p) => ({ ...p, message: v }))}
                multiline
                numberOfLines={6}
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              className="bg-[#E05017] rounded-lg py-4 items-center mt-2"
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-sm" style={{ fontFamily: 'Karla-Bold' }}>
                  Envoyer le message
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Contact Info */}
          <View className="border border-gray-200 rounded-xl p-4 space-y-5">
            <Text className="text-gray-900 font-bold text-base mb-2" style={{ fontFamily: 'Poppins_600SemiBold' }}>
              Nos coordonnées
            </Text>

            {/* Address */}
            <View className="space-y-1">
              <Text className="text-gray-900 text-sm font-semibold mb-1" style={{ fontFamily: 'Karla-Bold' }}>
                Adresse du bureau
              </Text>
              <View className="flex-row items-start gap-3">
                <MapPin size={18} color="#E05017" style={{ marginTop: 2 }} />
                <Text className="text-gray-600 text-sm flex-1" style={{ fontFamily: 'Karla_400Regular' }}>
                  15, avenue Jean-Mermoz, Cocody Abidjan, Côte d'Ivoire
                </Text>
              </View>
            </View>

            {/* Phone */}
            <View className="space-y-1">
              <Text className="text-gray-900 text-sm font-semibold mb-1" style={{ fontFamily: 'Karla-Bold' }}>
                Numéro de téléphone
              </Text>
              <TouchableOpacity
                className="flex-row items-start gap-3"
                onPress={() => Linking.openURL('tel:+2252722404720')}
              >
                <Phone size={18} color="#E05017" style={{ marginTop: 2 }} />
                <Text className="text-gray-600 text-sm flex-1" style={{ fontFamily: 'Karla_400Regular' }}>
                  (+225) 27 22 40 47 20 / 07 08 26 67 68
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email */}
            <View className="space-y-1">
              <Text className="text-gray-900 text-sm font-semibold mb-1" style={{ fontFamily: 'Karla-Bold' }}>
                Contact par e-mail
              </Text>
              <TouchableOpacity
                className="flex-row items-start gap-3"
                onPress={() => Linking.openURL('mailto:contact@plateforme-crasci.org')}
              >
                <Mail size={18} color="#E05017" style={{ marginTop: 2 }} />
                <Text className="text-[#E05017] text-sm flex-1" style={{ fontFamily: 'Karla_400Regular' }}>
                  contact@plateforme-crasci.org
                </Text>
              </TouchableOpacity>
            </View>

            {/* Social */}
            <View className="space-y-1">
              <Text className="text-gray-900 text-sm font-semibold mb-2" style={{ fontFamily: 'Karla-Bold' }}>
                Suivez-nous
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                  onPress={() => Linking.openURL('https://facebook.com')}
                  accessibilityLabel="Facebook"
                >
                  <Facebook size={18} color="#374151" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                  onPress={() => Linking.openURL('https://linkedin.com')}
                  accessibilityLabel="LinkedIn"
                >
                  <Linkedin size={18} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
