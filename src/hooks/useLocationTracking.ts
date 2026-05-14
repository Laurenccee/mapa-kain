import { logger } from '@/utils/logger';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

interface UseLocationTrackingResult {
  location: Location.LocationObject | null;
  error: string | null;
  isLoading: boolean;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
}

/**
 * Custom hook to handle location permissions and real-time tracking
 * Automatically requests permissions and watches position with high accuracy
 */
export const useLocationTracking = (): UseLocationTrackingResult => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriber, setSubscriber] =
    useState<Location.LocationSubscription | null>(null);

  const startLocationTracking = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Request foreground location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setIsLoading(false);
        logger.warn('Location permission denied');
        return;
      }

      logger.info('Location permission granted');

      // 2. Start watching location in real-time
      const newSubscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update every 10 meters
          timeInterval: 5000, // Update every 5 seconds minimum
        },
        (newLocation) => {
          setLocation(newLocation);
          setIsLoading(false);
          logger.debug('Location updated', {
            lat: newLocation.coords.latitude,
            lng: newLocation.coords.longitude,
          });
        },
      );

      setSubscriber(newSubscriber);
      logger.info('Location tracking started');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to start location tracking';
      setError(errorMessage);
      setIsLoading(false);
      logger.error('Location tracking error:', err);
    }
  };

  const stopLocationTracking = () => {
    if (subscriber) {
      subscriber.remove();
      setSubscriber(null);
      logger.info('Location tracking stopped');
    }
  };

  useEffect(() => {
    startLocationTracking();

    // Cleanup: Remove location subscription on unmount
    return () => {
      stopLocationTracking();
    };
  }, []);

  return {
    location,
    error,
    isLoading,
    startTracking: startLocationTracking,
    stopTracking: stopLocationTracking,
  };
};
