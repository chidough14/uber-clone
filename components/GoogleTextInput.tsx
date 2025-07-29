import { View, Text } from 'react-native'
import React from 'react'
import { GoogleInputProps } from '@/types/type'

export default function GoogleTextInput({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress
}: GoogleInputProps) {
  return (
    <View 
      className={`flex flex-row justify-center items-center relative z-50 rounded-xl ${containerStyle} mb-5`}
    >
      <Text>Search</Text>
    </View>
  )
}