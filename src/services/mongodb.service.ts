import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const mongodb = mongoose;

export const dbTransaction = async () => {
  const session = await mongodb.startSession();
  session.startTransaction();
  return session;
};

mongodb.connect(process.env.MONGODB_URL || "mongodb://127.0.0.1:27017", {
  user: process.env.MONGODB_USERNAME || "",
  pass: process.env.MONGODB_PASSWORD || "",
  dbName: process.env.MONGODB_DBNAME || "",
});
