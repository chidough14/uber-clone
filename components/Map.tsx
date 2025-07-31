import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { useDriverStore, useLocationStore } from '@/store';
import { calculateRegion, generateMarkersFromData } from '@/lib/map';
import { drivers } from '@/lib/drivers';
import { MarkerData } from '@/types/type';
import { icons } from '@/constants';

export default function Map() {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude
  } = useLocationStore()

  const { selectedDriver, setDrivers } = useDriverStore()
  const [markers, setMarkers] = useState<MarkerData[]>([])

  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude
  })

  useEffect(() => {
    setDrivers(drivers)
    
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude
      })

      setMarkers(newMarkers)
    }
  }, [drivers])

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ width: '100%', height: '100%', borderRadius: "16px" }}
        provider={PROVIDER_DEFAULT}
        tintColor='black'
        mapType='standard'
        showsPointsOfInterest={false}
        initialRegion={region}
        showsUserLocation={true}
        userInterfaceStyle='light'
      >
        {
          markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
              image={selectedDriver === marker.id ? icons.selectedMarker : icons.marker}
            />
          ))
        }
      </MapView>
    </View>
  );
}