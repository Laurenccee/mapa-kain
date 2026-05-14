import { Layer, VectorSource } from '@maplibre/maplibre-react-native';
import type { BuildingSelection } from '../types';

interface BuildingsLayerProps {
  selection: BuildingSelection;
}

export function BuildingsLayer({ selection }: BuildingsLayerProps) {
  return (
    <VectorSource id="openfreemap" url="https://tiles.openfreemap.org/planet">
      <Layer
        id="3d-buildings"
        type="fill-extrusion"
        source-layer="building"
        filter={
          selection?.featureId != null
            ? ['!=', ['id'], selection.featureId]
            : undefined
        }
        paint={{
          'fill-extrusion-color': '#2c2c2c',
          'fill-extrusion-height': ['get', 'render_height'],
          'fill-extrusion-base': ['get', 'render_min_height'],
          'fill-extrusion-opacity': 0.6,
          'fill-extrusion-vertical-gradient': true,
        }}
      />
    </VectorSource>
  );
}
