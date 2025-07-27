import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Platform, Keyboard } from 'react-native'
import React from 'react'
import { InputFieldProps } from '@/types/type'

export default function InputField({
  label,
  labelStyle,
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='my-1 w-full'>
          <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>{label}</Text>
          <View
            className={
              `flex flex-row items-center  justify-start relative 
            bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500 
            ${containerStyle}`
            }
          >
            {
              icon && (
                <Image
                  source={icon}
                  className={`w-6 h-6 ml-4 ${iconStyle}`}
                />
              )
            }

            <TextInput
              secureTextEntry={secureTextEntry}
              className={`flex-1 p-4 text-[15px] font-JakartaRegular rounded-full ${inputStyle} text-left`}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}