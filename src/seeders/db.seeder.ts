import { error } from "../utils/errors";
import { seed as CurrencySeeder } from "./currency.seeder";

export const call = async () => {
  try {
    await CurrencySeeder();
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw error(504, e.message);
    }
  }
};

call();
