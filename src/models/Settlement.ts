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
      this.pollingStationById(pollingStationId).applyResults(pollingStationResultsData);
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
      if (votesType === 'candidates') {
        return Object.values(pollingStation.candidatesVotes).reduce((a2, v) => a2 + v, a1);
      } else if (votesType === 'parties') {        
        return Object.values(pollingStation.partiesVotes).reduce((a2, v) => a2 + v, a1);
      }
      // for (const votes of Object.values(pollingStation.partiesVotes)) {
      //   a += votes;
      // }
      // return a;
    }, 0);
  }

  getCandidatesResults({
    selectedPollingStation,
  } : {
    selectedPollingStation?: PollingStation,
  }) : Record<string, number> {
    const results = {};
    const pollingStationsToProcess = !selectedPollingStation
      ? this.pollingStations
      : [selectedPollingStation];
    for (const pollingStation of pollingStationsToProcess) {
      for (const [candidateId, candidateVotes] of Object.entries(pollingStation.candidatesVotes)) {
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
  } : {
    selectedPollingStation?: PollingStation,
  }) : Record<string, number> {
    const results = {};
    const pollingStationsToProcess = !selectedPollingStation
      ? this.pollingStations
      : [selectedPollingStation];
    for (const pollingStation of pollingStationsToProcess) {
      for (const [partyId, partyVotes] of Object.entries(pollingStation.partiesVotes)) {
        if (!results[partyId]) {
          results[partyId] = 0;
        }
        results[partyId] += partyVotes;
      }
    }
    return results;
  }
}
