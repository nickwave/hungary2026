import Constituency from '@/models/Constituency';
import Settlement from '@/models/Settlement';
import PollingStation from '@/models/PollingStation';

export default class County {
  id: string;
  name: string;
  voters: number;
  constituencies: Constituency[];

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.voters = data.voters;
    this.constituencies = data.constituencies.map((x) => new Constituency(x));
  }

  findSettlement({
    constituencyId,
    settlementId,
  } : {
    constituencyId: string,
    settlementId: string,
  }): Settlement | undefined {
    for (const constituency of this.constituencies) {
      if (constituencyId === constituency.id) {
        const settlement = constituency.findSettlement({settlementId});
        if (settlement) {
          return settlement;
        }
      }
    }
    return undefined;
  }

  findPollingStation({
    constituencyId,
    settlementId,
    pollingStationId,
  } : {
    constituencyId: string,
    settlementId: string,
    pollingStationId: string,
  }): PollingStation | undefined {
    for (const constituency of this.constituencies) {
      if (constituencyId === constituency.id) {
        const pollingStation = constituency.findPollingStation({
          settlementId,
          pollingStationId,
        });
        if (pollingStation) {
          return pollingStation;
        }
      }
    }
    return undefined;
  }

  constutuencyById(constituencyId: string) {
    return this.constituencies.find((c) => constituencyId === c.id);
  }

  applyResults(resultsData) {
    for (const [constutuencyId, constutuencyResultsData] of Object.entries(resultsData)) {
      this.constutuencyById(constutuencyId).applyResults(constutuencyResultsData);
    }
  }

  getVotesCount({
    votesType,
    selectedConstituency,
    selectedSettlement,
    selectedPollingStation,
  } : {
    votesType: 'candidates' | 'parties',
    selectedConstituency?: Constituency,
    selectedSettlement?: Settlement,
    selectedPollingStation?: PollingStation,
  }) {
    const constituenciesToProcess = !selectedConstituency
      ? this.constituencies
      : [selectedConstituency];
    return constituenciesToProcess.reduce((a, constituency) => {
      return a += constituency.getVotesCount({
        votesType,
        selectedSettlement,
        selectedPollingStation,
      });
    }, 0);
  }

  getPartiesResults({
    selectedConstituency,
    selectedSettlement,
    selectedPollingStation,
  } : {
    selectedConstituency?: Constituency,
    selectedSettlement?: Settlement,
    selectedPollingStation?: PollingStation,
  }) : Record<string, number> {
    const results = {};
    const constituenciesToProcess = !selectedConstituency
      ? this.constituencies
      : [selectedConstituency];
    for (const constituency of constituenciesToProcess) {
      for (const [partyId, partyVotes] of Object.entries(constituency.getPartiesResults({
        selectedSettlement,
        selectedPollingStation,
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
