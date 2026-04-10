import { ref } from "vue";
import { latLng } from "leaflet";

import { loader } from '@/store';

import PolygonData from '@/models/PolygonData';

let countiesPolygons = <PolygonData>[];
let constituenciesPolygons = <PolygonData>[];
let pollingStationsPolygons = <PolygonData>[];

const defaultZoom = 7;
const defaultCenter = [47.199684, 19.451259];

const hoveredPolygonId = ref();

function clearPolygonsLists() {
  countiesPolygons = [];
  constituenciesPolygons = [];
  pollingStationsPolygons = [];
}

async function loadCountiesPolygons() {
  const response = await fetch('data/polygons/counties.json');
  const data = await response.json();
  for (const polygonData of data.polygons) {
    const polygon = new PolygonData(polygonData, 'county');
    countiesPolygons.push(polygon);
  }
  loader.value.increment();
}

async function loadCountyPolygons(countyId: string) {
  const response = await fetch(`data/polygons/county-${countyId}.json`);
  const data = await response.json();
  for (const constituencyPolygonData of data.constituencies) {
    const constituencyPolygon = new PolygonData(constituencyPolygonData, 'constituency');
    constituencyPolygon.countyId = countyId;
    constituenciesPolygons.push(constituencyPolygon);

    for (const pollingStationPolygonData of constituencyPolygonData.polling_stations) {
      const pollingStationPolygon = new PolygonData(pollingStationPolygonData, 'pollingStation');
      pollingStationsPolygons.push(pollingStationPolygon);
    }
  }
  loader.value.increment();
}

export {
  countiesPolygons,
  constituenciesPolygons,
  pollingStationsPolygons,
  defaultZoom,
  defaultCenter,
  hoveredPolygonId,

  clearPolygonsLists,
  loadCountiesPolygons,
  loadCountyPolygons,
}