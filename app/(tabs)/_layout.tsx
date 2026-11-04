import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Folder, Users, Briefcase, User, Book } from 'lucide-react-native';

export default function TabLayout() {
  // Marge du bas du téléphone (barre gestuelle, ou 3 boutons de navigation
  // Android) : sans elle, les boutons du téléphone recouvraient le menu
  const insets = useSafeAreaInsets();
  const basTelephone = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E05017',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: 56 + basTelephone,
          paddingBottom: basTelephone,
          paddingTop: 6,
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: 'Poppins_600SemiBold',
          textTransform: 'uppercase',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ACCUEIL',
          tabBarIcon: ({ color, focused }) => (
            <Home size={20} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="annuaire"
        options={{
          title: 'ANNUAIRE',
          tabBarIcon: ({ color, focused }) => (
            <Book size={20} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="ressources"
        options={{
          title: 'DOCS',
          tabBarIcon: ({ color, focused }) => (
            <Folder size={20} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="espace-collab"
        options={{
          title: 'COLLAB',
          tabBarIcon: ({ color, focused }) => (
            <Users size={20} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="projets"
        options={{
          title: 'PROJETS',
          tabBarIcon: ({ color, focused }) => (
            <Briefcase size={20} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'PROFIL',
           tabBarIcon: ({ color, focused }) => (
            <User size={20} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      {/* Fichiers alias — masqués de la barre d'onglets */}
      <Tabs.Screen name="jobs" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="actualites" options={{ href: null }} />
    </Tabs>
  );
}