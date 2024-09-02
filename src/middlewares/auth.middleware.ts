import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let authorizationToken = req.headers["authorization"] || "";
    authorizationToken = authorizationToken.split(" ")[1];
    AuthService.verifiedToken(authorizationToken);
    next();
  } catch (e) {
    next(e);
  }
};
