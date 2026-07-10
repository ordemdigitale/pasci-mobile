import { theme } from '../constants/theme'
import { hp } from '../helpers/common'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Loading from './Loading'

type CustomButtonProps = {
  title: string,
  onPress(): void,
  buttonStyle?: any,
  textStyle?: any,
  hasShadow?: boolean,
  loading?: boolean
}

const CustomButton = ({
  title,
  onPress = () => { },
  buttonStyle,
  textStyle,
  hasShadow = true,
  loading = false
}: CustomButtonProps) => {
  const shadowStyle = {
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  }

  if (loading) {
    return (
      <View style={[styles.button, buttonStyle, { backgroundColor: 'white' }]}>
        <Loading />
      </View>
    )
  }
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, buttonStyle, hasShadow && shadowStyle]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  button: {
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.xxl,
    borderStyle: 'solid',
    borderWidth: 2
  },
  text: {}
})