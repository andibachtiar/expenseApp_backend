import { createClient } from "redis";

// export const redis = async () => {
//   console.log(process.env.REDIS_USERNAME, process.env.REDIS_PASSWORD);

//   return createClient({
//     url: process.env.REDIS_URL || "redis://localhost:6379",
//     // username: process.env.REDIS_USERNAME || "",
//     // password: process.env.REDIS_PASSWORD || "",
//   })
//     .on("error", (err) => console.log("Redis Client Error", err))
//     .connect();
// };

export const redisClient = createClient();

(async () => {
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  await redisClient.connect();
})();
