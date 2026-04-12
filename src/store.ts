import { ref, computed, watch } from "vue";
import { latLng } from "leaflet";

import {
  countiesPolygons,
  constituenciesPolygons,
  pollingStationsPolygons,
  clearPolygonsLists,
  loadCountiesPolygons,
  loadCountyPolygons,
  defaultZoom,
  defaultCenter,
} from '@/polygons';

import {
  recalculateTotalStatistics,
  load2022Turnouts,
} from '@/statistics';

import Api from '@/api';

import Candidate from "@/models/Candidate";
import Party from "@/models/Party";
import County from "@/models/County";
import LoaderData from "@/models/LoaderData";


const TISZA_ID = "3600";
const FIDESZ_ID = "3644";
const MH_ID = "3592";
const CHOSEN_PARTIES_IDS = [TISZA_ID, FIDESZ_ID, MH_ID];

const loader = ref(new LoaderData({incrementStep: 5 / 100 * 100}));
const mapRef = ref();

const selectedCounty = ref();
const selectedConstituency = ref();
const selectedSettlement = ref();
const selectedPollingStation = ref();
const selectedPollingStationFull = ref();

function moveMapTo(
  {center, zoom, currentZoomAsMax = false}:
  {center: number, zoom: number, currentZoomAsMax: boolean},
) {
  mapRef.value?.leafletObject.setView(
    center,
    currentZoomAsMax ? Math.max(zoom, mapRef.value.leafletObject._zoom) : zoom,
    {animate: true},
  );
}

watch(selectedCounty, (newValue, oldValue) => {
  if (oldValue) {
    if (selectedConstituency.value) selectedConstituency.value = null;
    if (selectedSettlement.value) selectedSettlement.value = null;
    if (selectedPollingStation.value) selectedPollingStation.value = null;
  }
  if (newValue) {
    const countyPolygon = countiesPolygons.find((c) => newValue.id === c.id);
    moveMapTo({center: countyPolygon.center, zoom: newValue.id === '01' ? 10 : 8});
  } else {
    moveMapTo({center: defaultCenter, zoom: defaultZoom});
  }
});

watch(selectedConstituency, (newValue, oldValue) => {
  if (!newValue) {
    if (selectedSettlement.value) selectedSettlement.value = null;
    if (selectedPollingStation.value) selectedPollingStation.value = null;
    if (selectedCounty.value) {
      const selectedCountyId = selectedCounty.value.id;
      const countyPolygon = countiesPolygons.find((c) => selectedCountyId === c.id);
      moveMapTo({center: countyPolygon.center, zoom: selectedCountyId === '01' ? 10 : 8});
    }
  } else if (!selectedCounty.value) {
    selectedCounty.value = counties.value.find((county) => {
      return county.constituencies.find((constituency) => {
        return newValue.name === constituency.name;
      });
    });
  } else {
    if (selectedSettlement.value) selectedSettlement.value = null;
    if (selectedPollingStation.value) selectedPollingStation.value = null;
  }
  if (newValue) {
    const constituencyPolygon = constituenciesPolygons.find((c) => {
      return selectedCounty.value.id === c.countyId && newValue.id === c.id;
    });
    moveMapTo({
      center: constituencyPolygon.center,
      zoom: constituencyPolygon.countyId === '01' ? 12 : 9,
    });
  }
});

watch(selectedSettlement, (newValue, oldValue) => {
  if (oldValue && selectedPollingStation.value) selectedPollingStation.value = null;
  if (newValue) {
    const settlement = counties.value
      .find((county) => selectedCounty.value.id === county.id)
      .constituencies.find((constituency) => selectedConstituency.value.id === constituency.id)
      .settlements.find((settlement) => selectedSettlement.value.id === settlement.id);
    if (settlement && settlement.pollingStations.length === 1) {
      selectedPollingStation.value = settlement.pollingStations[0];
      const pollingStationPolygon = pollingStationsPolygons.find((x) => {
        return selectedCounty.value.id === x.countyId &&
          selectedConstituency.value.id == x.constituencyId &&
          newValue.id === x.settlementId &&
          selectedPollingStation.value.id === x.id;
      });
      if (pollingStationPolygon) {
        moveMapTo({center: pollingStationPolygon.center, zoom: 12, currentZoomAsMax: true});
      }
    } else {
      const firstPollingStationPolygon = pollingStationsPolygons.find((x) => {
        return selectedCounty.value.id === x.countyId &&
          selectedConstituency.value.id == x.constituencyId &&
          newValue.id === x.settlementId;
      });
      if (firstPollingStationPolygon) {
        moveMapTo({center: firstPollingStationPolygon.center, zoom: 12, currentZoomAsMax: true});
      }
    }
  }
});

watch(selectedPollingStation, (newValue, oldValue) => {
  if (newValue) {
    const pollingStationPolygon = pollingStationsPolygons.find((x) => {
      return selectedCounty.value.id === x.countyId &&
        selectedConstituency.value.id == x.constituencyId &&
        selectedSettlement.value?.id === x.settlementId &&
        newValue.id === x.id;
    });
    if (pollingStationPolygon) {
      moveMapTo({
        center: pollingStationPolygon.center,
        zoom: 12,
        currentZoomAsMax: true,
      });
    }
  } else if (!newValue && selectedSettlement.value?.pollingStations.length === 1) {
    selectedSettlement.value = null;
  }
})


const counties = ref([]);
async function loadElectoralData() {
  const response = await fetch('data/electoral.json');
  const data = await response.json();
  counties.value = data['counties'].map((x) => new County(x));
  loader.value.increment();
}

const candidates = ref([]);
async function loadCandidatesData() {
  const response = await fetch('data/candidates.json');
  const data = await response.json();
  candidates.value = data['candidates'].map((x) => new Candidate(x));
  loader.value.increment();
}

const parties = ref([]);
async function loadPartiesData() {
  const response = await fetch('data/list_parties.json');
  const data = await response.json();
  parties.value = data['list_parties'].map((x) => new Party(x));
  loader.value.increment();
}

function candidateById(candidateId: string) {
  return candidates.value.find((c) => Number(candidateId) === c.id);
}

function partyById(partyId: string) {
  return parties.value.find((p) => Number(partyId) === p.id);
}

function countyById(countyId: string) {
  return counties.value.find((c) => countyId === c.id);
}

const turnoutPercents = ref(0.0);
function recalculateTurnoutPercents() {
  const totalVotes = counties.value.reduce((a, county) => {
    return a += county.getVotesCount({votesType: 'parties'});
  }, 0);
  const totalVoters = counties.value.reduce((a, county) => {
    return a += county.voters;
  }, 0) + 496_286 - 70;
  turnoutPercents.value = totalVotes / totalVoters * 100;
}

function recalculatePolygonColors() {
  for (const polygon of countiesPolygons) {
    const county = countyById(polygon.id);
    const results = county.getPartiesResults({});
    let maxVotes = 0;
    let maxVotesPartyId = null;
    for (const [partyId, votes] of Object.entries(results)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        maxVotesPartyId = partyId;
      }
    }
    const party = partyById(maxVotesPartyId);
    polygon.color = party
      ? `var(${party.colorVar})`
      : 'var(--default-party-color)';
  }

  for (const polygon of constituenciesPolygons) {
    const constituency = counties.value.find((x) => polygon.countyId === x.id)
      .constituencies.find((x) => polygon.id === x.id);
    const results = constituency.getCandidatesResults({});
    let maxVotes = 0;
    let maxVotesCandidateId = null;
    for (const [candidateId, votes] of Object.entries(results)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        maxVotesCandidateId = candidateId;
      }
    }
    const candidate = candidateById(maxVotesCandidateId);
    polygon.color = candidate
      ? `var(${candidate.colorVar})`
      : 'var(--default-party-color)';
  }

  for (const polygon of pollingStationsPolygons) {
    const county = counties.value.find((x) => polygon.countyId === x.id);
    const pollingStation = county.findPollingStation({
      constituencyId: polygon.constituencyId,
      settlementId: polygon.settlementId,
      pollingStationId: polygon.id,
    });
    let maxVotes = 0;
    let maxVotesCandidateId = null;
    for (const [candidateId, votes] of Object.entries(pollingStation.candidatesVotes)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        maxVotesCandidateId = candidateId;
      }
    }
    const candidate = candidateById(maxVotesCandidateId);
    polygon.color = candidate
      ? `var(${candidate.colorVar})`
      : 'var(--default-party-color)';
  }
}

const mandates = ref([
  {"seats": 199, "color": "var(--default-party-color)"},
]);
function recalculateMandates() {
  let mandatesRemains = 199;
  const mandatesResults = {};
  const partiesVotes = {};
  const partiesSurplusVotes = {};
  let totalPartiesVotes = 0;

  for (const county of counties.value) {
    for (const constituency of county.constituencies) {
      let constituencyResults = {};
      for (const [cId, cVotes] of Object.entries(constituency.getCandidatesResults({}))) {
        if (!constituencyResults[cId]) {
          constituencyResults[cId] = {candidate: candidateById(cId), votes: 0};
        }
        constituencyResults[cId].votes += cVotes;
      }
      constituencyResults = Object.values(constituencyResults)
        .sort((a, b) => a.votes < b.votes);
      for (let i = 0; i < constituencyResults.length; i++) {
        const candidate = constituencyResults[i].candidate;
        const candidateVotes = constituencyResults[i].votes;
        if (i === 0) {
          // Process winner candidate
          if (!mandatesResults[candidate.partyId]) {
            mandatesResults[candidate.partyId] = 0;
          }
          mandatesResults[candidate.partyId]++;
          mandatesRemains--;
        }
        if (!partiesSurplusVotes[candidate.partyId]) {
          partiesSurplusVotes[candidate.partyId] = 0;
        }
        if (i === 0) {
          const secondPlaceVotes = constituencyResults[i + 1].votes
          partiesSurplusVotes[candidate.partyId] += candidateVotes - secondPlaceVotes + 1;
        } else {
          partiesSurplusVotes[candidate.partyId] += candidateVotes;
        }
      }
    }
    for (const [pId, pVotes] of Object.entries(county.getPartiesResults({}))) {
      if (!partiesVotes[pId]) {
        partiesVotes[pId] = {party: partyById(pId), votes: 0};
      }
      partiesVotes[pId].votes += pVotes;
      // if (partiesSurplusVotes[pId]) {
      //   partiesVotes[pId].votes += partiesSurplusVotes[pId];
      // }
      totalPartiesVotes += pVotes;
    }
  }

  // First check minorities parties for possible mandates
  const minoritiesResults = Object.values(partiesVotes)
    .filter((x) => !x.party.isInPartyList)
    .sort((a, b) => a.votes < b.votes);
  for (const partyResult of minoritiesResults) {
    const partyId = partyResult.party.id;
    const partyVotes = partyResult.votes;
    const partyPercents = partyVotes / totalPartiesVotes * 100;
    const minorityQuotaThreshold = 1 / 372 * 100;
    if (partyPercents >= minorityQuotaThreshold) {
      if (!mandatesResults[partyId]) {
        mandatesResults[partyId] = 0;
      }
      mandatesResults[partyId]++;
      mandatesRemains--;
    }
  }

  // Then process all another parties
  const partiesPlusSurplusResults = Object.values(partiesVotes)
    .filter((x) => x.party.isInPartyList && (x.votes / totalPartiesVotes) >= 0.05)
    .sort((a, b) => a.votes < b.votes)
    .map((x) => {
      x.votes += partiesSurplusVotes[x.party.id];
      return x;
    });
  const dHondtCasted = {};
  for (const partyResult of partiesPlusSurplusResults) {
    dHondtCasted[partyResult.party.id] = 0
  }
  while (mandatesRemains > 0) {
    let maxVotesPartyId = null;
    let maxVotes = 0;
    for (const partyResult of partiesPlusSurplusResults) {
      const partyId = partyResult.party.id;
      const votes = partyResult.votes / (dHondtCasted[partyId] + 1);
      if (votes > maxVotes) {
        maxVotes = votes;
        maxVotesPartyId = partyId;
      }
    }
    dHondtCasted[maxVotesPartyId]++;
    if (!mandatesResults[maxVotesPartyId]) {
      mandatesResults[maxVotesPartyId] = 0;
    }
    mandatesResults[maxVotesPartyId]++;
    mandatesRemains--;
  }

  mandates.value = Object.entries(mandatesResults).map((partyMandates) => {
    const partyId = partyMandates[0];
    const mandates = partyMandates[1];
    const party = partyById(partyId);
    const partyColor = !party ? 'var(--default-party-color)' : `var(${party.colorVar})`;
    return {"seats": mandates, "color": partyColor, party: party};
  })
};

async function loadLatestResults() {
  const data = await Api.loadLatestResults();
  if (!data) return;
  for (const [countyId, countyResultsData] of Object.entries(data)) {
    countyById(countyId).applyResults(countyResultsData);
  }
  recalculateTurnoutPercents();
  recalculatePolygonColors();
  recalculateMandates();
  recalculateTotalStatistics();
  loader.value.increment();
}

async function initUpdatesChecker() {
  const lastUpdatedDatetime = await Api.loadLastUpdatedDatetime();
  localStorage.setItem('lastUpdatedDatetime', lastUpdatedDatetime);
  const CHECK_INTERVAL_TIME = 1000 * 60 * 5; // Every 5 minutes
  setInterval(async () => {
    try {
      const lastUpdatedDatetime = await Api.loadLastUpdatedDatetime();
      if (lastUpdatedDatetime !== localStorage.getItem('lastUpdatedDatetime')) {
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
    }
  }, CHECK_INTERVAL_TIME);
}

async function loadData() {
  loader.value.reset();
  loader.value.isVisible = true;

  if (countiesPolygons.length > 0) {
    clearPolygonsLists();
  }

  await Promise.all([
    loadElectoralData(),
    loadCandidatesData(),
    loadPartiesData(),
    loadCountiesPolygons(),
    load2022Turnouts(),
  ]);

  let promises = [];
  for (let i = 1; i <= 20; i++) {
    const countyId = i.toString().padStart(2, '0');
    promises.push(loadCountyPolygons(countyId));
    if (promises.length >= 4) {
      await Promise.all(promises);
      promises = [];
    }
  }


  const params = new URLSearchParams(document.location.search);
  if (params.has('withResults')) {
    await loadLatestResults();
  }
  loader.value.isVisible = false;
  loader.value.reset();

  await initUpdatesChecker();
}

export {
  loadData,

  TISZA_ID,
  FIDESZ_ID,
  MH_ID,
  CHOSEN_PARTIES_IDS,

  loader,
  mapRef,
  mandates,
  counties,
  candidates,
  parties,
  candidateById,
  partyById,

  turnoutPercents,

  selectedCounty,
  selectedConstituency,
  selectedSettlement,
  selectedPollingStation,
}
