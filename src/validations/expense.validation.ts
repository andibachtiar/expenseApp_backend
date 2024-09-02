import Joi from "joi";
import { CurrencyService } from "../services/currency.service";
import { CurrencyModel } from "../models/currency.model";

export class ExpenseValidation {
  static async createValidate(body: any) {
    const currency: CurrencyModel[] =
      await CurrencyService.getAvaliableCurrency();
    const currencyInput = currency.map((item) => item.code);

    return await Joi.object({
      purpose: Joi.string().required(),
      nominal: Joi.number().min(0).max(10000000).required(),
      currency: Joi.string()
        .valid(...currencyInput)
        .required(),
      note: Joi.string().max(100).optional(),
    }).validateAsync(body);
  }
}
