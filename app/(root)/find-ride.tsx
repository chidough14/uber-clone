import { View, Text } from 'react-native'
import React from 'react'
import { useLocationStore } from '@/store'
import RideLayout from '@/components/RideLayout'
import GeoapifyAutocomplete from '@/components/GeoapifyAutoComplete'
import { useRouter } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import { icons } from '@/constants'

export default function FindRide() {
  const { userAddress, setDestinationLocation, setUserLocation, destinationAddress } = useLocationStore()
  const router = useRouter()

  // const handlePress = (location: { latitude: number, longitude: number, address: string }) => {
  //   setUserLocation(location)
  // }

  return (
    <RideLayout
      title='Ride'
      snapPoints={['85%']}
    >
      <View className='my-3'>
        <Text className='text-lg font-JakartaSemiBold'>From</Text>

        <GeoapifyAutocomplete
          onSelect={({ latitude, longitude, address }: any) => {
            setUserLocation({ latitude, longitude, address })
          }}
          showUserAddress={true}
          address={userAddress}
           icon={icons.target}
        />
      </View>

      <View>
        <Text className='text-lg font-JakartaSemiBold'>To</Text>
        <GeoapifyAutocomplete
          onSelect={({ latitude, longitude, address }: any) => {
            setDestinationLocation({ latitude, longitude, address })
          }}
          showUserAddress={true}
          address={destinationAddress}
           icon={icons.map}
        />
      </View>

      <CustomButton
        title='Find now'
        onPress={() => router.push("/(root)/confirm-ride")}
        className='mt-5'
      />
    </RideLayout>
  )
}