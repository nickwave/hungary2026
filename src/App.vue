<template>
  <v-app>
    <v-main>
      <div
        id="mainContent"
        class="max-w-[1200px] mx-auto bg-white"
      >
        <v-row class="px-5 pt-5 justify-between lg:flex-nowrap">
          <div class="p-4 content-center">
            <div class="text-display-medium font-bold text-uppercase">
              {{ $t('captions.currentResults') }}
            </div>
            <div class="mt-4 text-headline-medium">
              {{ $t('captions.turnout') }}: {{ turnoutPercents.toFixed(2) }}%
            </div>
          </div>
          <div class="h-[300px] w-[600px] max-lg:w-full max-lg:h-[200px] p-4">
            <MandatesDistributionChart />
          </div>
        </v-row>
        <v-row class="mt-0 justify-between max-lg:flex-col-reverse">
          <v-col class="pl-5 max-lg:px-5 h-[fit-content] flex flex-col gap-4">
            <PlaceSelectorPanel />
          </v-col>
          <div class="lg:mr-5 h-[400px] w-[650px] max-lg:w-full">
            <LeafletMap />
          </div>
        </v-row>
        <div class="mt-5 pb-16 min-h-[400px] rounded-t-[1rem] bg-[#F0EEEA]">
          <v-tabs
            class="rounded-t-4"
            v-model="selectedTab"
            color="rgb(255,213,0)"
            bg-color="rgb(5,5,5)"
            grow
          >
            <v-tab value="results">{{ $t('captions.results') }}</v-tab>
            <v-tab value="stats">{{ $t('captions.statistics') }}</v-tab>
          </v-tabs>
          <v-tabs-window class="pt-5" v-model="selectedTab">
            <v-tabs-window-item value="results">
              <ResultsTab />
            </v-tabs-window-item>
            <v-tabs-window-item value="stats">
              <StatsTab />
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
      </div>
    </v-main>
    <!-- <v-btn
      class="m-2"
      icon="mdi-theme-light-dark"
      location="top right"
      position="absolute"
      @click="$vuetify.theme.cycle()"
    /> -->
    <Loader />
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent } from "vue";

import ResultsTab from '@/components/ResultsTab.vue';
import StatsTab from '@/components/StatsTab.vue';
import Loader from '@/components/Loader.vue';

import { turnoutPercents, loadData } from '@/store';

// import MandatesDistributionChart from '@/components/MandatesDistributionChart.vue';
const MandatesDistributionChart = defineAsyncComponent(() => import('@/components/MandatesDistributionChart.vue'));

// import PlaceSelectorPanel from '@/components/PlaceSelectorPanel.vue';
const PlaceSelectorPanel = defineAsyncComponent(() => import('@/components/PlaceSelectorPanel.vue'));

// import LeafletMap from '@/components/LeafletMap.vue';
const LeafletMap = defineAsyncComponent(() => import('@/components/LeafletMap.vue'));

const selectedTab = ref('results');

loadData();



function sendHeightToParent() {
  const mainContentNode = document.getElementById("mainContent");
  const contentHeight = mainContentNode.scrollHeight;
  window.parent.postMessage(
    { type: 'IFRAME_HEIGHT', height: contentHeight }, 
    'http://localhost:3000' // Replace with parent's domain
  );
}

onMounted(() => {
  if (window.self !== window.top) {
    sendHeightToParent();
    document.documentElement.style.overflow = 'hidden';
  }
});
if (window.self !== window.top) {
  const observer = new MutationObserver(sendHeightToParent);
  observer.observe(document.body, { childList: true, subtree: true });
}
</script>
