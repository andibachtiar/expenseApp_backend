import { NextFunction, Request, Response } from "express";
import { AuthValidation } from "../validations/auth.request";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = await AuthValidation.loginValidate(req.body);
      const auth = await AuthService.authenticate(validated);

      res.status(200).json({
        data: auth,
      });
    } catch (e: unknown) {
      next(e);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = await AuthValidation.registerValidate(req.body);
      const auth = await AuthService.register(validated);
      res.status(200).json({
        data: auth,
      });
    } catch (e: unknown) {
      next(e);
    }
  }

  static user(req: Request, res: Response) {
    const user = AuthService.auth(req.headers.authorization);

    res.status(200).json({
      data: user,
    });
  }
}
