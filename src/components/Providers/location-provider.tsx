// // components/LocationProvider.tsx
// 'use client'

// import { useEffect, useRef } from 'react'
// import { useLocationDetection } from '@/hooks/useLocationDetection'

// interface LocationProviderProps {
//   children: React.ReactNode
//   autoDetect?: boolean
//   showPermissionPrompt?: boolean
// }

// export const LocationProvider: React.FC<LocationProviderProps> = ({
//   children,
//   autoDetect = true,
//   showPermissionPrompt = false,
// }) => {
//   const { detectLocation, shouldDetectThisSession, hasLocationPermission } = useLocationDetection()
//   const hasAttemptedDetection = useRef(false)

//   useEffect(() => {
//     // Only attempt detection once per component mount
//     if (hasAttemptedDetection.current) {
//       return
//     }

//     // Don't auto-detect if we shouldn't detect this session
//     if (!shouldDetectThisSession) {
//       return
//     }

//     // Don't auto-detect if permission was previously denied in this session
//     if (hasLocationPermission === false && !showPermissionPrompt) {
//       return
//     }

//     if (autoDetect) {
//       hasAttemptedDetection.current = true
      
//       // Add small delay to ensure page is loaded
//       const timer = setTimeout(() => {
//         detectLocation()
//       }, 1000)

//       return () => clearTimeout(timer)
//     }
//   }, [autoDetect, detectLocation, shouldDetectThisSession, hasLocationPermission, showPermissionPrompt])

//   return <>{children}</>
// }

// // Optional: Location permission banner component
// export const LocationPermissionBanner: React.FC<{
//   onAllow: () => void
//   onDeny: () => void
//   show: boolean
// }> = ({ onAllow, onDeny, show }) => {
//   if (!show) return null

//   return (
//     <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-4 z-50 shadow-lg">
//       <div className="max-w-4xl mx-auto flex items-center justify-between">
//         <div className="flex-1">
//           <p className="text-sm">
//             We'd like to show you relevant products and services based on your location. 
//             This helps us provide a better shopping experience.
//           </p>
//         </div>
//         <div className="flex gap-2 ml-4">
//           <button
//             onClick={onAllow}
//             className="px-4 py-2 bg-white text-blue-600 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
//           >
//             Allow
//           </button>
//           <button
//             onClick={onDeny}
//             className="px-4 py-2 bg-blue-700 text-white rounded-md text-sm font-medium hover:bg-blue-800 transition-colors"
//           >
//             Not Now
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// components/Providers/location-provider.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocationDetection } from '@/hooks/useLocationDetection'

interface LocationProviderProps {
  children: React.ReactNode;
  autoDetect?: boolean;
  showPermissionPrompt?: boolean;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
  autoDetect = true,
  showPermissionPrompt = false,
}) => {
  const { detectLocation, shouldDetectThisSession, hasLocationPermission } = useLocationDetection()
  const hasAttemptedDetection = useRef(false)
  const [isMounted, setIsMounted] = useState(false)

  // Ensure we're only running on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only run after component is mounted (client-side)
    if (!isMounted) return

    // Only attempt detection once per component mount
    if (hasAttemptedDetection.current) {
      return
    }

    // Don't auto-detect if we shouldn't detect this session
    if (!shouldDetectThisSession) {
      return;
    }

    // Don't auto-detect if permission was previously denied in this session
    if (hasLocationPermission === false && !showPermissionPrompt) {
      return;
    }

    if (autoDetect) {
      hasAttemptedDetection.current = true;
      
      // Add small delay to ensure page is loaded
      const timer = setTimeout(() => {
        detectLocation();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isMounted, autoDetect, detectLocation, shouldDetectThisSession, hasLocationPermission, showPermissionPrompt])

  return <>{children}</>
}
