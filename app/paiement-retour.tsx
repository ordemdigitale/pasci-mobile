import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { CheckCircle, XCircle } from 'lucide-react-native';

export default function PaiementRetourScreen() {
  const { status, slug } = useLocalSearchParams();
  const router = useRouter();
  const isSuccess = status === 'success';

  return (
    <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-6" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        className="bg-white rounded-3xl p-8 w-full items-center"
        style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 16, elevation: 4 }}
      >
        {isSuccess ? (
          <>
            <CheckCircle size={72} color="#22C55E" />
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 22 }} className="text-gray-800 mt-5 text-center">
              Paiement confirmé !
            </Text>
            <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 14, lineHeight: 22 }} className="text-gray-500 text-center mt-3 mb-8">
              Votre inscription a bien été enregistrée. Vous recevrez un email de confirmation.
              Un certificat vous sera délivré à la fin de la formation.
            </Text>
            <TouchableOpacity
              onPress={() => router.replace(`/course-details/${slug}` as any)}
              className="w-full h-14 rounded-2xl items-center justify-center mb-3"
              style={{ backgroundColor: '#E05017' }}
            >
              <Text style={{ fontFamily: 'Poppins_700Bold', color: 'white', fontSize: 15 }}>Retour à la formation</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/formations' as any)}>
              <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 13 }} className="text-gray-400">
                Voir toutes les formations
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <XCircle size={72} color="#EF4444" />
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 22 }} className="text-gray-800 mt-5 text-center">
              Paiement non abouti
            </Text>
            <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 14, lineHeight: 22 }} className="text-gray-500 text-center mt-3 mb-8">
              Votre paiement n'a pas pu être finalisé. Aucun montant n'a été débité.
              Vous pouvez réessayer à tout moment.
            </Text>
            <TouchableOpacity
              onPress={() => router.replace(`/course-details/${slug}` as any)}
              className="w-full h-14 rounded-2xl items-center justify-center mb-3"
              style={{ backgroundColor: '#E05017' }}
            >
              <Text style={{ fontFamily: 'Poppins_700Bold', color: 'white', fontSize: 15 }}>Réessayer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/formations' as any)}>
              <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 13 }} className="text-gray-400">
                Toutes les formations
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
