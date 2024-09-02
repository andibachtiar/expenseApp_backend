import { Expense } from "../models/expense.model";
import { IWallet } from "../models/user.model";
import { error } from "../utils/errors";
import { CustomRequest, ExpenseRequest } from "../utils/types";
import { AuthService } from "./auth.service";
import { fetchData } from "./fetch.service";

export class TransactionService {
  private static async setNominalExchange(
    req: CustomRequest<ExpenseRequest>,
    wallet: IWallet
  ): Promise<number> {
    return await this.convertCurrency(
      req.body.currency,
      wallet.currency,
      req.body.nominal
    );
  }

  private static async convertCurrency(
    from: string,
    to: string,
    nominal: number
  ): Promise<number> {
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`;
    const currencies = await fetchData(url);
    const exchange: number = currencies[from][to];

    return exchange * nominal;
  }

  static async closeAccount(
    wallet: IWallet,
    req: CustomRequest<ExpenseRequest>
  ) {
    const user = AuthService.auth(req.headers.authorization);
    if (typeof user === "string") {
      throw error("Unauthorized");
    }

    return await Expense.create({
      user_id: user.id,
      wallet_id: wallet._id,
      purpose: "close account",
      expense: {
        currency: wallet.currency,
        nominal: wallet.balance > 0 ? wallet.balance * -1 : 0,
      },
    });
  }

  static async createExpense(
    wallet: IWallet | null,
    req: CustomRequest<ExpenseRequest>
  ) {
    const user = AuthService.auth(req.headers.authorization);
    if (typeof user === "string" || wallet === null) {
      throw error("Unauthorized");
    }
    const nominalRupiah = await this.setNominalExchange(req, wallet);

    return await Expense.create({
      user_id: user.id,
      wallet_id: wallet._id,
      note: req.body.note,
      purpose: req.body.purpose,
      expense: {
        currency: req.body.currency,
        nominal: req.body.nominal * -1,
      },
      expenseInRupiah: {
        currency: "idr",
        nominal: nominalRupiah * -1,
      },
    });
  }

  static async createEarning(
    wallet: IWallet,
    req: CustomRequest<ExpenseRequest>
  ) {
    const user = AuthService.auth(req.headers.authorization);

    if (typeof user === "string") {
      throw error("Unauthorized");
    }

    const nominalRupiah = await this.setNominalExchange(req, wallet);

    return await Expense.create({
      user_id: user.id,
      wallet_id: wallet._id,
      note: req.body.note,
      purpose: req.body.purpose,
      expense: {
        currency: req.body.currency,
        nominal: req.body.nominal,
      },
      expenseInRupiah: {
        currency: "idr",
        nominal: nominalRupiah,
      },
    });
  }
}
