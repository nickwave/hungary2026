<template>
  <div>
    <div class="text-title-small">
      {{ title }}
    </div>
    <table class="statistics-table my-2" style="border-collapse: collapse;">
      <thead>
        <tr>
          <th>{{ $t('statisticsTab.selectedCountyValueCaption') }}</th>
          <th>{{ $t('statisticsTab.deltaFromMeanCaption') }}</th>
          <th>
            <v-tooltip
              text="Кількість стандартних відхилень від середнього значення"
              location="top"
              max-width="250px"
              open-delay="400"
            >
              <template v-slot:activator="{ props }">
                <a
                  v-bind="props"
                  class="text-black"
                  :href="zScoreLink"
                  target="_blank"
                >
                  {{ $t('statisticsTab.zScoreCaption') }}
                </a>
              </template>
            </v-tooltip>
            
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ statistics.xAsString }}</td>
          <td>{{ statistics.deltaFromMeanAsString }}</td>
          <td
            :style="{
              'color': statistics.zScoreAsString > 0
                ? statistics.zScoreAsString > 10 ? 'black' : 'white'
                : statistics.zScoreAsString < -10 ? 'white' : 'white',
              'background-color': `hsl(${statistics.zScoreAsString > 0 ? 55 : 230}, ${Math.min(100, Math.abs(statistics.zScoreAsString * 10))}%, 50%)`,
            }"
          >
            {{ statistics.zScoreAsString }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import i18n from '@/plugins/i18n';
import Statistics from '@/models/Statistics';

defineProps<{
  title: string,
  statistics: Statistics,
}>();

const zScoreLink = i18n.global.locale.value == 'uk'
  ? 'https://uk.wikipedia.org/wiki/Стандартизована_оцінка'
  : 'https://en.wikipedia.org/wiki/Standard_score';
</script>

<style>
.statistics-table {
  border-collapse: collapse;
  background-color: rgb(245,245,245);
}
td, th {
  border: 1px solid #999999;
  padding: 4px;
  text-align: center;
}
td:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
