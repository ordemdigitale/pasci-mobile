import React from 'react';
import { View, Text } from 'react-native';
import { CalendarClock, Lock } from 'lucide-react-native';

/** Date limite de soumission d'une offre de projet (« Clôturée » une fois passée). */
export default function DateLimiteSoumission({
  date,
  ouverte,
  joursRestants,
  grand = false,
}: {
  date?: string | null;
  ouverte?: boolean;
  joursRestants?: number | null;
  grand?: boolean;
}) {
  if (!date) return null;
  const libelle = new Date(date).toLocaleDateString('fr-FR', grand ? { day: 'numeric', month: 'long', year: 'numeric' } : undefined);
  const urgent = joursRestants !== null && joursRestants !== undefined && joursRestants <= 7;
  const ferme = ouverte === false;
  const couleur = ferme ? '#6B7280' : urgent ? '#B91C1C' : '#15803D';
  const fond = ferme ? '#F3F4F6' : urgent ? '#FEF2F2' : '#F0FDF4';
  const texte = ferme
    ? `Clôturée le ${libelle}`
    : `${grand ? 'Soumission jusqu’au ' : 'Jusqu’au '}${libelle}${urgent ? ` (${joursRestants === 0 ? 'dernier jour' : `J-${joursRestants}`})` : ''}`;
  return (
    <View style={{ backgroundColor: fond }} className={`flex-row items-center self-start rounded-lg ${grand ? 'px-4 py-3 mb-6' : 'px-2 py-1 mb-2'}`}>
      {ferme ? <Lock size={grand ? 16 : 10} color={couleur} /> : <CalendarClock size={grand ? 16 : 10} color={couleur} />}
      <Text style={{ color: couleur, fontFamily: 'Karla_700Bold' }} className={`${grand ? 'text-sm' : 'text-[9px]'} ml-1.5`}>
        {texte}
      </Text>
    </View>
  );
}
