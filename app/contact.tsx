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
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Phone, Mail, Facebook, Linkedin } from 'lucide-react-native';
import { dataService } from '../services/dataService';

const CATEGORIES = ['OSC', 'PTF', 'Administration', 'Citoyen', 'Autre'];
const MOTIFS = ['Renseignement', 'Formation', 'Benevolat', 'Recherche', 'Adhesion', 'Autre'];
const SEXES = ['Homme', 'Femme', 'Autre'];
const TRANCHES = ['-18 ans', '18 a 35 ans', '+35 ans'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactScreen() {
  const [form, setForm] = useState({
    categorie_acteur: '',
    nom: '',
    prenoms: '',
    email: '',
    contact: '',
    fonction: '',
    sexe: '',
    tranche_age: '',
    pays: '',
    lieu_residence: '',
    motif: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const getErrorMessage = (error: any): string => {
    const detail = error?.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail[0]?.msg || 'Impossible d\'envoyer votre message.';
    }
    return 'Impossible d\'envoyer votre message. Verifiez votre connexion et reessayez.';
  };

  const handleSubmit = async () => {
    setEmailError('');

    const trimmedEmail = form.email.trim();
    const hasInvalidEmail = trimmedEmail.length > 0 && !EMAIL_REGEX.test(trimmedEmail);

    if (hasInvalidEmail) {
      setEmailError('Veuillez entrer une adresse email valide.');
    }

    if (!form.nom.trim() || !form.prenoms.trim() || !form.email.trim() || !form.motif.trim() || !form.message.trim()) {
      Alert.alert('Champs requis', 'Veuillez renseigner nom, prenoms, email, motif et message.');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError('Veuillez entrer une adresse email valide.');
      Alert.alert('Email invalide', 'Veuillez entrer une adresse email valide.');
      return;
    }

    setLoading(true);
    try {
      await dataService.submitContact({
        categorie_acteur: form.categorie_acteur || undefined,
        nom: form.nom.trim(),
        prenoms: form.prenoms.trim(),
        email: form.email.trim(),
        contact: form.contact.trim() || undefined,
        fonction: form.fonction.trim() || undefined,
        sexe: form.sexe || undefined,
        tranche_age: form.tranche_age || undefined,
        pays: form.pays.trim() || undefined,
        lieu_residence: form.lieu_residence.trim() || undefined,
        motif: form.motif,
        message: form.message.trim(),
      });

      setForm({
        categorie_acteur: '',
        nom: '',
        prenoms: '',
        email: '',
        contact: '',
        fonction: '',
        sexe: '',
        tranche_age: '',
        pays: '',
        lieu_residence: '',
        motif: '',
        message: ''
      });
      Alert.alert('Message envoye', 'Votre message a bien ete transmis. Nous vous repondrons dans les plus brefs delais.');
    } catch (error: any) {
      Alert.alert('Echec de l\'envoi', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
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
        {/* Hero section */}
        <View className="bg-gray-100 px-6 pt-8 pb-6 border-b border-gray-200">
          <Text className="text-[#2a591d] text-3xl font-bold mb-3" style={{ fontFamily: 'Poppins_700Bold' }}>
            Nous contacter
          </Text>
          <Text className="text-gray-600 text-base leading-6" style={{ fontFamily: 'Karla_400Regular' }}>
            Nous sommes la pour repondre a vos questions et vous fournir toute l'assistance necessaire.
          </Text>

          <View className="mt-5 rounded-2xl overflow-hidden border border-gray-200 bg-white">
            <Image
              source={require('../assets/images/service-hero.jpg')}
              style={{ width: '100%', height: 170 }}
              resizeMode="cover"
            />
          </View>
        </View>

        <View className="px-6 pt-6 bg-white">
          {/* Contact Form */}
          <View className="border border-gray-200 rounded-2xl p-6 mb-8">
            <Text className="text-gray-900 font-bold text-base mb-6" style={{ fontFamily: 'Poppins_700Bold' }}>
              Envoyez-nous un message
            </Text>

            {/* Categorie */}
            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Categorie d'acteur
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setForm((p) => ({ ...p, categorie_acteur: option }))}
                    className={`px-3 py-2 rounded-full border ${form.categorie_acteur === option ? 'bg-brand-orange border-brand-orange' : 'bg-white border-gray-300'}`}
                  >
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className={form.categorie_acteur === option ? 'text-white text-xs' : 'text-gray-700 text-xs'}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Nom */}
            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Nom *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="Entrer votre nom"
                placeholderTextColor="#d1d5db"
                value={form.nom}
                onChangeText={(v) => setForm((p) => ({ ...p, nom: v }))}
                autoCapitalize="words"
              />
            </View>

            {/* Prenoms */}
            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Prenoms *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="Entrer vos prenoms"
                placeholderTextColor="#d1d5db"
                value={form.prenoms}
                onChangeText={(v) => setForm((p) => ({ ...p, prenoms: v }))}
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
                style={{
                  fontFamily: 'Karla_400Regular',
                  borderColor: emailError ? '#ef4444' : '#d1d5db',
                  backgroundColor: emailError ? '#fef2f2' : '#ffffff',
                }}
                placeholder="Entrer votre adresse e-mail"
                placeholderTextColor="#d1d5db"
                value={form.email}
                onChangeText={(v) => {
                  const nextEmail = v.trim();
                  if (!nextEmail) {
                    setEmailError('');
                  } else if (EMAIL_REGEX.test(nextEmail)) {
                    setEmailError('');
                  }
                  setForm((p) => ({ ...p, email: v }));
                }}
                onBlur={() => {
                  const value = form.email.trim();
                  if (!value) {
                    setEmailError('');
                    return;
                  }

                  if (!EMAIL_REGEX.test(value)) {
                    setEmailError('Veuillez entrer une adresse email valide.');
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {!!emailError && (
                <Text className="text-red-600 text-xs mt-2" style={{ fontFamily: 'Karla_400Regular' }}>
                  {emailError}
                </Text>
              )}
            </View>

            {/* Contact */}
            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Telephone
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="Votre numero"
                placeholderTextColor="#d1d5db"
                value={form.contact}
                onChangeText={(v) => setForm((p) => ({ ...p, contact: v }))}
                keyboardType="phone-pad"
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

            {/* Pays et lieu de residence */}
            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Pays
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="Votre pays"
                placeholderTextColor="#d1d5db"
                value={form.pays}
                onChangeText={(v) => setForm((p) => ({ ...p, pays: v }))}
              />
            </View>

            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Lieu de residence
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                style={{ fontFamily: 'Karla_400Regular' }}
                placeholder="Ville/commune"
                placeholderTextColor="#d1d5db"
                value={form.lieu_residence}
                onChangeText={(v) => setForm((p) => ({ ...p, lieu_residence: v }))}
              />
            </View>

            {/* Sexe et Tranche d'age */}
            <View className="flex-row gap-4 mb-5">
              <View className="flex-1">
                <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                  Sexe
                </Text>
                <View className="bg-white border border-gray-300 rounded-lg mt-1">
                  {SEXES.map((option, index) => {
                    const isSelected = form.sexe === option;
                    const isLast = index === SEXES.length - 1;

                    return (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setForm((p) => ({ ...p, sexe: option }))}
                        accessibilityState={{ selected: isSelected }}
                        className={`px-4 py-2 ${!isLast ? 'border-b border-gray-100' : ''} ${isSelected ? 'bg-brand-orange' : 'bg-white'}`}
                      >
                        <Text
                          style={{ fontFamily: 'Karla_400Regular' }}
                          className={isSelected ? 'text-white' : 'text-gray-700'}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                  Tranche d'age
                </Text>
                <View className="bg-white border border-gray-300 rounded-lg mt-1">
                  {TRANCHES.map((option, index) => {
                    const isSelected = form.tranche_age === option;
                    const isLast = index === TRANCHES.length - 1;

                    return (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setForm((p) => ({ ...p, tranche_age: option }))}
                        accessibilityState={{ selected: isSelected }}
                        className={`px-4 py-2 ${!isLast ? 'border-b border-gray-100' : ''} ${isSelected ? 'bg-brand-orange' : 'bg-white'}`}
                      >
                        <Text
                          style={{ fontFamily: 'Karla_400Regular' }}
                          className={isSelected ? 'text-white' : 'text-gray-700'}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Motif */}
            <View className="mb-5">
              <Text className="text-gray-700 text-sm mb-2 font-bold" style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Motif *
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {MOTIFS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setForm((p) => ({ ...p, motif: option }))}
                    className={`px-3 py-2 rounded-full border ${form.motif === option ? 'bg-brand-orange border-brand-orange' : 'bg-white border-gray-300'}`}
                  >
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className={form.motif === option ? 'text-white text-xs' : 'text-gray-700 text-xs'}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
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
