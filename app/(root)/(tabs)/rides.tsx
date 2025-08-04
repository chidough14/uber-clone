import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from '@clerk/clerk-expo'
import { useFetch } from '@/lib/fetch'
import RideCard from '@/components/RideCard'
import { images } from '@/constants'
import { Ride } from '@/types/type'
import { useRideStore } from '@/store'

export default function Rides() {
  const { user } = useUser()
  // const { data: recentRides, loading } = useFetch<Ride[]>(`/api/ride/${user?.id}`)
  const { rides } = useRideStore()

  return (
    <SafeAreaView>
      <FlatList
        data={rides!}
        renderItem={({ item }) => (
          <RideCard ride={item} />
        )}
        className='px-5'
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View className='flex flex-col items-center justify-center'>
            <>
              <Image
                source={images.noResult}
                className='w-40 h-40'
                alt='No recent rides found'
                resizeMode='contain'
              />
              <Text className='text-sm'>No recent rides found.</Text>
            </>
            {/* {
              !loading ? (
                <>
                  <Image
                    source={images.noResult}
                    className='w-40 h-40'
                    alt='No recent rides found'
                    resizeMode='contain'
                  />
                  <Text className='text-sm'>No recent rides found.</Text>
                </>
              ) : (
                <ActivityIndicator
                  size='large'
                  color='#000'
                />
              )
            } */}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <Text className='text-2xl font-JakartaBold my-5'>All Rides.</Text>
          </>
        )}
      />
    </SafeAreaView>
  )
}