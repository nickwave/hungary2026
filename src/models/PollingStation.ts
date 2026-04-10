export default class PollingStation {
  id: string;
  name: string;
  voters: number;
  candidatesVotes: Record<string, number>;
  candidatesPercents: Record<string, number>;
  partiesVotes: Record<string, number>;
  partiesPercents: Record<string, number>;

  constructor(data) {
    this.id = data.id;
    this.name = data.id;
    this.voters = data.voters;
    this.candidatesVotes = {};
    this.candidatesPercents = {};
    this.partiesVotes = {};
    this.partiesPercents = {};
  }

  applyResults(resultsData) {
    const candidatesVotesSum = Object.values(resultsData.c).reduce((s, a) => s + a, 0);
    for (const [candidateId, candidateVotes] of Object.entries(resultsData.c)) {
      this.candidatesVotes[candidateId] = candidateVotes;
      this.candidatesPercents[candidateId] = candidateVotes / candidatesVotesSum * 100;
    }
    const partiesVotesSum = Object.values(resultsData.p).reduce((s, a) => s + a, 0);
    for (const [partyId, partyVotes] of Object.entries(resultsData.p)) {
      this.partiesVotes[partyId] = partyVotes;
      this.partiesPercents[partyId] = partyVotes / partiesVotesSum * 100;
    }
  }
}
