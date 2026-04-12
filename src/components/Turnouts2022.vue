<template>
  <div class="h-[170px] lg:w-[550px] flex justify-between max-lg:gap-1">
    <div
      class="flex flex-col justify-end items-center gap-1"
      v-for="(turnout, timekey) in turnouts"
    >
      <div class="md:w-[55px] text-center text-title-medium max-lg:text-title-small">
        {{ turnout }}%
      </div>
      <div
        class="w-[40px] bg-[rgb(164,224,190)] hover:bg-[rgb(0,150,64)]"
        :style="{'height': `${((turnout/100)*150).toFixed()}px`}"
      >
      </div>
      <div class="text-title-small text-[#888888]">
        {{ timeByKey(timekey) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  turnouts: Record<string, number>,
}>();

function timeByKey(timekey) {
  switch (timekey) {
    case "1": return "07:00";
    case "2": return "09:00";
    case "3": return "11:00";
    case "4": return "13:00";
    case "5": return "15:00";
    case "6": return "17:00";
    case "7": return "18:30";
    case "8": return "19:00";
    default: return "00:00";
  }
}
</script>
