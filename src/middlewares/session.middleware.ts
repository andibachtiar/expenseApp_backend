import { NextFunction, Request, Response } from "express";
import { redisClient } from "../services/redis.service";
import { Currency } from "../models/currency.model";

export const sessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // let currencies: any = await redisClient.get("currencies");

    // if (!currencies) {
    //   currencies = Currency.find();
    //   redisClient.set("currencies", currencies, {
    //     EX: -1,
    //   });
    // }

    next();
  } catch (e: unknown) {
    next(e);
  }
};
