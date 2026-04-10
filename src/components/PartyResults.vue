<template>
  <div class="py-4 flex justify-between items-center gap-4 hover:bg-[rgba(0,0,0,0.05)]">
    <div
      :class="['px-4 py-1 w-fit rounded-6 text-title-medium', partyResults.party.color]"
    >
      {{ partyResults.party.name }}
    </div>
    <div class="min-w-[150px] flex flex-col gap-2">
      <div>
        <b>{{ partyResults.votes.toLocaleString() }}</b> ({{ percentsAsString }})
      </div>
      <div>
        <div class="h-4 min-w-[150px] absolute bg-grey-lighten-1"></div>
        <div class="h-4 relative bg-green" :style="{'width': percentsAsString}"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  partyResults: any,
}>();

const percentsAsString = computed(() => `${props.partyResults.percents.toFixed(2)}%`);
</script>
