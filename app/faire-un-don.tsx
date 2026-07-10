import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Heart, Wallet, Smartphone, CheckCircle2 } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/dataService';
import { buildPaymentOperators, DEFAULT_PAYMENT_NUMBERS } from '../constants/payment';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DONATION_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

type DonationStep = 'form' | 'instructions' | 'done';

export default function FaireUnDonScreen() {
  const router = useRouter();
  const [step, setStep] = useState<DonationStep>('form');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [nom, setNom] = useState('');
  const [prenoms, setPrenoms] = useState('');
  const [fonction, setFonction] = useState('');
  const [sexe, setSexe] = useState('');
  const [trancheAge, setTrancheAge] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [pays, setPays] = useState('');
  const [lieuResidence, setLieuResidence] = useState('');
  const [message, setMessage] = useState('');
  const [donId, setDonId] = useState<number | null>(null);
  const [confirmedAmount, setConfirmedAmount] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [operateur, setOperateur] = useState<'wave' | 'orange_money' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false);

  const amount = customAmount ? parseInt(customAmount, 10) : selectedAmount;
  const { data: paymentNumbers } = useQuery({
    queryKey: ['payment-numbers'],
    queryFn: dataService.getPaymentNumbers,
    staleTime: 5 * 60 * 1000,
  });
  const paymentOperators = buildPaymentOperators(paymentNumbers || DEFAULT_PAYMENT_NUMBERS);

  const handleCreateDonation = async () => {
    if (!amount || Number.isNaN(amount) || amount < 1000) {
      Alert.alert('Montant invalide', 'Veuillez indiquer un montant valide (minimum 1 000 FCFA).');
      return;
    }

    if (!nom.trim() || !email.trim()) {
      Alert.alert('Champs requis', 'Veuillez renseigner votre nom et votre email.');
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      Alert.alert('Email invalide', 'Veuillez entrer une adresse email valide.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await dataService.creerDon({
        nom: nom.trim(),
        prenoms: prenoms.trim() || undefined,
        fonction: fonction.trim() || undefined,
        sexe: sexe || undefined,
        tranche_age: trancheAge || undefined,
        email: email.trim(),
        telephone: telephone.trim() || undefined,
        pays: pays.trim() || undefined,
        lieu_residence: lieuResidence.trim() || undefined,
        montant: amount,
        message: message.trim() || undefined,
      });
      setDonId(result.don_id);
      setConfirmedAmount(amount);
      setStep('instructions');
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error?.response?.data?.detail || error?.message || "Impossible d'enregistrer le don. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPayment = async () => {
    if (!donId) return;
    if (!transactionId.trim()) {
      Alert.alert('Code requis', 'Veuillez saisir le code de transaction reçu après paiement.');
      return;
    }

    setIsSubmittingTransaction(true);
    try {
      await dataService.soumettrePaiementDon(donId, {
        transaction_id: transactionId.trim(),
        operateur: operateur || null,
      });
      setStep('done');
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error?.response?.data?.detail || error?.message || 'Impossible de soumettre le paiement.',
      );
    } finally {
      setIsSubmittingTransaction(false);
    }
  };

  if (step === 'done') {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-5">
            <CheckCircle2 size={42} color="#16A34A" />
          </View>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl text-center mb-3">
            Code soumis avec succès
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-center leading-6 mb-8">
            Votre code de transaction a bien été enregistré. Notre équipe va vérifier et confirmer votre don dans les 24 heures.
          </Text>
          <TouchableOpacity onPress={() => router.replace('/')} className="bg-brand-orange px-8 py-4 rounded-2xl">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white">Retour à l'accueil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'instructions') {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-50">
          <TouchableOpacity onPress={() => setStep('form')} className="mr-4">
            <ChevronLeft size={24} color="#E05017" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg flex-1">
            Instructions de paiement
          </Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <View className="px-6 pt-6">
            <View className="items-center mb-6">
              <View className="w-14 h-14 bg-green-100 rounded-full items-center justify-center mb-4">
                <CheckCircle2 size={28} color="#16A34A" />
              </View>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-[#2a591d] text-2xl mb-2">
                Don enregistré
              </Text>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-center">
                Effectuez le paiement via Wave ou Orange Money, puis saisissez le code de transaction reçu.
              </Text>
            </View>

            <View className="space-y-3 mb-5">
              {paymentOperators.map((operator) => (
                <View
                  key={operator.value}
                  className="rounded-3xl p-5 border"
                  style={{ backgroundColor: operator.bg, borderColor: operator.border }}
                >
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: operator.color }}>
                      <Smartphone size={20} color="white" />
                    </View>
                    <View>
                      <Text style={{ fontFamily: 'Poppins_700Bold', color: operator.color }} className="text-base">
                        {operator.label}
                      </Text>
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs">
                        Paiement mobile
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontFamily: 'Poppins_700Bold', color: operator.color }} className="text-xl">
                    {operator.phone}
                  </Text>
                </View>
              ))}
            </View>

            <View className="bg-white border border-gray-100 rounded-3xl p-5 mb-5 shadow-sm">
              <View className="flex-row justify-between items-center mb-2">
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm">Montant à envoyer</Text>
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-xl">
                  {confirmedAmount.toLocaleString('fr-FR')} FCFA
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm">Référence</Text>
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-800">Don PASCI #{donId}</Text>
              </View>
            </View>

            <View className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-1">
                Confirmer mon paiement
              </Text>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs mb-4">
                Après paiement, saisissez le code de transaction reçu.
              </Text>
              <TextInput
                placeholder="Ex : WAVE123456789 ou OM987654321"
                placeholderTextColor="#9CA3AF"
                value={transactionId}
                onChangeText={setTransactionId}
                autoCapitalize="characters"
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 mb-4"
                style={{ fontFamily: 'Karla_400Regular' }}
              />

              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-700 text-xs mb-2">
                Opérateur
              </Text>
              <View className="flex-row gap-3 mb-5">
                {paymentOperators.map((operator) => (
                  <TouchableOpacity
                    key={operator.value}
                    onPress={() => setOperateur(operator.value)}
                    className="flex-1 py-3 rounded-2xl border items-center"
                    style={{
                      backgroundColor: operateur === operator.value ? operator.bg : '#F9FAFB',
                      borderColor: operateur === operator.value ? operator.color : '#E5E7EB',
                    }}
                  >
                    <Text
                      style={{ fontFamily: 'Poppins_600SemiBold', color: operateur === operator.value ? operator.color : '#6B7280' }}
                      className="text-xs"
                    >
                      {operator.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleSubmitPayment}
                disabled={isSubmittingTransaction}
                className="bg-[#2a591d] py-4 rounded-2xl items-center flex-row justify-center"
              >
                {isSubmittingTransaction ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <CheckCircle2 size={18} color="white" />
                    <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white ml-2">
                      Valider mon paiement
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color="#E05017" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg flex-1">
          Faire un Don
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-6 pt-6 pb-4">
          <View className="bg-brand-orange/10 w-14 h-14 rounded-full items-center justify-center mb-4">
            <Heart size={28} color="#E05017" />
          </View>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-2xl text-gray-900 mb-2">
            Soutenir PdoC
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm">
            Votre contribution aide à renforcer les organisations de la société civile en Côte d'Ivoire.
          </Text>
        </View>

        <View className="px-6 py-4">
          <View className="bg-green-50 rounded-[24px] p-4 border border-green-100">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-3">
              Votre impact:
            </Text>
            {['Formations et renforcement de capacités', 'Appui-conseil et accompagnement', 'Développement des ressources documentaires'].map((item) => (
              <View key={item} className="flex-row items-center mb-2">
                <View className="w-2 h-2 rounded-full bg-green-600 mr-3" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs">
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="px-6 py-4">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-3">
            Choisir un montant (FCFA)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {DONATION_AMOUNTS.map((donationAmount) => (
              <TouchableOpacity
                key={donationAmount}
                onPress={() => {
                  setSelectedAmount(donationAmount);
                  setCustomAmount('');
                }}
                className={`flex-1 min-w-[100px] py-3 rounded-[16px] items-center border-2 ${
                  selectedAmount === donationAmount ? 'bg-brand-orange border-brand-orange' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                  className={`text-sm ${selectedAmount === donationAmount ? 'text-white' : 'text-gray-900'}`}
                >
                  {donationAmount.toLocaleString('fr-FR')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-6 py-4">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-2">
            Ou un montant personnalisé
          </Text>
          <TextInput
            placeholder="Ex: 15000"
            placeholderTextColor="#D1D5DB"
            keyboardType="numeric"
            value={customAmount}
            onChangeText={(value) => {
              setCustomAmount(value);
              if (value) setSelectedAmount(null);
            }}
            className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-3 text-gray-900"
            style={{ fontFamily: 'Karla_400Regular' }}
          />
        </View>

        <View className="px-6 py-2">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-2">
            Vos informations
          </Text>
          {[
            { placeholder: 'Nom *', value: nom, setter: setNom },
            { placeholder: 'Prénoms', value: prenoms, setter: setPrenoms },
            { placeholder: 'Fonction', value: fonction, setter: setFonction },
            { placeholder: 'Sexe', value: sexe, setter: setSexe },
            { placeholder: "Tranche d'âge", value: trancheAge, setter: setTrancheAge },
          ].map((field) => (
            <TextInput
              key={field.placeholder}
              placeholder={field.placeholder}
              placeholderTextColor="#D1D5DB"
              value={field.value}
              onChangeText={field.setter}
              className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-3 text-gray-900 mb-3"
              style={{ fontFamily: 'Karla_400Regular' }}
            />
          ))}
          <TextInput
            placeholder="Email *"
            placeholderTextColor="#D1D5DB"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-3 text-gray-900 mb-3"
            style={{ fontFamily: 'Karla_400Regular' }}
          />
          <TextInput
            placeholder="Téléphone"
            placeholderTextColor="#D1D5DB"
            keyboardType="phone-pad"
            value={telephone}
            onChangeText={setTelephone}
            className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-3 text-gray-900 mb-3"
            style={{ fontFamily: 'Karla_400Regular' }}
          />
          <TextInput
            placeholder="Pays"
            placeholderTextColor="#D1D5DB"
            value={pays}
            onChangeText={setPays}
            className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-3 text-gray-900 mb-3"
            style={{ fontFamily: 'Karla_400Regular' }}
          />
          <TextInput
            placeholder="Lieu de résidence"
            placeholderTextColor="#D1D5DB"
            value={lieuResidence}
            onChangeText={setLieuResidence}
            className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-3 text-gray-900 mb-3"
            style={{ fontFamily: 'Karla_400Regular' }}
          />
          <TextInput
            placeholder="Message (optionnel)"
            placeholderTextColor="#D1D5DB"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-3 text-gray-900"
            style={{ fontFamily: 'Karla_400Regular', textAlignVertical: 'top' }}
          />
        </View>

        <View className="px-6 pb-6 pt-4">
          <TouchableOpacity
            onPress={handleCreateDonation}
            disabled={isSubmitting || (!selectedAmount && !customAmount)}
            className={`py-4 rounded-[24px] flex-row items-center justify-center ${
              isSubmitting ? 'bg-orange-300' : selectedAmount || customAmount ? 'bg-brand-orange' : 'bg-gray-300'
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Wallet size={20} color="white" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-base ml-2">
                  Enregistrer mon don
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
