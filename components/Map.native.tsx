import React, { useEffect, useMemo, useRef, useState } from 'react';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { useDriverStore, useLocationStore } from '@/store';
import { calculateDriverTimes, calculateRegion, generateMarkersFromData } from '@/lib/map';
// import { drivers } from '@/lib/drivers';
import { Driver, MarkerData } from '@/types/type';
import { icons } from '@/constants';
import { useFetch } from '@/lib/fetch';
// import MapViewDirections from 'react-native-maps-directions'



export default function Map() {
  const { loading, error, data: drivers } = useFetch<Driver[]>("/api/drivers")

  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude
  } = useLocationStore()

  const { selectedDriver, setDrivers } = useDriverStore()
  const [markers, setMarkers] = useState<MarkerData[]>([])
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const mapRef = useRef<MapView>(null);
  const stableMarkers = useMemo(() => markers, [JSON.stringify(markers)]);

  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude
  })

  useEffect(() => {
    const fetchRoute = async () => {
      if (
        !userLatitude ||
        !userLongitude ||
        !destinationLatitude ||
        !destinationLongitude
      ) return;

      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/routing?waypoints=${userLatitude},${userLongitude}|${destinationLatitude},${destinationLongitude}&mode=drive&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`
        );
        const data = await res.json();


        if (data?.features?.[0]?.geometry?.coordinates) {
          const coords = data.features[0].geometry.coordinates[0].map(
            ([lng, lat]: [number, number]) => ({
              latitude: lat,
              longitude: lng,
            })
          );
          setRouteCoords(coords);

          mapRef.current?.fitToCoordinates(routeCoords, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      } catch (err) {
        console.error('Geoapify route fetch failed:', err);
      }
    };

    fetchRoute();
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

  useEffect(() => {

    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude
      })

      setMarkers(newMarkers)
    }
  }, [drivers, userLatitude, userLongitude])

  useEffect(() => {
    if (markers.length > 0 && destinationLatitude && destinationLongitude) {
      calculateDriverTimes({
        markers,
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[])
      })
    }
  }, [markers, destinationLongitude, destinationLatitude])

  if (loading || (!userLatitude || !userLongitude)) {
    return (
      <View className='flex justify-between items-center w-full'>
        <ActivityIndicator size="small" color="#000" />
      </View>
    )
  }

  if (error) {
    return (
      <View className='flex justify-between items-center w-full'>
        <Text>Error: {error}</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
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

        {
          destinationLatitude && destinationLongitude && (
            <>
              {/* {
                Array.isArray(routeCoords) && routeCoords.length > 1 && routeCoords.every(coord =>
                  typeof coord.latitude === 'number' && typeof coord.longitude === 'number'
                ) && (
                  <>
                    <Marker coordinate={routeCoords[0]} title="Start"   image={icons.pin}/>
                    <Marker   key="destination" coordinate={routeCoords[routeCoords.length - 1]} title="End"   image={icons.pin}/>
                  </>
                )
              } */}

              <Marker
                key="destination"
                coordinate={{
                  latitude: destinationLatitude,
                  longitude: destinationLongitude
                }}
                title='Destination'
                image={icons.pin}
              />

              {/* <MapViewDirections
                origin={{
                  latitude: userLatitude!,
                  longitude: userLongitude!,
                }}
                destination={{
                  latitude: destinationLatitude,
                  longitude: destinationLongitude
                }}
                apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
                strokeColor='#0286ff'
                strokeWidth={2}
              /> */}

              {Array.isArray(routeCoords) && routeCoords.length > 1 && routeCoords.every(coord =>
                typeof coord.latitude === 'number' && typeof coord.longitude === 'number'
              ) && (
                  <Polyline
                    coordinates={routeCoords}
                    strokeColor="#0286ff"
                    strokeWidth={4}
                  />
                )}
            </>
          )
        }
      </MapView>
    </View>
  );
}

