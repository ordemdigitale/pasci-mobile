import Icon from '@/assets/icons'
import { theme } from '@/constants/theme'
import { Tabs } from 'expo-router'
import React from 'react'
// Accueil, Annuaire, Offres, Profil
export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.green,
        tabBarInactiveTintColor: theme.colors.darkGray,
        tabBarLabelStyle: {
          fontFamily: "pMedium",
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopWidth: 0
        },
        headerShown: false
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name="home" size={26} strokeWidth={1.6} color={color} />
          ),
          tabBarLabel: "Accueil"
        }}
      />
      <Tabs.Screen
        name='ressources'
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name="folder" size={26} strokeWidth={1.6} color={color} />
          ),
          tabBarLabel: "Projets"
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name="news" size={26} strokeWidth={1.6} color={color} />
          ),
          tabBarLabel: "Emplois"
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name="user" size={26} strokeWidth={1.6} color={color} />
          ),
          tabBarLabel: "Profil"
        }}
      />
    </Tabs>
  )
}