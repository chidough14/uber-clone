import { View, Text, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from './CustomButton'
import { useStripe } from '@stripe/stripe-react-native'
import { fetchAPI } from '@/lib/fetch'
import { MarkerData, PaymentProps } from '@/types/type'
import { useLocationStore } from '@/store'
import { useAuth } from '@clerk/clerk-expo'
import ReactNativeModal from 'react-native-modal'
import { images } from '@/constants'
import { useRouter } from 'expo-router'

export default function Payment({
  fullName,
  email,
  driverId,
  rideTime,
  amount
}: PaymentProps) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const {
    userAddress,
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
    destinationAddress
  } = useLocationStore()
  const { userId } = useAuth()
  const router = useRouter()

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetchAPI('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName || email.split("@")[0],
          email: email,
          amount: amount,
        })
      })

      const { paymentIntent, ephemeralKey, customer } = response

      return {
        paymentIntent,
        ephemeralKey,
        customer,
      }
    } catch (error) {
      console.error("Error fetching payment sheet params:", error)
      Alert.alert("Error", "Unable to fetch payment details. Please try again.")
      return null
    }
  }

  const initializePaymentSheet = async () => {
    const params = await fetchPaymentSheetParams()
    if (!params) return

    const { paymentIntent, ephemeralKey, customer } = params

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      // intentConfiguration: {
      //   mode: {
      //     amount: parseInt(amount) * 100,
      //     currencyCode: 'USD'
      //   }
      // },
      defaultBillingDetails: {
        name: fullName || 'Jane Doe',
        email: email
      }
    })

    if (error) {
      console.error("initPaymentSheet error:", error)
      Alert.alert("Payment Error", error.message)
    } else {
      setLoading(true)
    }
  }

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet()

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message)
    } else {
      // ride/create
      await fetchAPI('/api/ride/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin_address: userAddress,
          destination_address: destinationAddress,
          origin_latitude: userLatitude,
          origin_longitude: userLongitude,
          destination_latitude: destinationLatitude,
          destination_longitude: destinationLongitude,
          ride_time: rideTime.toFixed(0),
          fare_price: parseInt(amount) * 100,
          payment_status: 'paid',
          driver_id: driverId,
          user_id: userId
        })
      })
      setSuccess(true)
      // Alert.alert('Success', 'Your order is confirmed!')
    }
  }

  useEffect(() => {
    initializePaymentSheet()
  }, [])

  return (
    <>
      <CustomButton
        title='Confirm Ride'
        className='my-10'
        onPress={openPaymentSheet}
        disabled={!loading}
      />

      <ReactNativeModal isVisible={success} onBackdropPress={() => setSuccess(false)}>
        <View className='flex flex-col items-center justify-center bg-white p-7 rounded-2xl'>
          <Image
            source={images.check}
            className='w-28 h-28 mt5'
          />

          <Text className='text-2xl text-center font-JakartaBold mt-5'>Ride Booked</Text>

          <Text className='text-md text-general-200 font-JakartaMedium text-center mt-3'>
            Thank you for your bookibg. Your reservation has been placed. Please proceed with your trip
          </Text>

          <CustomButton
            title='Back Home'
            onPress={() => {
              setSuccess(false)
              router.push("/(root)/(tabs)/home")
            }}
            className='mt-5'
          />
        </View>
      </ReactNativeModal>
    </>
  )
}
