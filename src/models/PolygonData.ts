import { latLng } from "leaflet";

enum PolygonType {
  county,
  constituency,
  pollingStation,
}

export default class PolygonData {
  id: string;
  type: PolygonType;
  center: latLng;
  polygon: latLng[];

  color: string;

  countyId?: string;
  constituencyId?: string;
  settlementId?: string

  constructor(data, polygonType) {
    this.id = data.id;
    this.type = polygonType === 'county'
      ? PolygonType.county
      : polygonType === 'constituency'
        ? PolygonType.constituency
        : PolygonType.pollingStation;
    this.center = latLng(data.center);
    this.polygon = data.polygon.map(latLng);

    this.color = 'var(--default-party-color)';

    this.countyId = data['maz'];
    this.constituencyId = data['evk'];
    this.settlementId = data['taz'];
  }
}
