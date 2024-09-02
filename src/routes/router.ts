import express, { Request, Response } from "express";
import { sessionMiddleware } from "../middlewares/session.middleware";

import { AuthController } from "../controllers/auth.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { WalletController } from "../controllers/wallet.controller";
import { TransactionController } from "../controllers/transaction.controller";
import { call } from "../seeders/db.seeder";

export const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get("/user", AuthController.user);

router.use("/wallet", AuthMiddleware);
router.get("/wallet", WalletController.index);
router.post("/wallet", WalletController.store);
router.patch("/wallet/:id/topup", WalletController.topup);
router.patch("/wallet/:id/withdrawal", WalletController.withdrawal);
router.delete("/wallet/:id", WalletController.delete);

router.use("/transaction", AuthMiddleware);
router.get("/transaction", TransactionController.index);
router.post("/transaction/walletId", TransactionController.store);

router.get("/seed", async (req: Request, res: Response) => {
  await call();
  res.status(200).json({
    message: "Seed success",
  });
});

// router.patch("/wallet/:id", AuthMiddleware, WalletController.update);
