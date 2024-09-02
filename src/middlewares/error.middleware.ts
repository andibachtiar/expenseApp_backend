import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";

export const errorMiddleware = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidationError) {
    res.status(422).json({
      errors: err,
    });
  } else if (err instanceof Error) {
    return res.status(500).json({
      errors: err.message,
    });
  }
};
