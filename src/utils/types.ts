import { Request } from "express";
import mongoose, { ObjectId } from "mongoose";

export type ExpensePurpose =
  | "topup"
  | "withdrawl"
  | "expense"
  | "others"
  | "close account";

export type WalletCreateRequest = {
  _id?: mongoose.Types.ObjectId;
  name: string;
  nominal: number;
  currency: string;
};

export type WalletUpdateRequest = {
  name?: string;
  nominal: number;
  currency: string;
};

export type ExpenseRequest = {
  name?: string;
  note?: string;
  purpose: string;
  nominal: number;
  currency: string;
};

export interface CustomRequest<T> extends Request {
  body: T;
}
