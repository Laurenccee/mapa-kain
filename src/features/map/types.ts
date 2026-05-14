import type { Feature, GeoJsonProperties, Geometry } from 'geojson';

export type BuildingSelection = {
  building: Feature<Geometry, GeoJsonProperties>;
  featureId: string | number | null;
} | null;
