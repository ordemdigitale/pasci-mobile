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
    phone: '',
    subject: '',
    message: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires (marqués *).');
      return;
    }

    setLoading(true);
    // TODO: remplacer par un vrai endpoint API quand disponible
    setTimeout(() => {
      setLoading(false);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
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
            Contactez-nous
          </Text>
          <Text className="text-orange-100 text-sm" style={{ fontFamily: 'Karla_400Regular' }}>
            Nous sommes à votre écoute
          </Text>
        </View>

        <View className="px-6 pt-6">
          {/* Contact Info Section */}
          <View className="bg-gray-50 rounded-2xl p-6 mb-8">
            <Text className="text-gray-900 font-bold text-base mb-4" style={{ fontFamily: 'Poppins_700Bold' }}>
              Nos coordonnées
            </Text>
            
            <TouchableOpacity className="flex-row items-start mb-4">
              <Mail size={20} color="#E05017" style={{ marginRight: 12, marginTop: 2 }} />
              <View className="flex-1">
                <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Karla_400Regular' }}>
                  Email
                </Text>
                <Text className="text-brand-orange font-bold" style={{ fontFamily: 'Karla_400Regular' }}>
                  contact@pdoc.org
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-start mb-4">
              <Phone size={20} color="#E05017" style={{ marginRight: 12, marginTop: 2 }} />
              <View className="flex-1">
                <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Karla_400Regular' }}>
                  Téléphone
                </Text>
                <Text className="text-brand-orange font-bold" style={{ fontFamily: 'Karla_400Regular' }}>
                  +225 XX XX XX XX
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-start">
              <MapPin size={20} color="#E05017" style={{ marginRight: 12, marginTop: 2 }} />
              <View className="flex-1">
                <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Karla_400Regular' }}>
                  Adresse
                </Text>
                <Text className="text-gray-700 font-bold text-sm" style={{ fontFamily: 'Karla_400Regular' }}>
                  Abidjan, Côte d'Ivoire
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Contact Form */}
          <View className="border border-gray-200 rounded-2xl p-6 mb-6">
            <Text className="text-gray-900 font-bold text-base mb-6" style={{ fontFamily: 'Poppins_700Bold' }}>
              Envoyez-nous un message
            </Text>

            {/* Name */}
            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Nom complet *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="Votre nom complet"
                placeholderTextColor="#d1d5db"
                value={form.name}
                onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Adresse e-mail *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="votre@email.com"
                placeholderTextColor="#d1d5db"
                value={form.email}
                onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone */}
            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Téléphone
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="+225 XX XX XX XX"
                placeholderTextColor="#d1d5db"
                value={form.phone}
                onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
                keyboardType="phone-pad"
              />
            </View>

            {/* Subject */}
            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Objet du message *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="Sujet de votre demande"
                placeholderTextColor="#d1d5db"
                value={form.subject}
                onChangeText={(v) => setForm((p) => ({ ...p, subject: v }))}
              />
            </View>

            {/* Message */}
            <View className="mb-6">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Message *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular', textAlignVertical: 'top' }}
                placeholder="Votre message..."
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

          {/* Note */}
          <Text className="text-gray-400 text-xs text-center px-4" style={{ fontFamily: 'Karla_400Regular' }}>
            * Champs obligatoires
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
