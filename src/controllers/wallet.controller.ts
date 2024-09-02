import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AccountValidation } from "../validations/account.validation";
import { dbTransaction } from "../services/mongodb.service";
import { WalletService } from "../services/wallet.service";
import { TransactionService } from "../services/transaction.service";
import { User } from "../models/user.model";
import { error } from "../utils/errors";

export class WalletController {
  static async index(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = AuthService.auth(req.headers.authorization);
      if (typeof auth === "string") {
        throw error("Unauthorized");
      }
      const wallets = await WalletService.get(auth);

      res.status(200).json({
        data: wallets,
      });
    } catch (e: unknown) {
      next(e);
    }
  }

  static async store(req: Request, res: Response, next: NextFunction) {
    const transaction = await dbTransaction();
    try {
      req.body = await AccountValidation.createValidation(req.body);
      const wallet = await WalletService.create(req);
      await TransactionService.createEarning(wallet, req);

      transaction.commitTransaction();
      transaction.endSession();
      res.status(200).json({
        message: "Berhasil menambahkan akun baru",
      });
    } catch (e) {
      transaction.abortTransaction();
      transaction.endSession();
      next(e);
    }
  }

  static async topup(req: Request, res: Response, next: NextFunction) {
    const transaction = await dbTransaction();
    try {
      req.body = await AccountValidation.mutateValidation(req.body);
      const wallet = await User.getWallet(req.params.id);
      if (!wallet) {
        throw error("Not Found");
      }
      const mutation = await TransactionService.createEarning(wallet, req);
      await WalletService.topupWallet(wallet, mutation);

      transaction.commitTransaction();
      transaction.endSession();
      res.status(200).json({
        message: "Topup akun berhasil",
      });
    } catch (e) {
      transaction.abortTransaction();
      transaction.endSession();
      next(e);
    }
  }

  static async withdrawal(req: Request, res: Response, next: NextFunction) {
    const transaction = await dbTransaction();
    try {
      req.body = await AccountValidation.mutateValidation(req.body);
      const wallet = await User.getWallet(req.params.id);
      if (!wallet) {
        throw error("Not Found");
      }
      const mutation = await TransactionService.createExpense(wallet, req);
      await WalletService.withdrawalWallet(wallet, mutation);

      transaction.commitTransaction();
      transaction.endSession();
      res.status(200).json({
        data: "Withdrawal akun berhasil",
      });
    } catch (e) {
      transaction.abortTransaction();
      transaction.endSession();
      next(e);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const transaction = await dbTransaction();
    try {
      const wallet = await User.getWallet(req.params.id);
      if (!wallet) {
        throw error("Not Found");
      }
      await TransactionService.closeAccount(wallet, req);
      await WalletService.deleteWallet(wallet.id);

      transaction.commitTransaction();
      transaction.endSession();
      res.status(200).json({
        message: "Akun telah dihapus",
      });
    } catch (e) {
      transaction.abortTransaction();
      transaction.endSession();
      next(e);
    }
  }
}
