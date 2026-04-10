enum RegistrationStatus {
  registered,
  rejected,
}

enum PartyListType {
  party,
  nationality,
}

export default class Party {
  id: number;
  name: string;
  listType: PartyListType;
  status: RegistrationStatus;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.listType = data.list_type === 'party'
      ? PartyListType.party
      : PartyListType.nationality;
    this.status = data.status === 'registered'
      ? RegistrationStatus.registered
      : RegistrationStatus.rejected;
  }

  get color(): string {
    switch (this.name) {
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
    switch (this.name) {
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

  get isInPartyList(): boolean {
    return this.listType === PartyListType.party;
  }
}
