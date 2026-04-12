<template>
  <div class="py-4 flex justify-between items-center gap-4 hover:bg-[rgba(0,0,0,0.05)]">
    <div class="flex flex-col items-start gap-2">
      <div class="flex justify-center gap-2">
        <a
          class="text-title-large max-lg:text-title-medium text-black decoration-none"
          :href="candidateResults.candidate.websiteLink"
          target="_blank"
        >
          {{ candidateResults.candidate.name }}
        </a>
        <v-icon
          v-if="isWinner"
          icon="mdi-star"
          :class="`${candidateResults.candidate.partyId}-winner`"
          :style="{'color': `var(${candidateResults.candidate.colorVar})`}"
        ></v-icon>
      </div>
      <span
        :class="['px-3 py-[1px] w-fit rounded-3 text-title-small', candidateResults.candidate.color]"
      >
        {{ candidateResults.candidate.partyName }}
      </span>
    </div>
    <div class="min-w-[150px] flex flex-col gap-2">
      <div>
        <b>{{ candidateResults.votes.toLocaleString() }}</b> ({{ percentsAsString }})
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
  candidateResults: any,
  isWinner?: boolean,
}>();

const percentsAsString = computed(() => `${props.candidateResults.percents.toFixed(2)}%`);
</script>
