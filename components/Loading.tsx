import { theme } from '../constants/theme'
import React from 'react'
import { ActivityIndicator, ActivityIndicatorProps, View } from 'react-native'

type LoadingProps = {
  size?: ActivityIndicatorProps['size'];
  color?: string;
};

const Loading = ({ size = 'large', color = theme.colors.primary }: LoadingProps) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator
        size={size}
        color={color}
      />
    </View>
  )
}

export default Loading