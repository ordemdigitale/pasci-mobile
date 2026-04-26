import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, Folder, Users, Briefcase, User, Book } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E05017',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 70 : 60,
          paddingBottom: Platform.OS === 'ios' ? 45 : 20,
          paddingTop: 0,
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