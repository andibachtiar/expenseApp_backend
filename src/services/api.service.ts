import { fetchData } from "./fetch.service";

export class ApiService {
  constructor(public url: string, public currency: string = "idr") {}

  async getExchange(nominal: number, exchangeTo: string = "idr") {
    const currencyExchange = await fetchData(this.url);
    const exchangeRate: number = currencyExchange[this.currency][exchangeTo];

    return Math.floor(exchangeRate) * nominal;
  }
}
