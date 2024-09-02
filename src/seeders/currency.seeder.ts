import { Currency } from "../models/currency.model";

export const seed = async () => {
  await Currency.deleteMany({ name: { $exists: true } });

  await Currency.create([
    {
      code: "idr",
      name: "Indonesian rupiah",
      symbol: ["Rp"],
    },
    {
      code: "usd",
      name: "US dollar",
      symbol: ["USD", "$"],
    },
    {
      code: "aud",
      name: "Australian dollar",
      symbol: ["AUD", "$"],
    },
    {
      code: "jpy",
      name: "Japanese Yen",
      symbol: ["¥", "JPY"],
    },
    {
      code: "eur",
      name: "Euro",
      symbol: ["€", "EUR"],
    },
    {
      code: "cny",
      name: "Chinese Yuan Renminbi",
      symbol: ["¥", "CNY"],
    },
  ]);
};
