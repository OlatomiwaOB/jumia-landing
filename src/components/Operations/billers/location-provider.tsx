'use client';

import { useEffect } from 'react';
import { useLocationStore } from '@/store/locationStore';

export default function LocationProvider({ children }: { children: React.ReactNode }) {
    const { setLocation, setLocationPermission, setLocationError, setLocationLoading } = useLocationStore();

    useEffect(() => {
        const getLocation = () => {
            if (!navigator.geolocation) {
                console.log('Geolocation not supported');
                setLocation({
                    latitude: 0,
                    longitude: 0,
                    timestamp: Date.now(),
                    address: { countryCode: 'NG' }
                });
                return;
            }

            setLocationLoading(true);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp,
                        address: {
                            countryCode: 'NG',
                        }
                    };
                    
                    console.log('Location obtained:', locationData);
                    setLocation(locationData);
                    setLocationPermission(true);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLocationPermission(false);

                    setLocation({
                        latitude: 0,
                        longitude: 0,
                        timestamp: Date.now(),
                        address: { countryCode: 'NG' }
                    });
                    
                    setLocationError(error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        };

        getLocation();
    }, []);

    return <>{children}</>;
}