enum RegistrationStatus {
  registered,
  rejected,
}

export default class Candidate {
  id: number;
  name: string;
  maz: string;
  evk: string;
  partyName: string;
  partyId: number;
  nominationParties: number[];
  status: RegistrationStatus;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.maz = data.maz;
    this.evk = data.evk;
    this.partyName = data.party_name;
    this.partyId = data.list_party;
    this.nominationParties = data.nomination_parties;
    this.status = data.status === 'registered'
      ? RegistrationStatus.registered
      : RegistrationStatus.rejected;
  }

  get color(): string {
    switch (this.partyName) {
      case 'FIDESZ-KDNP': return 'fidesz-colors';
      case 'TISZA': return 'tisza-colors';
      case 'DK': return 'dk-colors';
      case 'Mi Hazánk': return 'mi-hazank-colors';
      case 'MKKP': return 'mkkp-colors';
      case 'Jobbik': return 'jobbik-colors';
      case 'A SZOLIDARITÁS PÁRTJA-Munkáspárt': return 'szolidaritas-partja-colors';
      case 'Független jelölt': return 'fuggetlen-jelolt-colors';
      default: return 'default-party-colors';
    }
  }

  get colorVar(): string {
    switch (this.partyName) {
      case 'FIDESZ-KDNP': return '--fidesz-color';
      case 'TISZA': return '--tisza-color';
      case 'DK': return '--dk-color';
      case 'Mi Hazánk': return '--mi-hazank-color';
      case 'MKKP': return '--mkkp-color';
      case 'Jobbik': return '--jobbik-color';
      case 'A SZOLIDARITÁS PÁRTJA-Munkáspárt': return '--szolidaritas-partja-color';
      case 'Független jelölt': return '--fuggetlen-jelolt-color';
      default: return '--default-party-color';
    }
  }

  get isRegistered(): boolean {
    return this.status === RegistrationStatus.registered;
  }

  get isRejected(): boolean {
    return this.status === RegistrationStatus.rejected;
  }
}
