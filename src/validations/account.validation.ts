import Joi, { valid } from "joi";
import { Currency } from "../models/currency.model";

export class AccountValidation {
  private static async validCurrency(currency: string): Promise<string[]> {
    const validCurrency = await Currency.findOne({
      code: currency,
    }).exec();

    if (validCurrency) {
      return validCurrency.symbol;
    }
    return [];
  }

  static async avaliableCurrency() {
    const currencies = await Currency.find(
      {},
      {
        code: 1,
      }
    ).exec();

    return currencies.map((item) => item.code);
  }

  static async createValidation(body: any) {
    const currency = await AccountValidation.avaliableCurrency();

    return await Joi.object({
      name: Joi.string().trim().required(),
      purpose: Joi.string().trim().valid("new account").required(),
      nominal: Joi.number().optional(),
      currency: Joi.string()
        .trim()
        .valid(...currency)
        .required(),
    }).validateAsync(body);
  }

  static async mutateValidation(body: any) {
    const currency = await AccountValidation.avaliableCurrency();

    return await Joi.object({
      name: Joi.string().trim().optional(),
      purpose: Joi.string().trim().valid("topup", "withdrawal").required(),
      nominal: Joi.number().min(0).required(),
      currency: Joi.string()
        .valid(...currency)
        .required(),
    }).validateAsync(body);
  }
}
