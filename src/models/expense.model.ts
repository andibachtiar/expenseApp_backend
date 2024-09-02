import { Document } from "mongoose";
import { mongodb } from "../services/mongodb.service";

export interface IExpense extends Document {
  user_id: string;
  wallet_id: string;
  purpose: string;
  note: string;
  expense: {
    currency: string;
    nominal: number;
  };
  expenseInRupiah: {
    currency: string;
    nominal: number;
  };
}

const expenseSchema = new mongodb.Schema<IExpense>(
  {
    user_id: String,
    wallet_id: String,
    purpose: String,
    note: String,
    expense: {
      currency: String,
      nominal: Number,
    },
    expenseInRupiah: {
      currency: String,
      nominal: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Expense = mongodb.model("Expense", expenseSchema);
