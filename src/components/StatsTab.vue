<template>
  <div class="px-4" v-if="selectedCounty">
    <div class="my-4 text-center text-headline-small text-uppercase">
      <span>{{ $t('statisticsTab.title') }}</span>
      <b v-if="selectedConstituency"> — {{ selectedConstituency.name }}</b>
      <b v-else-if="selectedCounty"> — {{ selectedCounty.name }}</b>
      <!-- <b v-if="selectedCounty"> — {{ selectedCounty.name }}</b> -->
    </div>

    <div>
      <div class="text-title-large">
        {{ $t('statisticsTab.turnout2022Title') }}
      </div>
      <Turnouts2022
        v-if="selectedConstituency"
        :turnouts="turnouts2022[selectedCounty.id].constituencies[selectedConstituency.id]"
      />
      <Turnouts2022
        v-else-if="selectedCounty"
        :turnouts="turnouts2022[selectedCounty.id].turnouts"
      />        
    </div>

    <div
      v-if="showStatisticsSection.turnout"
      class="mt-8 flex flex-col gap-4"
    >
      <div class="flex flex-col gap-4">
        <div class="text-title-large">
          {{ selectedConstituency
            ? $t('statisticsTab.turnoutConstituenciesComparsionTitle')
            : $t('statisticsTab.turnoutCountiesComparsionTitle')
          }}
        </div>
        <div class="flex max-lg:flex-col gap-4">
          <PlaceStatisticsBlock
            :title="selectedConstituency
              ? $t('statisticsTab.chosenConstituencyValueCaption')
              : $t('statisticsTab.chosenCountyValueCaption')"
            :xValueTitle="selectedConstituency
              ? $t('statisticsTab.selectedConstituencyValueCaption')
              : $t('statisticsTab.selectedCountyValueCaption')"
            :statistics="selectedConstituency
              ? countiesConstituenciesTurnoutStatistics[selectedCounty.id][selectedConstituency.id]
              : countiesTurnoutStatistics[selectedCounty.id]
            "
          />
          <AggregatedStatisticsBlock
            :title="selectedConstituency
              ? $t('statisticsTab.allConstituenciesValueCaption')
              : $t('statisticsTab.allCountiesValueCaption')"
            :statistics="selectedConstituency
              ? countiesConstituenciesTurnoutStatistics[selectedCounty.id][selectedConstituency.id]
              : countiesTurnoutStatistics[selectedCounty.id]"
          />
        </div>
      </div>

      <v-divider v-if="showStatisticsSection.votes"></v-divider>
      <div
        v-if="showStatisticsSection.votes"
        class="flex flex-col gap-4"
      >
        <div class="text-title-large">
          {{ selectedConstituency
            ? $t('statisticsTab.resultsConstituenciesComparsionTitle')
            : $t('statisticsTab.resultsCountiesComparsionTitle')
          }}
        </div>
        <div
          v-for="partyId in CHOSEN_PARTIES_IDS"
          class="p-4"
          :style="{'background-color': partyColor(partyId)}"
        >
          <div class="mb-2 text-title-large font-medium">
            {{ partyName(partyId) }}
          </div>
          <div class="flex max-lg:flex-col gap-4">
            <div>
              <PlaceStatisticsBlock
                :title="`${$t('statisticsTab.chosenCountyValueCaption')} ${$t('statisticsTab.ofPartiesCaption')}`"
                :xValueTitle="selectedConstituency
                  ? $t('statisticsTab.selectedConstituencyValueCaption')
                  : $t('statisticsTab.selectedCountyValueCaption')"
                :statistics="countiesPartiesStatistics[selectedCounty.id][partyId]"
              />
              <PlaceStatisticsBlock
                :title="`${$t('statisticsTab.chosenCountyValueCaption')} ${$t('statisticsTab.ofCandidatesCaption')}`"
                :xValueTitle="selectedConstituency
                  ? $t('statisticsTab.selectedConstituencyValueCaption')
                  : $t('statisticsTab.selectedCountyValueCaption')"
                :statistics="countiesCandidatesStatistics[selectedCounty.id][partyId]"
              />
            </div>
            <div>
              <AggregatedStatisticsBlock
                :title="`${$t('statisticsTab.allCountiesValueCaption')} ${$t('statisticsTab.ofPartiesCaption')}`"
                :statistics="countiesPartiesStatistics[selectedCounty.id][partyId]"
              />
              <AggregatedStatisticsBlock
                :title="`${$t('statisticsTab.allCountiesValueCaption')} ${$t('statisticsTab.ofCandidatesCaption')}`"
                :statistics="countiesCandidatesStatistics[selectedCounty.id][partyId]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="my-16 text-center text-[#808080] text-headline-small">
      {{ $t('statisticsTab.choosePlaceSuggestion') }}
    </div>
  </div>

  <div class="h-[1px] mb-8"></div>

</template>

<script lang="ts" setup>
import {
  TISZA_ID,
  FIDESZ_ID,
  MH_ID,
  CHOSEN_PARTIES_IDS,
  counties,
  selectedCounty,
  selectedConstituency,
} from '@/store';

import {
  showStatisticsSection,
  countiesTurnoutStatistics,
  countiesConstituenciesTurnoutStatistics,
  countiesCandidatesStatistics,
  countiesPartiesStatistics,
  turnouts2022,
} from '@/statistics';

import Turnouts2022 from '@/components/Turnouts2022.vue';
import PlaceStatisticsBlock from '@/components/PlaceStatisticsBlock.vue';
import AggregatedStatisticsBlock from '@/components/AggregatedStatisticsBlock.vue';

function partyColor(partyId: string): string {
  switch (partyId) {
    case TISZA_ID: return 'color-mix(in srgb, var(--tisza-color), transparent 80%)';
    case FIDESZ_ID: return 'color-mix(in srgb, var(--fidesz-color), transparent 80%)';
    case MH_ID: return 'color-mix(in srgb, var(--mi-hazank-color), transparent 80%)';
    default: return 'color-mix(in srgb, var(--default--color), transparent 80%)';
  }
}

function partyName(partyId: string): string {
  switch (partyId) {
    case TISZA_ID: return 'TISZA';
    case FIDESZ_ID: return 'FIDESZ-KDNP';
    case MH_ID: return 'Mi Hazánk';
    default: return 'Unknown';
  }
}
</script>
