import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Ambulance, Shield, Flame, Heart, Info, Users, Phone, ChevronLeft, Loader2, HelpCircle } from 'lucide-react-native';
import { dataService } from '../services/dataService';
import { NumeroUtile } from '../services/types';

const ICON_MAP: Record<string, React.ReactNode> = {
    'Urgences médicales': <Ambulance size={20} color="#DC2626" />,
    'Sécurité & Police': <Shield size={20} color="#1D4ED8" />,
    'Pompiers & Secours': <Flame size={20} color="#EA580C" />,
    'Protection sociale & Enfance': <Heart size={20} color="#7C3AED" />,
    'Services publics': <Info size={20} color="#15803D" />,
    'Organisations de la société civile': <Users size={20} color="#E05017" />,
    'Urgences nationales': <AlertTriangle size={20} color="#374151" />,
};

const COLOR_MAP: Record<string, { text: string; bg: string; border: string }> = {
    'Urgences médicales': { text: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
    'Sécurité & Police': { text: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
    'Pompiers & Secours': { text: '#EA580C', bg: '#FFF7ED', border: '#FED7AA' },
    'Protection sociale & Enfance': { text: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
    'Services publics': { text: '#15803D', bg: '#F0FDF4', border: '#BBF7D0' },
    'Organisations de la société civile': { text: '#E05017', bg: '#FFF7ED', border: '#FED7AA' },
    'Urgences nationales': { text: '#374151', bg: '#F9FAFB', border: '#E5E7EB' },
};

const DEFAULT_COLOR = { text: '#374151', bg: '#F9FAFB', border: '#E5E7EB' };
const TOP_URGENCES = [
    { label: 'SAMU', numero: '185', color: '#DC2626' },
    { label: 'Pompiers', numero: '180', color: '#EA580C' },
    { label: 'Police', numero: '111', color: '#1D4ED8' },
    { label: 'Gendarmerie', numero: '170', color: '#1E3A8A' },
];

export default function NumerosUtilesScreen() {
    const router = useRouter();

    const { data: numeros = [], isLoading, isError } = useQuery({
        queryKey: ['numeros-utiles'],
        queryFn: dataService.getNumerosUtiles,
    });

    const grouped = numeros.reduce<Record<string, NumeroUtile[]>>((acc, item) => {
        if (!acc[item.categorie]) acc[item.categorie] = [];
        acc[item.categorie].push(item);
        return acc;
    }, {});

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-50">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ChevronLeft size={24} color="#E05017" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg flex-1">
                        Numéros utiles
                    </Text>
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs">
                        Urgences et services essentiels
                    </Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="bg-[#052838] px-6 pt-8 pb-7">
                    <View className="w-14 h-14 rounded-full bg-white/10 items-center justify-center mb-4">
                        <Phone size={28} color="white" />
                    </View>
                    <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-2xl mb-2">
                        Numéros utiles
                    </Text>
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-white/80 text-sm leading-6">
                        Retrouvez les numéros d'urgence et services essentiels en Côte d'Ivoire. En cas d'urgence vitale, composez le 185 (SAMU) ou le 180 (Pompiers).
                    </Text>
                </View>

                <View className="px-4 pt-5">
                    <View className="flex-row flex-wrap gap-3 mb-6">
                        {TOP_URGENCES.map((item) => (
                            <TouchableOpacity
                                key={item.numero}
                                onPress={() => Linking.openURL(`tel:${item.numero}`)}
                                className="flex-1 min-w-[145px] rounded-[20px] p-4 items-center"
                                style={{ backgroundColor: item.color }}
                            >
                                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-2xl">
                                    {item.numero}
                                </Text>
                                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-white/90 text-sm mt-1 text-center">
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {isLoading ? (
                        <View className="py-14 items-center">
                            <Loader2 size={28} color="#E05017" />
                            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm mt-3">
                                Chargement des numéros...
                            </Text>
                        </View>
                    ) : isError || numeros.length === 0 ? (
                        <View className="bg-white border border-gray-200 rounded-[24px] p-6 items-center">
                            <HelpCircle size={40} color="#D1D5DB" />
                            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm text-center mt-3">
                                Aucun numéro disponible pour le moment.
                            </Text>
                        </View>
                    ) : (
                        <View className="space-y-4">
                            {Object.entries(grouped).map(([categorie, items]) => {
                                const colors = COLOR_MAP[categorie] || DEFAULT_COLOR;
                                const icon = ICON_MAP[categorie] || <Phone size={20} color={colors.text} />;

                                return (
                                    <View
                                        key={categorie}
                                        className="rounded-[24px] p-5 border mb-4"
                                        style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                                    >
                                        <View className="flex-row items-center gap-3 mb-4">
                                            <View className="w-10 h-10 rounded-full items-center justify-center bg-white" style={{ borderWidth: 1, borderColor: colors.border }}>
                                                {icon}
                                            </View>
                                            <Text style={{ fontFamily: 'Poppins_700Bold', color: colors.text }} className="text-base flex-1">
                                                {categorie}
                                            </Text>
                                        </View>

                                        <View className="space-y-3">
                                            {items.map((item) => {
                                                const href = item.numero.includes('@')
                                                    ? `mailto:${item.numero}`
                                                    : `tel:${item.numero.replace(/\s/g, '')}`;

                                                return (
                                                    <TouchableOpacity
                                                        key={item.id}
                                                        onPress={() => Linking.openURL(href)}
                                                        className="bg-white rounded-[18px] p-4 border border-white/70"
                                                    >
                                                        <View className="flex-row items-start justify-between gap-3">
                                                            <View className="flex-1 pr-2">
                                                                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm">
                                                                    {item.label}
                                                                </Text>
                                                                {!!item.description && (
                                                                    <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs mt-1 leading-5">
                                                                        {item.description}
                                                                    </Text>
                                                                )}
                                                            </View>
                                                            <Text style={{ fontFamily: 'Poppins_700Bold', color: colors.text }} className="text-sm whitespace-nowrap">
                                                                {item.numero}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>
                                );
                            })}

                            <View className="bg-yellow-50 border border-yellow-200 rounded-[24px] p-5 mb-10 flex-row gap-3">
                                <AlertTriangle size={20} color="#D97706" style={{ marginTop: 2 }} />
                                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-yellow-800 text-sm leading-6 flex-1">
                                    <Text style={{ fontFamily: 'Poppins_700Bold' }}>Note :</Text> Ces numéros sont fournis à titre indicatif. En cas d'urgence absolue, composez le 185 (SAMU) ou le 180 (Pompiers).
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
