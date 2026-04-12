import PollingStation from '@/models/PollingStation';

export default class Settlement {
  id: string;
  name: string;
  voters: number;
  pollingStations: PollingStation[];

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.voters = data.voters;
    this.pollingStations = data.polling_stations.map((x) => new PollingStation(x));
  }

  calculateVoters() {
    return this.pollingStations.reduce((a, x) => a + x.voters, 0);
  }

  findPollingStation({
    pollingStationId,
  } : {
    pollingStationId: string,
  }): PollingStation | undefined {
    for (const pollingStation of this.pollingStations) {
      if (pollingStationId === pollingStation.id) {
        return pollingStation;
      }
    }
    return undefined;
  }

  pollingStationById(pollingStationId: string) {
    return this.pollingStations.find((ps) => pollingStationId === ps.id);
  }

  applyResults(resultsData) {
    for (const [pollingStationId, pollingStationResultsData] of Object.entries(resultsData)) {
      const pollingStation = this.pollingStationById(pollingStationId);
      if (pollingStation) {
        pollingStation.applyResults(pollingStationResultsData);
      } else {
        // console.log(['ERROR', pollingStationId, resultsData]);
      }
    }
  }

  getVotesCount({
    votesType,
    selectedPollingStation,
  } : {
    votesType: 'candidates' | 'parties',
    selectedPollingStation?: PollingStation,
  }) {
    const pollingStationsToProcess = !selectedPollingStation
      ? this.pollingStations
      : [selectedPollingStation];
    return pollingStationsToProcess.reduce((a1, pollingStation) => {
      if (pollingStation.hasOnlyTotalVotes) {
        return a1 + pollingStation.votes;
      } else if (votesType === 'candidates') {
        return Object.values(pollingStation.candidatesVotes).reduce((a2, v) => a2 + v, a1);
      } else if (votesType === 'parties') {
        return Object.values(pollingStation.partiesVotes).reduce((a2, v) => a2 + v, a1);
      }
    }, 0);
  }

  getCandidatesResults({
    selectedPollingStation,
    candidatesIdsFilter,
  } : {
    selectedPollingStation?: PollingStation,
    candidatesIdsFilter?: number[],
  }) : Record<string, number> {
    const results = {};
    const pollingStationsToProcess = !selectedPollingStation
      ? this.pollingStations
      : [selectedPollingStation];
    for (const pollingStation of pollingStationsToProcess) {
      for (const [candidateId, candidateVotes] of Object.entries(pollingStation.candidatesVotes)) {
        if (candidatesIdsFilter && !candidatesIdsFilter.includes(candidateId)) {
          continue;
        }
        if (!results[candidateId]) {
          results[candidateId] = 0;
        }
        results[candidateId] += candidateVotes;
      }
    }
    return results;
  }

  getPartiesResults({
    selectedPollingStation,
    partiesIdsFilter,
  } : {
    selectedPollingStation?: PollingStation,
    partiesIdsFilter?: number[],
  }) : Record<string, number> {
    const results = {};
    const pollingStationsToProcess = !selectedPollingStation
      ? this.pollingStations
      : [selectedPollingStation];
    for (const pollingStation of pollingStationsToProcess) {
      for (const [partyId, partyVotes] of Object.entries(pollingStation.partiesVotes)) {
        if (partiesIdsFilter && !partiesIdsFilter.includes(partyId)) {
          continue;
        }
        if (!results[partyId]) {
          results[partyId] = 0;
        }
        results[partyId] += partyVotes;
      }
    }
    return results;
  }
}
