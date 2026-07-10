import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Share, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { CheckCircle, AlertCircle, Share2, ChevronLeft, Award, Download } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import { downloadAndOpenDocument } from '../../helpers/fileHelper';
import DownloadProgressModal from '../../components/ui/DownloadProgressModal';

export default function CertificatScreen() {
  const { code } = useLocalSearchParams();
  const router = useRouter();
  const certCode = code as string;
  const [downloadState, setDownloadState] = React.useState({
    visible: false,
    progress: 0,
    fileName: ''
  });

  const { data: cert, isLoading, isError } = useQuery({
    queryKey: ['certificat', certCode],
    queryFn: () => dataService.verifCertificat(certCode),
    enabled: !!certCode,
    retry: false,
  });

  const handleShare = async () => {
    if (!cert) return;
    try {
      await Share.share({
        message: `Certificat PASCI — ${cert.formation_title}\nDélivré à : ${cert.participant_name}\nCode : ${certCode}\nVérifier : https://plateforme-osci.org/certificat/${certCode}`,
      });
    } catch (_) { }
  };

  const handleDownload = async () => {
    if (!cert) return;
    const downloadUrl = `https://api.plateforme-osci.org/api/v1/formations/certificats/${certCode}/pdf`;
    const fileName = `certificat_${certCode}.pdf`;

    setDownloadState({
      visible: true,
      progress: 0,
      fileName: `Certificat - ${cert.participant_name}`
    });

    try {
      await downloadAndOpenDocument(downloadUrl, fileName, (progress) => {
        setDownloadState(prev => ({ ...prev, progress }));
      });
    } finally {
      setDownloadState(prev => ({ ...prev, visible: false }));
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color="#E05017" size="large" />
      </SafeAreaView>
    );
  }

  if (isError || !cert) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-8" edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <AlertCircle size={64} color="#EF4444" />
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20 }} className="text-gray-800 mt-5 text-center">
          Certificat introuvable
        </Text>
        <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 14 }} className="text-gray-500 text-center mt-2">
          Le code <Text style={{ fontFamily: 'Karla_700Bold' }}>{certCode}</Text> ne correspond à aucun certificat valide.
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-8 px-8 py-3 rounded-2xl" style={{ backgroundColor: '#E05017' }}>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', color: 'white' }}>Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()} className="bg-white p-2 rounded-full" style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16 }} className="text-gray-900">Certificat</Text>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleDownload} className="bg-white p-2 rounded-full mr-2" style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
            <Download size={20} color="#E05017" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} className="bg-white p-2 rounded-full" style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
            <Share2 size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          className="bg-white rounded-3xl overflow-hidden"
          style={{
            borderWidth: 4,
            borderColor: '#E05017',
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 24,
            elevation: 10,
          }}
        >
          {/* Bordure intérieure décorative */}
          <View style={{ position: 'absolute', inset: 8, borderWidth: 1, borderColor: 'rgba(224,80,23,0.25)', borderRadius: 20 }} />

          {/* Logo band */}
          <View className="py-5 items-center" style={{ backgroundColor: '#E05017' }}>
            <Text style={{ fontFamily: 'Poppins_700Bold', color: 'white', fontSize: 18, letterSpacing: 3 }}>PASCI</Text>
            <Text style={{ fontFamily: 'Karla_400Regular', color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>
              Plateforme des OSC de Côte d'Ivoire
            </Text>
          </View>

          <View className="px-8 pb-8 pt-6 items-center">
            {/* Médaillon */}
            <View
              className="w-20 h-20 rounded-full bg-orange-50 items-center justify-center mb-5"
              style={{ borderWidth: 3, borderColor: '#E05017' }}
            >
              <Award size={40} color="#E05017" />
            </View>

            <Text style={{ fontFamily: 'Karla_400Regular', color: '#9CA3AF', fontSize: 10, letterSpacing: 3, marginBottom: 8 }}>
              CERTIFIE QUE
            </Text>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 22, color: '#1F2937', textAlign: 'center', marginBottom: 4 }}>
              {cert.participant_name}
            </Text>
            <Text style={{ fontFamily: 'Karla_400Regular', color: '#6B7280', fontSize: 13, marginBottom: 16 }}>
              a complété avec succès
            </Text>

            <View style={{ height: 1, backgroundColor: '#F3F4F6', width: '100%', marginBottom: 16 }} />

            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#E05017', textAlign: 'center', marginBottom: 24 }}>
              {cert.formation_title}
            </Text>

            {/* Date & Code */}
            <View className="flex-row w-full">
              <View className="items-center flex-1">
                <Text style={{ fontFamily: 'Karla_400Regular', color: '#9CA3AF', fontSize: 10, marginBottom: 4 }}>DATE</Text>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: '#374151', textAlign: 'center' }}>
                  {formatDate(cert.issued_at)}
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#F3F4F6' }} />
              <View className="items-center flex-1">
                <Text style={{ fontFamily: 'Karla_400Regular', color: '#9CA3AF', fontSize: 10, marginBottom: 4 }}>CODE</Text>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: '#374151' }}>
                  {cert.code}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Badge de validité */}
        <View className="mt-4 flex-row items-center justify-center bg-green-50 border border-green-100 rounded-2xl px-4 py-3">
          <CheckCircle size={16} color="#16A34A" />
          <Text style={{ fontFamily: 'Poppins_600SemiBold', color: '#15803D', marginLeft: 8, fontSize: 13 }}>
            Certificat valide et authentique
          </Text>
        </View>

        {/* Bouton de téléchargement principal */}
        <TouchableOpacity
          onPress={handleDownload}
          className="mx-4 mt-6 py-4 rounded-2xl flex-row items-center justify-center"
          style={{ backgroundColor: '#E05017' }}
        >
          <Download size={20} color="white" />
          <Text style={{ fontFamily: 'Poppins_700Bold', color: 'white', marginLeft: 10 }}>TÉLÉCHARGER LE CERTIFICAT (PDF)</Text>
        </TouchableOpacity>

        <View className="h-10" />
      </ScrollView>

      <DownloadProgressModal
        visible={downloadState.visible}
        progress={downloadState.progress}
        fileName={downloadState.fileName}
      />
    </SafeAreaView>
  );
}
