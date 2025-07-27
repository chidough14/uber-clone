import CustomButton from '@/components/CustomButton'
import InputField from '@/components/InputField'
import OAuth from '@/components/OAuth'
import { icons, images } from '@/constants'
import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Text, ScrollView, View, Image } from 'react-native'

export default function SignIn() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.push('/home')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
        <View className='relative w-full h-[250px]'>
          <Image
            source={images.signUpCar}
            className='w-full z-0 h-[250px]'
          />

          <Text className='text-2xl text-black font-JakartaSemiBold bottom-5 absolute left-5'>
            Welcome 👋🏼
          </Text>
        </View>

        <View className='p-5'>

          <InputField
            label={'Email'}
            placeholder={'Enter your email'}
            icon={icons.email}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />

          <InputField
            label={'Password'}
            placeholder={'Enter your password'}
            icon={icons.lock}
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />

          <CustomButton
            title='Sign In'
            onPress={onSignInPress}
            className='mt-6'
          />

          <OAuth />

          <Link href={'/sign-up'} className='text-lg text-center text-general-200 mt-10'>
            <Text>Don't have an account? </Text>
            <Text className='text-primary-500'>Sign Up</Text>
          </Link>
        </View>

        {/* Verification Modal */}
      </View>
    </ScrollView>
  )
}