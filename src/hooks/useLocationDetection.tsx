// hooks/useLocationDetection.ts
import { useCallback, useEffect } from 'react'
import { useLocationStore } from '@/store/locationStore'
import { SessionLocationManager } from '@/utils/sessionLocationManger'

interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

interface ReverseGeocodeResponse {
  city?: string
  country?: string
  countryCode?: string
  region?: string
  postalCode?: string
}

export const useLocationDetection = () => {
  const {
    location,
    isLocationLoaded,
    isLocationLoading,
    locationError,
    hasLocationPermission,
    setLocation,
    setLocationLoading,
    setLocationError,
    setLocationPermission,
  } = useLocationStore()

  // Function to reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number): Promise<ReverseGeocodeResponse> => {
    try {
      // Using a free geocoding service (you can replace with your preferred service)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      )
      
      if (response.ok) {
        const data = await response.json()
        return {
          city: data.city || data.locality,
          country: data.countryName,
          countryCode: data.countryCode,
          region: data.principalSubdivision,
          postalCode: data.postcode,
        }
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error)
    }
    
    return {}
  }

  const detectLocation = useCallback(async (options: GeolocationOptions = {}) => {
    // Don't run if location is already loaded and we have permission
    if (isLocationLoaded && hasLocationPermission) {
      return
    }

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser')
      return
    }

    setLocationLoading(true)
    setLocationError(null)

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 300000, // 5 minutes
      ...options,
    }

    try {
      // Check permission first
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' })
        
        if (permission.state === 'denied') {
          setLocationPermission(false)
          setLocationError('Location access denied. Please enable location in your browser settings.')
          return
        }
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, defaultOptions)
      })

      const { latitude, longitude, accuracy } = position.coords
      
      setLocationPermission(true)

      // Get address information
      const address = await reverseGeocode(latitude, longitude)

      const locationData = {
        latitude,
        longitude,
        accuracy: accuracy || undefined,
        timestamp: Date.now(),
        address,
      }

      setLocation(locationData)
      
    } catch (error: any) {
      setLocationPermission(false)
      
      let errorMessage = 'Failed to get location'
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable'
          break
        case error.TIMEOUT:
          errorMessage = 'Location request timed out'
          break
        default:
          errorMessage = error.message || 'Unknown location error'
      }
      
      setLocationError(errorMessage)
    } finally {
      setLocationLoading(false)
    }
  }, [isLocationLoaded, hasLocationPermission, setLocation, setLocationLoading, setLocationError, setLocationPermission])

  return {
    location,
    isLocationLoaded,
    isLocationLoading,
    locationError,
    hasLocationPermission,
    detectLocation,
    shouldDetectThisSession: SessionLocationManager.shouldDetectLocation(),
    sessionInfo: SessionLocationManager.getSessionInfo(),
    forceDetection: (options?: GeolocationOptions) => detectLocation(options),
  }
}