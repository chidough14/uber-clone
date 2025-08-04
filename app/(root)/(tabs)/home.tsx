import GeoapifyAutocomplete from '@/components/GeoapifyAutoComplete'
import Map from '@/components/Map.native'
import RideCard from '@/components/RideCard'
import { icons, images } from '@/constants'
import { useFetch } from '@/lib/fetch'
import { useLocationStore, useRideStore } from '@/store'
import { useAuth, useUser } from '@clerk/clerk-expo'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Page() {
  const { setUserLocation, setDestinationLocation } = useLocationStore()
  const { rides, setRides } = useRideStore()
  const { user } = useUser()
  const [hasPermissions, setHasPermissions] = useState(false)
  const router = useRouter()
  const { data: recentRides, loading } = useFetch(`/api/ride/${user?.id}`)
  const { signOut } = useAuth()

  const handleSignOut = () => {
    signOut()

    router.replace('/sign-in')
  }

  const handleDestinationPress = (location: { latitude: number, longitude: number, address: string }) => {
    setDestinationLocation(location)

    router.push("/(root)/find-ride")
  }

  useEffect(() => {
    setRides(recentRides)
  }, [recentRides])


  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== "granted") {
        setHasPermissions(false)
        return
      }

      let location = await Location.getCurrentPositionAsync()

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!
      })

      setUserLocation({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
        // latitude: 37.78825,
        // longitude: -122.4324,
        address: `${address[0].name} ${address[0].region}`
      })
    }

    requestLocation()
  }, [])

  return (
    <SafeAreaView className='bg-general-500'>
      <FlatList
        data={rides?.slice(0, 5)}
        renderItem={({ item }) => (
          <RideCard ride={item} />
        )}
        className='px-5'
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View className='flex flex-col items-center justify-center'>
            {
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
            }
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className='flex flex-row items-center justify-between mb-5'>
              <Text className='text-2xl capitalize font-JakartaBold'>Welcome,{" "} {user?.firstName || user?.emailAddresses[0].emailAddress.split("@")[0]}{" "} 👋🏼</Text>

              <TouchableOpacity
                onPress={handleSignOut}
                className='justify-center items-center w-10 h-10 rounded-full bg-white'
              >
                <Image
                  source={icons.out}
                  className='w-4 h-4'
                />
              </TouchableOpacity>
            </View>

            {/* Google TextInput */}
            {/* <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            /> */}

            <GeoapifyAutocomplete
              onSelect={({ latitude, longitude, address }: any) => {
                handleDestinationPress({ latitude, longitude, address })
                // setDestinationLocation({ latitude, longitude, address })
              }}
              showUserAddress={false}
              icon={icons.search}
            />

            <>
              <Text className='text-xl font-JakartaBold mt-5 mb-3'>Your Current Location</Text>

              <View className='flex flex-row items-center bg-transparent h-[300px]'>
                <Map />
              </View>
            </>

            <Text className='text-xl font-JakartaBold mt-5 mb-3'>Recent Rides</Text>
          </>
        )}
      />
    </SafeAreaView>
  )
}