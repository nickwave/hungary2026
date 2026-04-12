<template>
  <div>
    <div class="text-title-small">
      {{ title }}
    </div>
    <table class="statistics-table my-2" style="border-collapse: collapse;">
      <thead>
        <tr>
          <th>{{ $t('statisticsTab.minCaption') }}</th>
          <th>{{ $t('statisticsTab.meanCaption') }}</th>
          <th>{{ $t('statisticsTab.maxCaption') }}</th>
          <th>
            <a class="text-black" :href="standartDeviationLink" target="_blank">
              {{ $t('statisticsTab.standartDeviationCaption') }}
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ statistics.minAsString }}</td>
          <td>{{ statistics.meanAsString }}</td>
          <td>{{ statistics.maxAsString }}</td>
          <td>{{ statistics.standartDeviationAsString }}</td>
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

const standartDeviationLink = i18n.global.locale.value == 'uk'
  ? 'https://uk.wikipedia.org/wiki/Стандартне_відхилення'
  : 'https://en.wikipedia.org/wiki/Standard_deviation';
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
