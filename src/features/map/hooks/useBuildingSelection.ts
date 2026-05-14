import type { MapRef, PressEvent } from '@maplibre/maplibre-react-native';
import type { Polygon } from 'geojson';
import { useState } from 'react';
import type { BuildingSelection } from '../types';
import { pointInPolygon } from '../utils/pointInPolygon';

export function useBuildingSelection(mapRef: React.RefObject<MapRef | null>) {
  const [selection, setSelection] = useState<BuildingSelection>(null);

  const handleMapPress = async (event: { nativeEvent: PressEvent }) => {
    const { point, lngLat } = event.nativeEvent;
    if (!mapRef.current) return;

    const features = await mapRef.current.queryRenderedFeatures(point, {
      layers: ['3d-buildings'],
    });

    if (features.length === 0) {
      setSelection(null);
      return;
    }

    const feature = features[0];
    const featureId = feature.id ?? null;

    if (feature.geometry.type === 'MultiPolygon') {
      const tapped = feature.geometry.coordinates.find((polygon) =>
        pointInPolygon(lngLat, polygon[0]),
      );
      if (tapped) {
        setSelection({
          featureId,
          building: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: tapped } as Polygon,
            properties: feature.properties,
          },
        });
      }
    } else {
      setSelection({ featureId, building: feature });
    }
  };

  return { selection, handleMapPress };
}
