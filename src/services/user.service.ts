import { error } from "../utils/errors";
import { WalletCreateRequest } from "../utils/types";
import { Auth } from "./auth.service";
import { User } from "../models/user.model";

export class UserService {
  public static async getAccount(auth: Auth | string): Promise<any> {
    if (typeof auth === "string") {
      throw error(401, "Unauthorized");
    }
    return await User.findOne({ _id: auth.id }).exec();
  }
}
