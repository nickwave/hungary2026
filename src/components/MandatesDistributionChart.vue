<template>
  <svg class="w-full h-full max-h-[260px] max-lg:max-h-[200px]" id="pchart" viewBox="0 0 500 300"></svg>
  <div class="flex justify-center gap-4 max-lg:gap-2 text-title-small text-center">
    <template v-for="partyMandates in mandatesDistributions">
      <div
        v-if="partyMandates.party"
        :class="['px-3 py-[2px] w-fit rounded-4', partyMandates.party.color]"
      >
        <span>{{ partyMandates.party.name === 'Magyarországi Romák Országos'
          ? 'MRO'
          :  partyMandates.party.name }}: </span>
        <br />
        <b>{{ partyMandates.seats.join(' + ') }}</b>
        <b v-if="partyMandates.seats.length > 1"> = {{ partyMandates.seatsSum }}</b>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { watch, computed, onMounted } from "vue";
import * as d3 from 'd3';
import * as d3pc from 'd3-parliament-chart';

import { mandates } from '@/store';

const mandatesDistributions = computed(() => {
  const result = {};
  for (const partyMandates of mandates.value) {
    if (!partyMandates.party) continue;
    if (!result[partyMandates.party.id]) {
      result[partyMandates.party.id] = {
        party: partyMandates.party,
        seats: [],
        seatsSum: 0,
      }
    }
    if (partyMandates.mandateType === 'partyList') {
      result[partyMandates.party.id].seats.push(partyMandates.seats);
    } else {
      result[partyMandates.party.id].seats.push(partyMandates.seats);
    }
    result[partyMandates.party.id].seatsSum += partyMandates.seats;
  }
  return Object.values(result);
});

function repaintChart() {
  d3.select('svg#pchart').selectAll("g > *").remove();

  d3.select('svg#pchart')
    .append('g')
    .call(
      d3pc.parliamentChart()
        .width(500)
        .rowHeight(23) // 29
        .sections(1)
        .sectionGap(0)
        .seatRadius(8) // 7
        .aggregatedData(mandates.value))
    // ;
    .append("text")
    .text("199")
    .style("font-size", "40px")
    .attr("text-anchor", "middle")
    .attr("x", 250)
    .attr("y", 245);
}

onMounted(() => {
  repaintChart();
});

watch(mandates, () => {
  repaintChart();
});
</script>
