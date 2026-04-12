export default class Api {
  // static baseURL = import.meta.env.VITE_API_BASE_URL;

  static async loadLastUpdatedDatetime() {
    try {
      const response = await fetch('data/last_updated_datetime.json');
      const data = await response.json();
      return data.last_updated_datetime;
    } catch (e) {
      console.log(e);
    }
  }

  static async loadLatestResults() {
    try {
      const response = await fetch('data/results_data.json');
      const data = await response.json();
      // const response = await fetch(`${Api.baseURL}/api/results/edf626f95530e3929b41cf96fe3d9e2b`);
      // const data = await response.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  }
}
