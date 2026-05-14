import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { FeatureCollection } from 'geojson';
import type { BuildingSelection } from '../types';

const EMPTY_COLLECTION: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

interface SelectedBuildingLayerProps {
  selection: BuildingSelection;
}

export function SelectedBuildingLayer({
  selection,
}: SelectedBuildingLayerProps) {
  return (
    <GeoJSONSource
      id="selected-source"
      data={selection?.building ?? EMPTY_COLLECTION}
    >
      <Layer
        id="selected-building"
        type="fill-extrusion"
        paint={{
          'fill-extrusion-color': '#2196f3',
          'fill-extrusion-height': ['get', 'render_height'],
          'fill-extrusion-base': ['get', 'render_min_height'],
          'fill-extrusion-opacity': selection ? 1 : 0,
          'fill-extrusion-vertical-gradient': true,
        }}
      />
    </GeoJSONSource>
  );
}
