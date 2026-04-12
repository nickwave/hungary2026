<template>
  <LMap
    ref="map"
    :useGlobalLeaflet="false"
    :options="{
      zoomControl: false,
      dragging: true,
      scrollWheelZoom: true,
    }"
    :minZoom="defaultZoom - 1"
    :zoom="defaultZoom"
    :center="defaultCenter"
  >
    <!-- <LControlZoom position="bottomright"></LControlZoom> -->
    <!-- <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      layer-type="base"
      name="OpenStreetMap"
      attribution="© OpenStreetMap contributors"
      :opacity="0.8"
    ></LTileLayer> -->
    <LTileLayer
      url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=sLekQeymNCTeDdm1mkP4"
      layer-type="base"
      name="MapTiler"
      :attribution="attribution"
    ></LTileLayer>

    <LPolygon
      v-for="polygon in countiesPolygonsToDisplay"
      :visible="selectedCounty ? false : true"
      @click="(e) => {
        selectedCounty = counties.find((county) => polygon.id === county.id);
      }"
      @mouseover="(e) => { hoveredPolygonId = polygon.id; }"
      @mouseout="(e) => { hoveredPolygonId = null; }"
      :lat-lngs="polygon.polygon"
      :fillOpacity="hoveredPolygonId === polygon.id ? 0.2 : 0.3"
      :color="polygon.color"
      :weight="2"
    >
      <LMarker
        :lat-lng="polygon.center"
        :visible="selectedCounty ? false : true"
        @click="(e) => {
          selectedCounty = counties.find((county) => polygon.id === county.id);
        }"
        @mouseover="(e) => { hoveredPolygonId = polygon.id; }"
        @mouseout="(e) => { hoveredPolygonId = null; }"
      >
        <LIcon class-name="county-name-marker">
          {{ counties.find((c) => polygon.id === c.id).name
              .replace(' county', '')
              .replace(' capital', '') }}
        </LIcon>
      </LMarker>
      <!-- <LTooltip>
        {{ polygon.id }}
      </LTooltip> -->
    </LPolygon>

    <LPolygon
      v-for="polygon in constituenciesPolygons"
      :visible="!selectedCounty
        ? false
        : !selectedConstituency
          ? selectedCounty.id === polygon.countyId
          : selectedSettlement || selectedPollingStation
            ? false
            : selectedCounty.id === polygon.countyId && selectedConstituency.id === polygon.id"
      @click="(e) => {
        selectedConstituency = selectedCounty.constituencies
          .find((constituency) => polygon.id === constituency.id);
      }"
      @mouseover="(e) => { if (!selectedConstituency) hoveredPolygonId = polygon.id; }"
      @mouseout="(e) => { if (!selectedConstituency) hoveredPolygonId = null; }"
      :lat-lngs="polygon.polygon"
      :fillOpacity="!selectedConstituency && hoveredPolygonId === polygon.id ? 0.2 : 0.3"
      :color="polygon.color"
      :weight="2"
    >
      <LMarker
        :lat-lng="polygon.center"
        :visible="!selectedCounty
          ? false
          : selectedConstituency
            ? false
            : selectedCounty.id === polygon.countyId"
        @click="(e) => {
          selectedConstituency = selectedCounty.constituencies
            .find((constituency) => polygon.id === constituency.id);
        }"
      >
        <LIcon class-name="bg-white flex justify-center items-center rounded-4">
          {{ polygon.id }}
        </LIcon>
      </LMarker>
      <!-- <LTooltip>
        {{ polygon.id }}
      </LTooltip> -->
    </LPolygon>

    <template v-for="polygon in pollingStationsPolygonsToDisplay">
      <LPolygon
        :visible="selectedPollingStation?.id === polygon.id ||
          (selectedSettlement?.id === polygon.settlementId &&
            hoveredPolygonId === polygon.id)"
        @click="(e) => {
          if (selectedPollingStation) {
            selectedPollingStation = null;
          }
        }"
        :lat-lngs="polygon.polygon"
        :fillOpacity="/*polygonIsHovered[polygonId]*/ false ? 0.25 : 0.3"
        :color="polygon.color"
        :weight="2"
      >
        <LTooltip>
          {{ polygon.id }}
        </LTooltip>
      </LPolygon>
      <LMarker
        @click="(e) => {
          if (selectedPollingStation) {
            selectedPollingStation = null;
          } else {
            const county = counties.find((c) => polygon.countyId === c.id);
            if (!selectedSettlement) {
              const settlement = county.findSettlement({
                constituencyId: polygon.constituencyId,
                settlementId: polygon.settlementId,
              });
              selectedSettlement = settlement;
            }
            const pollingStation = county.findPollingStation({
              constituencyId: polygon.constituencyId,
              settlementId: polygon.settlementId,
              pollingStationId: polygon.id,
            });
            if (pollingStation) {
              selectedPollingStation = pollingStation;
              return;
            }
          }
        }"
        @mouseover="(e) => { if (!selectedPollingStation) hoveredPolygonId = polygon.id; }"
        @mouseout="(e) => { if (!selectedPollingStation) hoveredPolygonId = null; }"
        :lat-lng="polygon.center"
      >
        <LTooltip>
          {{ polygon.id }}
        </LTooltip>
      </LMarker>
    </template>

  </LMap>
</template>

<script lang="ts" setup>
import { LMap, LControlZoom, LTileLayer, LCircleMarker, LMarker, LIcon, LPolygon, LTooltip } from "@vue-leaflet/vue-leaflet";
import { ref, computed, onMounted } from "vue";

import {
  mapRef,
  counties,
  selectedCounty,
  selectedConstituency,
  selectedSettlement,
  selectedPollingStation,
} from '@/store';

import {
  countiesPolygons,
  constituenciesPolygons,
  pollingStationsPolygons,
  defaultZoom,
  defaultCenter,
  hoveredPolygonId,
} from '@/polygons';

const attribution = "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e | \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e";

const countiesPolygonsToDisplay = computed(() => countiesPolygons);

const pollingStationsPolygonsToDisplay = computed(() => {
  const selectedCountyId = selectedCounty.value?.id;
  const selectedConstituencyId = selectedConstituency.value?.id;
  const selectedSettlementId = selectedSettlement.value?.id;
  const selectedPollingStationId = selectedPollingStation.value?.id;

  if (!selectedCountyId || !selectedConstituencyId) {
    return [];
  } else {
    return pollingStationsPolygons.filter((polygon) => {
      if (selectedCountyId && selectedCountyId !== polygon.countyId) return false;
      if (selectedConstituencyId && selectedConstituencyId !== polygon.constituencyId) return false;
      if (selectedSettlementId && selectedSettlementId !== polygon.settlementId) return false;
      if (selectedPollingStationId && selectedPollingStationId !== polygon.id) return false;
      return true;
    });
  }
});

const map = ref();
onMounted(() => {
  mapRef.value = map.value;
});
</script>
