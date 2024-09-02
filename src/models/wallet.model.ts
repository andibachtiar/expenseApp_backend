import { ObjectId } from "mongoose";
import * as bcrypt from "bcrypt";
import { mongodb } from "../services/mongodb.service";

const walletMutationSchema = new mongodb.Schema({
  type: String,
  nominal: Number,
});
