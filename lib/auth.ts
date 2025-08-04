// import * as AuthSession from 'expo-auth-session'
import * as Linking from 'expo-linking'
import { fetchAPI } from './fetch'

export const googleOAuth = async (startSSOFlow: any) => {
  try {
    const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
      strategy: 'oauth_google',
      // For web, defaults to current path
      // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
      // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
      // redirectUrl: AuthSession.makeRedirectUri(),
      redirectUrl: Linking.createURL("/(root)/(tabs)/home", { scheme: "myapp" })
    })

    // If sign in was successful, set the active session
    if (createdSessionId) {
      if (setActive) {
        await setActive!({ session: createdSessionId })

        if (signUp.createdSessionId) {
          await fetchAPI('/api/user', {
            method: 'POST',
            body: JSON.stringify({
              name: `${signUp?.firstName} ${signUp?.lastName}`,
              email: signUp?.emailAddress,
              clerkId: signUp?.createdUserId
            })
          })
        }

        return {
          success: true,
          code: "success",
          message: "You have successfully authenticated"
        }
      }
    }

    return {
      success: false,
      code: 'success',
      message: "An error occurred"
    }
  } catch (error: any) {
    console.log(error)

    return {
      success: false,
      code: error.code,
      message: error?.errors[0]?.longMessage
    }
  }
}