import { View, Text, Image, Alert } from 'react-native'
import React, { useCallback } from 'react'
import CustomButton from './CustomButton'
import { icons } from '@/constants'
import { useSSO } from '@clerk/clerk-expo'
import * as AuthSession from 'expo-auth-session'
import { fetchAPI } from '@/lib/fetch'
import { googleOAuth } from '@/lib/auth'
import { router } from 'expo-router'

export default function OAuth() {
  const { startSSOFlow } = useSSO()

  const handleGoogleSignIn = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      // const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
      //   strategy: 'oauth_google',
      //   // For web, defaults to current path
      //   // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
      //   // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
      //   redirectUrl: AuthSession.makeRedirectUri(),
      // })

      // // If sign in was successful, set the active session
      // if (createdSessionId) {
      //   setActive!({ session: createdSessionId })

      //   await fetchAPI('/api/user', {
      //     method: 'POST',
      //     body: JSON.stringify({
      //       name: `${signUp?.firstName} ${signUp?.lastName}`,
      //       email: signUp?.emailAddress,
      //       clerkId: signUp?.createdUserId
      //     })
      //   })
      // } else {
      //   // If there is no `createdSessionId`,
      //   // there are missing requirements, such as MFA
      //   // Use the `signIn` or `signUp` returned from `startSSOFlow`
      //   // to handle next steps
      // }

      const result = await googleOAuth(startSSOFlow)

      if (result.code === 'session_exists' || result.code === 'success') {

        router.push("/(root)/(tabs)/home")
      }

      // Alert.alert(result.success ? "Success" : "Error", result.message)


    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])

  return (
    <View>
      <View className='flex flex-row items-center justify-center mt-4 gap-x-3'>
        <View className='flex-1 h-[1px] bg-general-100' />
        <Text className='text-lg'>Or</Text>
        <View className='flex-1 h-[1px] bg-general-100' />
      </View>

      <CustomButton
        title='Log In With Google'
        className='mt-5 w-full shadow-none'
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode='contain'
            className='w-5 h-5 mx-2'
          />
        )}
        bgVariant='outline'
        textVariant='primary'
        onPress={handleGoogleSignIn}
      />
    </View>
  )
}