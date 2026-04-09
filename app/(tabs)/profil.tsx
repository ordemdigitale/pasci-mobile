import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  LogOut,
  Mail,
  Edit,
  Save,
  X,
  Award,
  ChevronRight,
  Calendar,
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import apiClient from '../../services/apiClient';

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ProfilScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editError, setEditError] = useState('');
  const [showAllCerts, setShowAllCerts] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getCurrentUser,
    retry: false,
  });

  const { data: certificats = [], isLoading: loadingCerts } = useQuery({
    queryKey: ['mes-certificats'],
    queryFn: () => apiClient.get('/formations/mes-certificats').then((r) => r.data),
    enabled: !!user,
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(['me'], updated);
      setEditModalVisible(false);
      setEditError('');
    },
    onError: (err: any) => {
      setEditError(err?.response?.data?.detail || 'Erreur lors de la mise à jour.');
    },
  });

  const openEditModal = () => {
    setEditFirstName(user?.first_name || '');
    setEditLastName(user?.last_name || '');
    setEditUsername(user?.username || '');
    setEditBio(user?.bio || '');
    setEditError('');
    setEditModalVisible(true);
  };

  const handleSave = () => {
    updateMutation.mutate({
      first_name: editFirstName.trim() || null,
      last_name: editLastName.trim() || null,
      username: editUsername.trim() || null,
      bio: editBio.trim() || null,
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            queryClient.clear();
            router.replace('/login');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-white"
        edges={['top']}
      >
        <View className="items-center mt-10">
          <Skeleton width={100} height={100} borderRadius={50} style={{ marginBottom: 16 }} />
          <Skeleton width={150} height={20} style={{ marginBottom: 8 }} />
          <Skeleton width={100} height={12} />
        </View>
        <View className="px-6 mt-12">
          <Skeleton width="100%" height={60} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={60} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={60} />
        </View>
      </SafeAreaView>
    );
  }

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || user.email
    : null;

  const visibleCerts: any[] = showAllCerts ? certificats : certificats.slice(0, 4);

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={['top']}
    >
      {/* Top header avec bouton déconnexion */}
      {user && (
        <View className="flex-row justify-end px-4 py-2">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center bg-red-50 px-3 py-2 rounded-full"
          >
            <LogOut size={14} color="#EF4444" />
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-red-500 text-xs ml-1.5 font-bold">Déconnexion</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Header */}
        <View className="items-center mt-4 px-6">
          <View className="w-24 h-24 bg-orange-50 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm overflow-hidden">
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={{ width: 96, height: 96 }} resizeMode="cover" />
            ) : (
              <User size={48} color="#E05017" />
            )}
          </View>

          {user ? (
            <>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-xl text-gray-900 text-center">
                {displayName}
              </Text>
              {user.email && (
                <View className="flex-row items-center mt-1">
                  <Mail size={12} color="#9CA3AF" />
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs ml-1">
                    {user.email}
                  </Text>
                </View>
              )}
              {user.date_joined && (
                <View className="flex-row items-center mt-1">
                  <Calendar size={11} color="#9CA3AF" />
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[11px] ml-1">
                    Membre depuis {formatDate(user.date_joined)}
                  </Text>
                </View>
              )}
              {user.is_staff && (
                <View className="bg-orange-50 px-3 py-1 rounded-full mt-2">
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-[#E05017] font-bold text-[10px] uppercase">Administrateur</Text>
                </View>
              )}
              {/* Edit button */}
              <TouchableOpacity
                onPress={openEditModal}
                className="flex-row items-center mt-4 bg-[#E05017] px-5 py-2 rounded-full"
              >
                <Edit size={14} color="#fff" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-white text-xs ml-1.5 font-bold">Modifier le profil</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-xl text-gray-900">Utilisateur Invité</Text>
              <TouchableOpacity
                onPress={() => router.push('/login')}
                className="bg-[#E05017] px-6 py-2 rounded-full mt-3"
              >
                <Text className="text-white font-bold text-xs">Se connecter</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Bio */}
        {user?.bio && (
          <View className="mx-6 mt-6 bg-gray-50 rounded-3xl p-5 border border-gray-100">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm leading-5 text-center">
              {user.bio}
            </Text>
          </View>
        )}

        {/* Certificats */}
        {user && (
          <View className="mx-6 mt-6 border border-gray-200 rounded-2xl p-4">
            <View className="flex-row items-center mb-3">
              <Award size={18} color="#E05017" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm ml-2">Mes Certificats</Text>
              {certificats.length > 0 && (
                <View className="bg-amber-100 px-2 py-0.5 rounded-full ml-2">
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-amber-700 text-[10px] font-bold">{certificats.length}</Text>
                </View>
              )}
            </View>
            {loadingCerts ? (
              <ActivityIndicator color="#E05017" size="small" style={{ marginVertical: 12 }} />
            ) : certificats.length === 0 ? (
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm">Aucun certificat pour le moment.</Text>
            ) : (
              <>
                {visibleCerts.map((cert: any, index: number) => (
                  <TouchableOpacity
                    key={cert.id}
                    className={`flex-row items-center py-3 ${index < visibleCerts.length - 1 ? 'border-b border-gray-100' : ''}`}
                    onPress={() => cert.code && router.push(`/certificat/${cert.code}` as any)}
                    activeOpacity={0.7}
                  >
                    <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mr-3 shrink-0">
                      <Award size={15} color="#E05017" />
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-900 text-sm font-semibold" numberOfLines={1}>
                        {cert.formation_title}
                      </Text>
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[11px] mt-0.5">
                        {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}{cert.code ? ` · ${cert.code}` : ''}
                      </Text>
                    </View>
                    <ChevronRight size={14} color="#D1D5DB" />
                  </TouchableOpacity>
                ))}
                {certificats.length > 4 && (
                  <TouchableOpacity onPress={() => setShowAllCerts(!showAllCerts)} className="mt-2 items-center py-1">
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-[#E05017] text-xs font-semibold">
                      {showAllCerts ? 'Voir moins' : `Voir les ${certificats.length - 4} autres`}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}


      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white rounded-t-3xl px-6 pt-5 pb-10">
            {/* Modal header */}
            <View className="flex-row items-center justify-between mb-5">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base">Modifier le profil</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {editError ? (
              <View className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-red-600 text-xs">{editError}</Text>
              </View>
            ) : null}

            {/* Prénom */}
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs mb-1">Prénom</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 mb-3"
              style={{ fontFamily: 'Karla_400Regular' }}
              value={editFirstName}
              onChangeText={setEditFirstName}
              placeholder="Votre prénom"
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
            />

            {/* Nom */}
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs mb-1">Nom</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 mb-3"
              style={{ fontFamily: 'Karla_400Regular' }}
              value={editLastName}
              onChangeText={setEditLastName}
              placeholder="Votre nom"
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
            />

            {/* Username */}
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs mb-1">Nom d'utilisateur</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 mb-3"
              style={{ fontFamily: 'Karla_400Regular' }}
              value={editUsername}
              onChangeText={setEditUsername}
              placeholder="@username"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
            />

            {/* Bio */}
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs mb-1">Bio</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 mb-5"
              style={{ fontFamily: 'Karla_400Regular', textAlignVertical: 'top' }}
              value={editBio}
              onChangeText={setEditBio}
              placeholder="Quelques mots sur vous..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
            />

            {/* Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 border border-gray-200 rounded-xl py-3.5 items-center"
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm font-semibold">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-[#E05017] rounded-xl py-3.5 items-center flex-row justify-center"
                onPress={handleSave}
                disabled={updateMutation.isPending}
                activeOpacity={0.85}
              >
                {updateMutation.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Save size={14} color="#fff" />
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-white text-sm font-bold ml-1.5">Enregistrer</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
