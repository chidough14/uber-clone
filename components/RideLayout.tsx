import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { ReactNode, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import { icons } from '@/constants'
import Map from './Map'
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'

export default function RideLayout({ title, children, snapPoints }: { title: string, children: ReactNode, snapPoints?: string[] }) {
  const router = useRouter()
  const bottomSheetRef = useRef<BottomSheet>(null)

  return (
    <GestureHandlerRootView>
      <View className='flex-1 bg-white'>
        <View className='flex flex-col h-screen bg-blue-500'>
          <View className='flex flex-row absolute z-10 top-16 justify-start items-center px-5'>
            <TouchableOpacity
              onPress={() => router.back()}
            >
              <View className='w-10 h-10 bg-white rounded-full items-center justify-center'>
                <Image
                  source={icons.backArrow}
                  resizeMode="contain"
                  className='w-6 h-6'
                />
              </View>
            </TouchableOpacity>

            <Text className='text-xl font-JakartaSemiBold'>{title || "Go Back"}</Text>
          </View>

          <Map />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints || ["25%", "50%", "90%"]}
          index={1}
        >
          <BottomSheetView style={{flex: 1, padding: 20}}>
            { children }
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  )
}