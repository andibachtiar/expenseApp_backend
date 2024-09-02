import { NextFunction, Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";
import { ExpenseValidation } from "../validations/expense.validation";
import { Auth, AuthService } from "../services/auth.service";
import { WalletService } from "../services/wallet.service";
import { User } from "../models/user.model";
import { Expense } from "../models/expense.model";
import { error } from "../utils/errors";
import { CustomRequest, ExpenseRequest } from "../utils/types";

export class TransactionController {
  static async index(req: Request, res: Response, next: NextFunction) {
    const user = AuthService.auth(req.headers.authorization);

    if (typeof user === "string") {
      throw error("Unauthorized");
    }

    const expenses = await Expense.find(
      {
        user_id: user.id,
      },
      {
        purpose: 1,
        expense: 1,
        expenseInRupiah: 1,
        createdAt: 1,
      }
    ).exec();

    res.status(200).json({
      data: expenses,
    });
  }

  static async store(
    req: CustomRequest<ExpenseRequest>,
    res: Response,
    next: NextFunction
  ) {
    try {
      req.body = await ExpenseValidation.createValidate(req.body);
      const wallet = await User.getWallet(req.params.id);
      await TransactionService.createExpense(wallet, req);

      res.status(200).json({
        message: "expense created",
      });
    } catch (e) {
      next(e);
    }
  }
}
