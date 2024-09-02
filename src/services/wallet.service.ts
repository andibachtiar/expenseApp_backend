import { error } from "../utils/errors";
import { WalletCreateRequest } from "../utils/types";
import { Auth, AuthService } from "./auth.service";
import { IWallet, User } from "../models/user.model";
import { Expense, IExpense } from "../models/expense.model";
import { Request } from "express";
import mongoose from "mongoose";

export class WalletService {
  public static async get(auth: Auth): Promise<IWallet[] | null> {
    if (typeof auth !== "string") {
      const user = await User.findOne(
        {
          _id: auth.id,
        },
        {
          wallets: 1,
        }
      );

      return user?.wallets ?? null;
    }

    return null;
  }

  public static async create(req: Request): Promise<any> {
    const auth = AuthService.auth(req.headers.authorization);

    if (typeof auth === "string") {
      throw error(401, "Unauthorized");
    }

    const input: WalletCreateRequest = req.body;
    input._id = new mongoose.Types.ObjectId();

    await User.updateOne(
      { _id: auth.id },
      {
        $push: {
          wallets: {
            name: input.name,
            currency: input.currency,
            balance: input.nominal,
          },
        },
      }
    );

    return input;
  }

  public static async topupWallet(
    wallet: IWallet,
    expense: IExpense
  ): Promise<any> {
    await User.updateWallet(wallet.id, {
      $inc: {
        "wallets.$.balance": expense.expenseInRupiah.nominal,
      },
    });
  }

  public static async withdrawalWallet(
    wallet: IWallet,
    expense: IExpense
  ): Promise<any> {
    await User.updateWallet(wallet.id, {
      $inc: {
        "wallets.$.balance": expense.expenseInRupiah.nominal * -1,
      },
    });

    Expense.create;
  }

  public static async deleteWallet(walletId: string): Promise<any> {
    return await User.updateWallet(walletId, {
      $pull: {
        wallets: {
          _id: walletId,
        },
      },
    });
  }
}
