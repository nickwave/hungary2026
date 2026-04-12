import Settlement from '@/models/Settlement';
import PollingStation from '@/models/PollingStation';

export default class Constituency {
  id: string;
  name: string;
  voters: number;
  settlements: Settlement[];

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.voters = data.voters;
    this.settlements = data.settlements.map((x) => new Settlement(x));
  }

  findSettlement({
    settlementId,
  } : {
    settlementId: string,
  }): Settlement | undefined {
    for (const settlement of this.settlements) {
      if (settlementId === settlement.id) {
        return settlement;
      }
    }
    return undefined;
  }

  findPollingStation({
    settlementId,
    pollingStationId,
  } : {
    settlementId: string,
    pollingStationId: string,
  }): PollingStation | undefined {
    for (const settlement of this.settlements) {
      if (settlementId === settlement.id) {
        const pollingStation = settlement.findPollingStation({pollingStationId});
        if (pollingStation) {
          return pollingStation;
        }
      }
    }
    return undefined;
  }

  settlementById(settlementId: string) {
    return this.settlements.find((s) => settlementId === s.id);
  }

  applyResults(resultsData) {
    for (const [settlementId, settlementResultsData] of Object.entries(resultsData)) {
      this.settlementById(settlementId).applyResults(settlementResultsData);
    }
  }

  getVotesCount({
    votesType,
    selectedSettlement,
    selectedPollingStation,
  } : {
    votesType: 'candidates' | 'parties',
    selectedSettlement?: Settlement,
    selectedPollingStation?: PollingStation,
  }) {
    const settlementsToProcess = !selectedSettlement
      ? this.settlements
      : [selectedSettlement];
    return settlementsToProcess.reduce((a, settlement) => {
      return a += settlement.getVotesCount({votesType, selectedPollingStation});
    }, 0);
  }

  getCandidatesResults({
    selectedSettlement,
    selectedPollingStation,
    candidatesIdsFilter,
  } : {
    selectedSettlement?: Settlement,
    selectedPollingStation?: PollingStation,
    candidatesIdsFilter?: number[],
  }) : Record<string, number> {
    const results = {};
    const settlementsToProcess = !selectedSettlement
      ? this.settlements
      : [selectedSettlement];
    for (const settlement of settlementsToProcess) {
      for (const [candidateId, candidateVotes] of Object.entries(settlement.getCandidatesResults({
        selectedPollingStation,
        candidatesIdsFilter,
      }))) {
        if (!results[candidateId]) {
          results[candidateId] = 0;
        }
        results[candidateId] += candidateVotes;
      }
    }
    return results;
  }

  getPartiesResults({
    selectedSettlement,
    selectedPollingStation,
    partiesIdsFilter,
  } : {
    selectedSettlement?: Settlement,
    selectedPollingStation?: PollingStation,
    partiesIdsFilter?: number[],
  }) : Record<string, number> {
    const results = {};
    const settlementsToProcess = !selectedSettlement
      ? this.settlements
      : [selectedSettlement];
    for (const settlement of settlementsToProcess) {
      for (const [partyId, partyVotes] of Object.entries(settlement.getPartiesResults({
        selectedPollingStation,
        partiesIdsFilter,
      }))) {
        if (!results[partyId]) {
          results[partyId] = 0;
        }
        results[partyId] += partyVotes;
      }
    }
    return results;
  }
}
