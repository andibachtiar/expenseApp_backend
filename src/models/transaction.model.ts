import { ObjectId } from "mongoose";
import { mongodb } from "../services/mongodb.service";

const transactionSchema = new mongodb.Schema(
  {
    wallet_id: String,
    type: Number,
    nominal: Number,
    purpose: String,
    created_at: Date,
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  }
);

export const Transaction = mongodb.model("Transaction", transactionSchema);
