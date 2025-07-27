// import { View, Text } from 'react-native'
// import React from 'react'

// export default function _layout() {
//   return (
//     <View>
//       <Text>_layout</Text>
//     </View>
//   )
// }

import { Tabs } from "expo-router";

export default function TabLayout() {
  return (

    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
    </Tabs>

  );
}