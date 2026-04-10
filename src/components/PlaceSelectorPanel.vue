<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    class="min-h-[32px] m-0 p-0 text-label-medium"
    density="compact"
  >
    <template v-slot:title="{ item }">
      <v-icon
        v-if="item.icon"
        @click="item.onClick"
        :icon="item.icon"
        class="cursor-pointer"
      ></v-icon>
      <span
        v-else
        @click="item.onClick"
        class="cursor-pointer"
      >
        {{ item.title }}
      </span>
    </template>
  </v-breadcrumbs>
  <v-select
    label="Медьє (область)"
    :hide-details="true"
    :return-object="true"
    :clearable="true"
    :items="countiesToDisplay"
    item-title="name"
    v-model="selectedCounty"
    variant="outlined"
  ></v-select>
  <v-select
    label="Виборчий округ"
    :hide-details="true"
    :return-object="true"
    :clearable="true"
    :items="constituenciesToDisplay"
    item-title="name"
    v-model="selectedConstituency"
    variant="outlined"
  ></v-select>
  <v-select
    label="Населений пункт"
    :hide-details="true"
    :return-object="true"
    :clearable="true"
    :items="settlementsToDisplay"
    item-title="name"
    v-model="selectedSettlement"
    variant="outlined"
    :disabled="!selectedConstituency"
  ></v-select>
  <v-select
    label="Виборча дільниця"
    :hide-details="true"
    :return-object="true"
    :clearable="true"
    :items="pollingStationsToDisplay"
    item-title="name"
    v-model="selectedPollingStation"
    variant="outlined"
    :disabled="!selectedSettlement"
  ></v-select>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import {
  counties,

  selectedCounty,
  selectedConstituency,
  selectedSettlement,
  selectedPollingStation,
} from '@/store';

const breadcrumbs = computed(() => {
  const items = [];
  if (selectedCounty.value) {
    items.push({
      icon: 'mdi-home',
      onClick: () => {
        if (selectedCounty.value) selectedCounty.value = null;
      },
    });
    items.push({
      title: selectedCounty.value.name,
      onClick: () => {
        if (selectedConstituency.value) selectedConstituency.value = null;
      },
    });
  }
  if (selectedConstituency.value) {
    const countyName = selectedCounty.value.name;
    items.push({
      title: selectedConstituency.value.name
        .replace(`${countyName}, `, '')
        .replace('. no. constituency', ''),
      onClick: () => {
        if (selectedSettlement.value) selectedSettlement.value = null;
      },
    });
  }
  if (selectedSettlement.value) {
    items.push({
      title: selectedSettlement.value.name,
      onClick: () => {
        if (selectedPollingStation.value) selectedPollingStation.value = null;
      },
    });
  }
  if (selectedPollingStation.value) {
    const settlementName = selectedSettlement.value.name;
    items.push({
      title: selectedPollingStation.value.name
        .replace(`${settlementName}, `, '')
        .replace('. no. polling station', ''),
      onClick: () => {},
    });
  }
  return items;
});

const countiesToDisplay = computed(() => {
  return counties.value;
});

const constituenciesToDisplay = computed(() => {
  const selectedCountyId = selectedCounty.value?.id;
  if (selectedCountyId) {
    return counties.value.find((county) => selectedCountyId === county.id).constituencies;
  } else {
    const items = [];
    for (const county of counties.value) {
      for (const constituency of county.constituencies) {
        items.push(constituency);
      }
    }
    return items;
  }
});

const settlementsToDisplay = computed(() => {
  const countyId = selectedCounty.value?.id;
  const constituencyId = selectedConstituency.value?.id;
  if (countyId && constituencyId) {
    return counties.value
      .find((county) => countyId === county.id)
      .constituencies.find((constituency) => constituencyId === constituency.id)
      .settlements;
  } else {
    return [];
  }
});

const pollingStationsToDisplay = computed(() => {
  const countyId = selectedCounty.value?.id;
  const constituencyId = selectedConstituency.value?.id;
  const settlementId = selectedSettlement.value?.id;
  if (countyId && constituencyId && settlementId) {
    return counties.value
      .find((county) => countyId === county.id)
      .findSettlement({constituencyId, settlementId})
      ?.pollingStations;
  } else {
    return [];
  }
});
</script>
