import React, { useMemo, useRef } from 'react';

import { Text } from '@/components/ui/text';
import { BuildingsLayer } from '@/features/map/components/BuildingsLayer';
import { SelectedBuildingLayer } from '@/features/map/components/SelectedBuildingLayer';
import { useBuildingSelection } from '@/features/map/hooks/useBuildingSelection';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import {
  Camera,
  Map,
  MapRef,
  UserLocation,
} from '@maplibre/maplibre-react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapScreen() {
  const { location, error, isLoading } = useLocationTracking();
  const mapRef = useRef<MapRef>(null);
  const { selection, handleMapPress } = useBuildingSelection(mapRef);

  const center = useMemo<[number, number]>(() => {
    if (
      location &&
      typeof location.coords.longitude === 'number' &&
      typeof location.coords.latitude === 'number'
    ) {
      return [location.coords.longitude, location.coords.latitude];
    }
    return [122.36, 11.51];
  }, [location?.coords.latitude, location?.coords.longitude]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text className="text-secondary">{error}</Text>
      </View>
    );
  }

  if (isLoading || !location) {
    return (
      <ActivityIndicator size="large" color="#ef4444" style={styles.centered} />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Map
        style={styles.map}
        mapStyle="https://tiles.openfreemap.org/styles/dark"
        logo={false}
        attribution={false}
        ref={mapRef}
        onPress={handleMapPress}
      >
        <Camera initialViewState={{ center, zoom: 16, pitch: 70 }} />
        <BuildingsLayer selection={selection} />
        <SelectedBuildingLayer selection={selection} />
        <UserLocation animated accuracy heading />
      </Map>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
