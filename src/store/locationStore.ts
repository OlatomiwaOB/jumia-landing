import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp: number
  address?: {
    city?: string
    country?: string
    countryCode?: string
    region?: string
    postalCode?: string
  }
}

interface LocationState {
  location: LocationData | null
  isLocationLoaded: boolean
  isLocationLoading: boolean
  locationError: string | null
  hasLocationPermission: boolean | null

  setLocation: (location: LocationData) => void
  setLocationLoading: (loading: boolean) => void
  setLocationError: (error: string | null) => void
  setLocationPermission: (hasPermission: boolean) => void
  clearLocation: () => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      location: null,
      isLocationLoaded: false,
      isLocationLoading: false,
      locationError: null,
      hasLocationPermission: null,

      setLocation: (location: LocationData) => 
        set({ 
          location, 
          isLocationLoaded: true, 
          isLocationLoading: false, 
          locationError: null 
        }),

      setLocationLoading: (loading: boolean) => 
        set({ isLocationLoading: loading }),

      setLocationError: (error: string | null) => 
        set({ 
          locationError: error, 
          isLocationLoading: false 
        }),

      setLocationPermission: (hasPermission: boolean) => 
        set({ hasLocationPermission: hasPermission }),

      clearLocation: () => 
        set({ 
          location: null, 
          isLocationLoaded: false, 
          locationError: null, 
          hasLocationPermission: null 
        }),
    }),
    {
      name: 'location-storage',
      storage: {
        getItem: (key) => {
          if (typeof window === 'undefined') return null
          const item = sessionStorage.getItem(key)
          return item ? JSON.parse(item) : null
        },
        setItem: (key, value) => {
          if (typeof window === 'undefined') return
          sessionStorage.setItem(key, JSON.stringify(value))
        },
        removeItem: (key) => {
          if (typeof window === 'undefined') return
          sessionStorage.removeItem(key)
        },
      },
      // Fix TypeScript error: partialize should return Partial<LocationState>
      // partialize: (state) => ({ 
      //   hasLocationPermission: state.hasLocationPermission
      // }) as Partial<LocationState>,
    }
  )
)