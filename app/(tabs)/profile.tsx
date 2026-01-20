import ScreenWrapper from "@/components/ScreenWrapper";
import React from 'react';
import { Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScreenWrapper bg="white">
      <Text style={{fontFamily: "pBold", fontSize: 20}}>Profil</Text>
    </ScreenWrapper>
  )
}