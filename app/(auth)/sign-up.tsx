import CustomButton from '@/components/CustomButton'
import InputField from '@/components/InputField'
import OAuth from '@/components/OAuth'
import { icons, images } from '@/constants'
import { fetchAPI } from '@/lib/fetch'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Text, ScrollView, View, Image, Alert } from 'react-native'
import ReactNativeModal from 'react-native-modal'

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [pendingVerification, setPendingVerification] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [verification, setVerification] = useState({
    code: '',
    state: 'default',
    error: ''
  })

  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      // setPendingVerification(true)

      setVerification({
        ...verification,
        state: 'pending',
      })
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      Alert.alert("Error", err.errors[0].longMessage)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') { // remove code from app.json
        await fetchAPI('/api/user', {
          method: 'POST',
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: signUpAttempt.createdUserId,
          })
        })

        await setActive({ session: signUpAttempt.createdSessionId })
        // router.replace('/')
        setVerification({
          ...verification,
          state: 'success',
        })
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
        setVerification({
          ...verification,
          state: 'failed',
          error: 'Verification failed. Please try again.',
        })
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      setVerification({
        ...verification,
        state: 'failed',
        error: err.errors[0].longMessage,
      })
    }
  }

  // if (pendingVerification) {
  //   return (
  //     <>
  //       <Text>Verify your email</Text>
  //       <TextInput
  //         value={code}
  //         placeholder="Enter your verification code"
  //         onChangeText={(code) => setCode(code)}
  //       />
  //       <TouchableOpacity onPress={onVerifyPress}>
  //         <Text>Verify</Text>
  //       </TouchableOpacity>
  //     </>
  //   )
  // }

  return (
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
        <View className='relative w-full h-[250px]'>
          <Image
            source={images.signUpCar}
            className='w-full z-0 h-[250px]'
          />

          <Text className='text-2xl text-black font-JakartaSemiBold bottom-5 left-5 absolute'>
            Create Your Account
          </Text>
        </View>

        <View className='p-5'>
          <InputField
            label={'Name'}
            placeholder={'Enter your name'}
            icon={icons.person}
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />

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
            secureTextEntry={true}
          />

          <CustomButton
            title='Sign Up'
            onPress={onSignUpPress}
            className='mt-4'
          />

          <OAuth />

          <Link href={'/sign-in'} className='text-lg text-center text-general-200 mt-6'>
            <Text>Already have an account? </Text>
            <Text className='text-primary-500'>Sign In</Text>
          </Link>
        </View>

        {/* Verification Modal */}
        <ReactNativeModal
          isVisible={verification.state === 'pending'}
          onModalHide={() => setVerification({ ...verification, state: "success" })}
        >
          <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
            <Text className='text-2xl font-JakartaExtraBold mb-2'>
              Verification
            </Text>

            <Text className='font-Jakarta mb-5'>
              We have sent a verification code to {form.email}
            </Text>

            <InputField
              label='Code'
              icon={icons.lock}
              placeholder='12345'
              value={verification.code}
              keyboardType='numeric'
              onChangeText={(code) => setVerification({ ...verification, code })}
            />
          </View>

          {
            verification.error && (
              <Text className='text-red-500 text-sm mt-1'>
                 {verification.error}
              </Text>
            )
          }

          <CustomButton
            title='Verify Email'
            onPress={onVerifyPress}
            className='mt-5 bg-success-500'
          />
        </ReactNativeModal>

        <ReactNativeModal isVisible={verification.state === 'success'}>
          <View className='bg-white flex items-center px-7 py-9 rounded-2xl min-h-[300px]'>
            <Image source={images.check} className='w-[110px] h-[110px] my-5' />

            <Text className='text-3xl font-JakartaBold text-center'>
              Verified
            </Text>


            <Text className='text-base text-gray-400 font-Jakarta text-center mt-2'>
              You have successfully verified your account
            </Text>

            <CustomButton
              title='Browse Home'
              onPress={() => router.push("/home")}
              className='mt-5'
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  )
}