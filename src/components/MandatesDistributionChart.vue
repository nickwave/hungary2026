<template>
  <svg class="w-full h-full" id="pchart" viewBox="0 0 500 300"></svg>
</template>

<script lang="ts" setup>
import { watch, onMounted } from "vue";
import * as d3 from 'd3';
import * as d3pc from 'd3-parliament-chart';

import { mandates } from '@/store';

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
