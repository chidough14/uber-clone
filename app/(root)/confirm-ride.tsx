import { View, Text, FlatList } from 'react-native'
import React from 'react'
import RideLayout from '@/components/RideLayout'
// import { drivers } from '@/lib/drivers'
import DriverCard from '@/components/DriverCard'
import CustomButton from '@/components/CustomButton'
import { useRouter } from 'expo-router'
import { useDriverStore } from '@/store'

export default function ConfirmRide() {
  const router = useRouter()
  const { drivers, selectedDriver, setSelectedDriver} = useDriverStore()

  return (
    <RideLayout 
      title='Choose your driver' 
      snapPoints={['65%', '85%']}
    >
      <FlatList
        data={drivers}
        renderItem={({item}) => <DriverCard item={item} selected={selectedDriver!} setSelected={() => setSelectedDriver(Number(item.id)!)} />}
        ListFooterComponent={() => (
          <View className='mx-5 mt-10'>
            <CustomButton title='Select Ride' onPress={() => router.push("/(root)/book-ride")} />
          </View>
        )}
      />
    </RideLayout>
  )
}