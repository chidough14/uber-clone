import { useEffect, useState } from 'react'
import { TextInput, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import axios from 'axios'
import { icons } from '@/constants'

export default function GeoapifyAutocomplete({ onSelect, showUserAddress, address, icon }: any) {
  const [query, setQuery] = useState(showUserAddress ? address : undefined)
  const [results, setResults] = useState([])
  const [hasTyped, setHasTyped] = useState(false)

  useEffect(() => {
    if (!query || !hasTyped) return

    const timeout = setTimeout(() => {
      axios
        .get('https://api.geoapify.com/v1/geocode/autocomplete', {
          params: {
            text: query,
            apiKey: process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY,
            limit: 5,
          },
        })
        .then(res => {
          setResults(res.data.features)
        })
        .catch(err => console.log(err))
    }, 300)

    return () => clearTimeout(timeout)
  }, [query, hasTyped])

  return (
    <View className="bg-white rounded-xl p-2 shadow-md">
      <View className="flex-row items-center border rounded px-2">
        <Image source={icon} className="w-5 h-5 mr-2" />
        <TextInput
          placeholder="Search a location"
          value={query}
          onChangeText={(text) => {
            setQuery(text)
            setHasTyped(true) // only allow the request after user types
          }}
           className="flex-1 py-2"
        />
      </View>

      {query && results.length > 0 && (
        <ScrollView className="mt-2 max-h-60 border rounded">
          <View>
            {results.map((item: any) => (
              <TouchableOpacity
                key={item.properties.place_id}
                onPress={() => {
                  setQuery(item.properties.formatted)
                  setResults([])
                  setHasTyped(false) // stop triggering after selecting
                  onSelect({
                    latitude: item.geometry.coordinates[1],
                    longitude: item.geometry.coordinates[0],
                    address: item.properties.formatted,
                  })
                }}
                className="p-2 border-b"
              >
                <Text>{item.properties.formatted}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  )
}
