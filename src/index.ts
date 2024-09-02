import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/router";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

app.use(express.json());
app.use(router);
app.use(errorMiddleware);

app.listen(3010, () => {
  console.log("listen to port 3000");
});
