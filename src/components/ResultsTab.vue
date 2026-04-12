<template>
  <div class="px-4">
    <div class="my-4 text-center text-headline-small text-uppercase">
      <span>{{ $t('resultsTab.title') }}</span>
      <b v-if="selectedConstituency"> — {{ selectedConstituency.name }}</b>
      <b v-else-if="selectedCounty"> — {{ selectedCounty.name }}</b>
    </div>
    <div class="mt-8 flex flex-col gap-2">
      <div>
        <span class="text-title-medium">{{ $t('resultsTab.totalVotersCount') }}: </span>
        <b>{{ selectedPlaceTotalVotersCount.toLocaleString() }}</b>
      </div>
      <div class="mt-4 text-title-medium">
        {{ $t('resultsTab.totalVotesCount') }}:
      </div>
      <div>
        <span class="text-title-small">{{ $t('resultsTab.constituenciesVotesCount') }}: </span>
        <b>{{ selectedPlaceCandidatesVotesCount.toLocaleString()  }}</b>
        ({{ selectedPlaceCandidatesVotesPercents }})
      </div>
      <div>
        <span class="text-title-small">{{ $t('resultsTab.partiesListsVotesCount') }}: </span>
        <b>{{ selectedPlacePartiesVotesCount.toLocaleString()  }}</b>
        ({{ selectedPlacePartiesVotesPercents }})
      </div>
    </div>
  </div>

  <div v-if="showStatisticsSection.votes" class="my-8"></div>
  <div v-if="showStatisticsSection.votes">
    <div class="px-4 mb-4 text-center text-headline-small text-uppercase">
      {{ $t('resultsTab.constituenciesTitle') }}
    </div>
    <div>
      <!-- <template v-if="!selectedCounty">
        Empty 1
      </template> -->
      <!-- <template
        v-else-if="!selectedConstituency"
        v-for="(constituency, i) in selectedCountyConstituenciesCandidatesResults"
      >
        <div>{{ constituency }}</div>
        <v-divider v-if="i < candidatesToDisplay.length - 1" />
      </template> -->
      <template v-if="!selectedConstituency">
        <div
          v-for="(constituencyResults, i) in candidatesToDisplay"
          class="mb-8"
        >
          <div
            class="w-[fit-content] px-4 cursor-pointer text-title-medium font-bold"
            @click="constituencyResults.onHeaderClick()"
          >
            {{ constituencyResults.constituencyName }}
          </div>
          <div v-if="constituencyResults.results.length > 0" class="px-4">
            <span>{{ $t('resultsTab.topTwoCandidatesDeltaCaption') }}: </span>
            <b>
              {{ constituencyResults.results[0].votes - constituencyResults.results[1].votes }}
            </b>
            <span> ({{ (constituencyResults.results[0].percents -  constituencyResults.results[1].percents).toFixed(2) }}%)</span>
          </div>
          <template v-for="(candidateResults, j) in constituencyResults.results">
            <CandidateResults
              class='px-4'
              :candidateResults="candidateResults"
              :isWinner="j === 0"
            />
          </template>
          <v-divider v-if="i < candidatesToDisplay.length - 1" />
        </div>
      </template>
      <template
        v-else
        v-for="(candidateResults, i) in candidatesToDisplay"
      >
        <CandidateResults
          class='px-4'
          :candidateResults="candidateResults"
          :isWinner="!selectedSettlement && !selectedPollingStation ? i === 0 : false"
        />
        <v-divider v-if="i < candidatesToDisplay.length - 1" />
      </template>
    </div>
  </div>

  <div v-if="showStatisticsSection.votes" class="my-8"></div>
  <div v-if="showStatisticsSection.votes">
    <div class="px-4 mb-4 text-center text-headline-small text-uppercase">
      {{ $t('resultsTab.partiesListsTitle') }}
    </div>
    <div>
      <template v-for="(partyResults, i) in partiesToDisplay">
        <PartyResults class='px-4' :partyResults="partyResults"/>
        <v-divider v-if="i < partiesToDisplay.length - 1" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import CandidateResults from '@/components/CandidateResults.vue';
import PartyResults from '@/components/PartyResults.vue';

import { showStatisticsSection } from '@/statistics';

import {
  counties,

  candidates,
  parties,
  candidateById,
  partyById,

  selectedCounty,
  selectedConstituency,
  selectedSettlement,
  selectedPollingStation,
} from '@/store';

function getSelectedPlaceTotalVotersCount() {
  const selectedCountyId = selectedCounty.value?.id;
  const selectedConstituencyId = selectedConstituency.value?.id;
  const selectedSettlementId = selectedSettlement.value?.id;
  const selectedPollingStationId = selectedPollingStation.value?.id;
  if (!selectedCountyId) {
    return counties.value.reduce((a, x) => a += x.calculateVoters() /*x.voters*/, 0); // + 496_286 - 70;
    // return counties.value.reduce((a, x) => a += x.voters, 0);
  } else {
    const county = counties.value.find((x) => selectedCountyId === x.id);
    if (!selectedConstituencyId && county) return county.calculateVoters(); //.voters;
    const constituency = county.constutuencyById(selectedConstituencyId);
    if (!selectedSettlementId && constituency) return constituency.calculateVoters(); //.voters;
    const settlement = constituency.settlementById(selectedSettlementId);
    if (!selectedPollingStationId && settlement) return settlement.calculateVoters(); //.voters;
    const pollingStation = settlement?.pollingStationById(selectedPollingStationId);
    return pollingStation?.voters ?? 0;
  }
}
const selectedPlaceTotalVotersCount = computed(() => {
  return getSelectedPlaceTotalVotersCount();
});



function getSelectedPlaceVotesCount(votesType: 'candidates' | 'parties') {
  return (!selectedCounty.value ? counties.value : [selectedCounty.value])
    .reduce((a, county) => a += county.getVotesCount({
      votesType: votesType,
      selectedConstituency: selectedConstituency.value,
      selectedSettlement: selectedSettlement.value,
      selectedPollingStation: selectedPollingStation.value,
    }), 0);
}

const selectedPlaceCandidatesVotesCount = computed(() => {
  return getSelectedPlaceVotesCount('candidates');
});
const selectedPlaceCandidatesVotesPercents = computed(() => {
  return `${(getSelectedPlaceVotesCount('candidates') / getSelectedPlaceTotalVotersCount() * 100).toFixed(2)}%`;
});

const selectedPlacePartiesVotesCount = computed(() => {
  return getSelectedPlaceVotesCount('parties');
});
const selectedPlacePartiesVotesPercents = computed(() => {
  return `${(getSelectedPlaceVotesCount('parties') / getSelectedPlaceTotalVotersCount() * 100).toFixed(2)}%`;
});



const selectedCountyConstituenciesCandidatesResults = computed(() => {
  const results = [];
  const constituencies = counties.value.find((county) => {
    return county.id === selectedCounty.value.id;
  }).constituencies;
  for (const constituency of constituencies) {
    results.push(constituency.name);
  }
  return results;
});


function constituencyCandidatesResults(constituency) {
  const results = {};
  let totalCandidatesVotes = 0;
  for (const [candidateId, candidateVotes] of Object.entries(constituency.getCandidatesResults({
    selectedSettlement: selectedSettlement.value,
    selectedPollingStation: selectedPollingStation.value,
  }))) {
    if (!results[candidateId]) {
      results[candidateId] = {candidate: candidateById(candidateId), votes: 0};
    }
    results[candidateId].votes += candidateVotes;
    totalCandidatesVotes += candidateVotes;
  }
  for (const [candidateId, candidateResults] of Object.entries(results)) {
    candidateResults.percents = candidateResults.votes / totalCandidatesVotes * 100;
  }
  return Object.values(results)
    .filter((x) => x.votes > 0)
    .sort((a, b) => a.votes < b.votes);
}

const candidatesToDisplay = computed(() => {
  if (selectedConstituency.value) {
    return constituencyCandidatesResults(selectedConstituency.value);
  } else if (selectedCounty.value) {
    const results = [];
    for (const constituency of selectedCounty.value.constituencies) {
      const constituencyResults = [];
      let i = 0;
      for (const candidateResults of constituencyCandidatesResults(constituency)) {
        constituencyResults.push(candidateResults);
        i++;
        if (i >= 2) break;
      }
      results.push({
        onHeaderClick: () => {
          selectedConstituency.value = constituency;
        },
        constituencyName: constituency.name,
        results: constituencyResults,
      });
    }
    return results;
  } else {
    const results = [];
    for (const county of counties.value) {
      for (const constituency of county.constituencies) {
        const constituencyResults = [];
        let i = 0;
        for (const candidateResults of constituencyCandidatesResults(constituency)) {
          constituencyResults.push(candidateResults);
          i++;
          if (i >= 2) break;
        }
        results.push({
          onHeaderClick: () => {
            selectedCounty.value = county;
            selectedConstituency.value = constituency;
          },
          constituencyName: constituency.name,
          results: constituencyResults,
        });
      }
    }
    return results;
  }
});

const partiesToDisplay = computed(() => {
  const results = {};
  let totalPartiesVotes = 0;
  const countiesToProcess = !selectedCounty.value
    ? counties.value
    : [selectedCounty.value];
  for (const county of countiesToProcess) {
    for (const [partyId, partyVotes] of Object.entries(county.getPartiesResults({
      selectedConstituency: selectedConstituency.value,
      selectedSettlement: selectedSettlement.value,
      selectedPollingStation: selectedPollingStation.value,
    }))) {
      if (!results[partyId]) {
        results[partyId] = {party: partyById(partyId), votes: 0};
      }
      results[partyId].votes += partyVotes;
      totalPartiesVotes += partyVotes;
    }
  }
  for (const [partyId, partyResults] of Object.entries(results)) {
    partyResults.percents = partyResults.votes / totalPartiesVotes * 100;
  }
  return Object.values(results)
    .filter((x) => x.party.isInPartyList ? x.votes > 0 : x.percents > 0.2688)
    .sort((a, b) => a.votes < b.votes);
});
</script>
