import { ref } from "vue";

import {
  CHOSEN_PARTIES_IDS,
  loader,
  turnoutPercents,
  counties,
  candidates,
} from '@/store';

import Statistics from '@/models/Statistics';

const showStatisticsSection = ref({
  turnout: false,
  votes: false,
});
const countiesTurnoutStatistics = ref({});
const countiesCandidatesStatistics = ref({});
const countiesPartiesStatistics = ref({});
const turnouts2022 = ref({});
const turnouts2026 = ref({});

function calculateStatistics(x: number, values: number[]) : Statistics {
  const stats = new Statistics();
  stats.x = x;
  stats.n = values.length;

  stats.min = values[0];
  stats.max = values[0];

  let sum = 0;
  for (const x_i of values) {
    if (x_i < stats.min) stats.min = x_i;
    if (x_i > stats.max) stats.max = x_i;
    sum += x_i;
  }

  stats.mean = sum / stats.n;
  stats.standartDeviation = Math.sqrt(
    values.reduce((a, x_i) => Math.pow(x_i - stats.mean, 2), 0) / stats.n
  );
  stats.zScore = (stats.x - stats.mean) / stats.standartDeviation;

  return stats;
}

async function recalculateTotalStatistics() {
  const countiesTurnouts = [];
  const countiesCandidatesResults = [];
  const countiesPartiesResults = {};
  for (const county of counties.value) {
    // TURNOUT CALCULATIONS
    const countyPariesVotes = county.getVotesCount({'votesType': 'parties'});
    const countyCandidatesVotes = county.getVotesCount({'votesType': 'candidates'});
    const countyTurnout = countyPariesVotes / county.voters * 100;
    countiesTurnouts.push(countyTurnout);

    // CANDIDATES CALCULATIONS
    const countyCandidates = candidates.value.filter((x) => {
      return CHOSEN_PARTIES_IDS.includes(`${x.partyId}`) && county.id === x.maz;
    });
    const countyCandidatesIds = countyCandidates.map((x) => `${x.id}`);
    const countyCandidatesResults = county.getCandidatesResults({
      candidatesIdsFilter: countyCandidatesIds,
    });
    const partyCandidatesResult = {};
    for (const [candidateId, votes] of Object.entries(countyCandidatesResults)) {
      const candidateResult = votes / countyCandidatesVotes * 100;
      const partyId = countyCandidates.find((x) => candidateId === `${x.id}`).partyId;
      if (!partyCandidatesResult[partyId]) {
        partyCandidatesResult[partyId] = 0;
      }
      partyCandidatesResult[partyId] += candidateResult;
    }
    for (const [partyId, resultsPercents] of Object.entries(partyCandidatesResult)) {
      if (!countiesCandidatesResults[partyId]) {
        countiesCandidatesResults[partyId] = [];
      }
      countiesCandidatesResults[partyId].push(resultsPercents);
    }

    // PARTIES CALCULATIONS
    const countyPartiesResults = county.getPartiesResults({
      partiesIdsFilter: CHOSEN_PARTIES_IDS,
    });
    for (const [partyId, votes] of Object.entries(countyPartiesResults)) {
      const partyResult = votes / countyPariesVotes * 100;
      if (!countiesPartiesResults[partyId]) {
        countiesPartiesResults[partyId] = [];
      }
      countiesPartiesResults[partyId].push(partyResult);
    }
  }

  let i = 0;
  for (const county of counties.value) {
    // TURNOUT CALCULATIONS
    countiesTurnoutStatistics.value[county.id] = calculateStatistics(
      countiesTurnouts[i],
      countiesTurnouts,
    );

    // CANDIDATES CALCULATIONS
    const countyCandidatesStatistics = {};
    for (const partyId of CHOSEN_PARTIES_IDS) {
      if (countiesCandidatesResults[partyId]) {
        countyCandidatesStatistics[partyId] = calculateStatistics(
          countiesCandidatesResults[partyId][i],
          countiesCandidatesResults[partyId],
        );
      }
    }
    countiesCandidatesStatistics.value[county.id] = countyCandidatesStatistics;

    // PARTIES CALCULATIONS
    const countyPartiesStatistics = {};
    for (const partyId of CHOSEN_PARTIES_IDS) {
      if (countiesPartiesResults[partyId]) {
        countyPartiesStatistics[partyId] = calculateStatistics(
          countiesPartiesResults[partyId][i],
          countiesPartiesResults[partyId],
        );
      }
    }
    countiesPartiesStatistics.value[county.id] = countyPartiesStatistics;

    i++;
  }



  if (Object.keys(countiesTurnouts).length > 0) {
    showStatisticsSection.value.turnout = true;
  }
  if (Object.keys(countiesPartiesResults).length > 0) {
    showStatisticsSection.value.votes = true;
  }
}

async function load2022Turnouts() {
  const response = await fetch('data/2022_turnout.json');
  const data = await response.json();
  if (data.counties) {
    turnouts2022.value = data.counties;
  }
  loader.value.increment();
}

async function load2026Turnouts() {
  const response = await fetch('data/2026_turnout.json');
  const data = await response.json();
  if (data.counties) {
    turnouts2026.value = data;

    const lastGlobalTurnout = Object.values(turnouts2026.value.global_turnouts).pop();
    turnoutPercents.value = lastGlobalTurnout;
  }
  loader.value.increment();
}

export {
  showStatisticsSection,
  countiesTurnoutStatistics,
  countiesCandidatesStatistics,
  countiesPartiesStatistics,
  turnouts2022,
  turnouts2026,
  calculateStatistics,
  recalculateTotalStatistics,
  load2022Turnouts,
  load2026Turnouts,
}
