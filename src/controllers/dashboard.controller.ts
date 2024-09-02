import { Request, Response } from "express";

export class DashboardController {
  static index(req: Request, res: Response) {
    res.status(200).json({
      data: "ok",
    });
  }
}
