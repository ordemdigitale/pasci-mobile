import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react-native';
import { useMutation } from '@tanstack/react-query';
import { dataService } from '../services/dataService';

const MODES = ['Orange Money', 'MTN MoMo', 'Wave'];

export default function PaiementSimulationScreen() {
  const { tid, amount, slug, iid, did, type, local } = useLocalSearchParams();
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inscriptionId = iid ? parseInt(iid as string) : null;
  const donId = did ? parseInt(did as string) : null;
  const isDonFlow = type === 'don';
  const isLocalDonFallback = isDonFlow && local === '1' && !donId;

  const payMutation = useMutation({
    mutationFn: () => {
      if (isLocalDonFallback) {
        return Promise.resolve({});
      }
      if (isDonFlow) {
        return dataService.confirmerDonSimulation(donId!);
      }
      return dataService.confirmerPaiementSimulation(inscriptionId!);
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        if (isLocalDonFallback) {
          router.replace('/paiement-retour?type=don&status=success' as any);
        } else if (isDonFlow) {
          router.replace('/paiement-retour?type=don&status=success' as any);
        } else {
          router.replace(`/paiement-retour?type=formation&slug=${slug}&status=success` as any);
        }
      }, 1500);
    },
    onError: (err: any) => {
      Alert.alert('Erreur', err.message || 'Le paiement a échoué.');
    },
  });

  function handleRefuse() {
    if (isLocalDonFallback || isDonFlow) {
      router.replace('/paiement-retour?type=don&status=failed' as any);
    } else {
      router.replace(`/paiement-retour?type=formation&slug=${slug}&status=failed` as any);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Bandeau simulation */}
        <View className="flex-row items-center gap-2 bg-amber-100 border border-amber-300 rounded-2xl px-4 py-3 mb-4">
          <AlertCircle size={16} color="#92400E" />
          <Text style={{ fontFamily: 'Karla_400Regular', flex: 1, fontSize: 12 }} className="text-amber-800">
            <Text style={{ fontFamily: 'Karla_700Bold' }}>Mode simulation</Text> — CinetPay non encore configuré.
          </Text>
        </View>

        {/* Card principale */}
        <View className="bg-white rounded-3xl overflow-hidden" style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 4 }}>
          {/* Header CinetPay */}
          <View className="px-6 py-5 items-center" style={{ backgroundColor: '#1A3C5E' }}>
            <View className="flex-row items-center mb-1">
              <Shield size={22} color="white" />
              <Text style={{ fontFamily: 'Poppins_700Bold', color: 'white', fontSize: 18, marginLeft: 8 }}>CinetPay</Text>
            </View>
            <Text style={{ fontFamily: 'Karla_400Regular', color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Paiement sécurisé</Text>
          </View>

          <View className="px-6 py-6">
            {success ? (
              <View className="items-center py-6">
                <CheckCircle size={56} color="#22C55E" />
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18 }} className="text-gray-800 mt-3">Paiement simulé !</Text>
                <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 13 }} className="text-gray-500 mt-1">Redirection en cours...</Text>
              </View>
            ) : (
              <>
                {/* Détails transaction */}
                <View className="mb-6">
                  <View className="flex-row justify-between py-3 border-b border-gray-100">
                    <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 13 }} className="text-gray-500">Référence</Text>
                    <Text style={{ fontFamily: 'Karla_700Bold', fontSize: 11 }} className="text-gray-900">{tid}</Text>
                  </View>
                  <View className="flex-row justify-between py-3 border-b border-gray-100">
                    <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 13 }} className="text-gray-500">Montant</Text>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16 }} className="text-gray-900">
                      {parseInt(amount as string).toLocaleString('fr-FR')} FCFA
                    </Text>
                  </View>
                  <View className="flex-row justify-between py-3">
                    <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 13 }} className="text-gray-500">Devise</Text>
                    <Text style={{ fontFamily: 'Karla_700Bold', fontSize: 13 }} className="text-gray-900">XOF</Text>
                  </View>
                </View>

                {/* Modes de paiement */}
                <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 11 }} className="text-gray-400 text-center mb-3">
                  Simuler un mode de paiement
                </Text>
                <View className="flex-row gap-2 mb-6">
                  {MODES.map((m) => (
                    <TouchableOpacity
                      key={m}
                      onPress={() => setSelectedMode(m)}
                      className="flex-1 border rounded-xl py-3 items-center"
                      style={{ borderColor: selectedMode === m ? '#1A3C5E' : '#E5E7EB', backgroundColor: selectedMode === m ? 'rgba(26,60,94,0.05)' : 'white' }}
                    >
                      <Text style={{ fontFamily: 'Karla_700Bold', fontSize: 11, color: selectedMode === m ? '#1A3C5E' : '#6B7280' }}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Boutons */}
                <TouchableOpacity
                  onPress={() => payMutation.mutate()}
                  disabled={payMutation.isPending || (isDonFlow ? (!donId && !isLocalDonFallback) : !inscriptionId)}
                  className="h-14 rounded-2xl items-center justify-center mb-3"
                  style={{ backgroundColor: '#E05017' }}
                >
                  {payMutation.isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={{ fontFamily: 'Poppins_700Bold', color: 'white', fontSize: 16 }}>Payer maintenant</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRefuse} className="h-12 items-center justify-center">
                  <Text style={{ fontFamily: 'Karla_700Bold', fontSize: 14 }} className="text-gray-400">Annuler le paiement</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
