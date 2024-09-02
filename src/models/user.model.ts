import mongoose, { ObjectId, UpdateQuery } from "mongoose";
import * as bcrypt from "bcrypt";
import { mongodb } from "../services/mongodb.service";
import { Document } from "mongoose";

export interface UserInterface extends Document {
  email: string;
  name: string;
  password: string;
  verifiedAt?: string;
  token?: string;
  wallets: {
    name: string;
    currency: string;
    balance?: number;
  }[];
}

export type UserModel = {
  _id: ObjectId;
  email: string;
  name: string;
  password: string;
  verifiedAt: Date;
  defaultCurrency: String;
  token?: string;
};

export interface IWallet extends Document {
  name: string;
  currency: string;
  balance: number;
}

export const walletSchema = new mongodb.Schema<IWallet>({
  _id: {
    type: mongoose.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  name: String,
  currency: {
    type: String,
    default: "idr",
  },
  balance: {
    type: Number,
    default: 0,
  },
});

const UserSchema = new mongodb.Schema(
  {
    email: {
      required: true,
      type: String,
    },
    name: String,
    password: {
      required: true,
      type: String,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    wallets: {
      type: [walletSchema],
      default: () => [
        {
          name: "Kartu",
          currency: "idr",
          balance: 0,
        },
        {
          name: "Uang Tunai",
          currency: "idr",
          balance: 0,
        },
      ],
    },
  },
  {
    methods: {
      async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
      },
    },
    statics: {
      async getWallet(walletId: string) {
        const user = await this.findOne(
          {
            wallets: {
              $elemMatch: {
                _id: walletId,
              },
            },
          },
          {
            "wallets.$": 1,
          }
        );

        return user ? user.wallets[0] : null;
      },

      async updateWallet(walletId: string, update: UpdateQuery<UserInterface>) {
        return await this.updateOne(
          {
            wallets: {
              $elemMatch: {
                _id: walletId,
              },
            },
          },
          update
        );
      },
    },
  }
);

export const User = mongodb.model("User", UserSchema);
