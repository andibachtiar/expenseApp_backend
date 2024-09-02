import { Currency, CurrencyModel } from "../models/currency.model";
import { ApiService } from "./api.service";

export class CurrencyService {
  static async getAvaliableCurrency<T>(): Promise<T> {
    const validCurrency = await Currency.find().exec();

    return validCurrency as T;
  }
}
