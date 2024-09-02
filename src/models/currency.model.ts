import { mongodb } from "../services/mongodb.service";

export type CurrencyModel = {
  code: string;
  name: string;
  symbol: string[];
};

const currencySchema = new mongodb.Schema({
  code: {
    type: String,
    unique: true,
  },
  name: String,
  symbol: [String],
});

export const Currency = mongodb.model("Currency", currencySchema);
