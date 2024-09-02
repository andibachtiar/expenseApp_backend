import { User, UserModel } from "../models/user.model";
import * as bcrypt from "bcrypt";
import { error } from "../utils/errors";
import * as jwt from "jsonwebtoken";

export type Auth =
  | {
      id: string;
      email: string;
      name: string;
      verifiedAt: Date;
      token: string;
    }
  | string;

export class AuthService {
  static async register(input: UserModel) {
    const auth = await User.findOne({ email: input.email }).exec();

    if (auth) {
      throw error(422, "Authentication failed");
    }

    const user = await User.create({
      email: input.email,
      name: input.name,
      password: await bcrypt.hash(input.password, 10),
    });

    const authReturn: Auth = {
      id: user._id.toString(),
      email: user.email,
      name: user.name ?? "",
      verifiedAt: user.verifiedAt,
      token: user.token,
    };

    return {
      ...authReturn,
      token: AuthService.generateToken(authReturn),
    };
  }

  static async authenticate(input: UserModel) {
    const auth = await User.findOne({ email: input.email }).exec();

    if (!auth) {
      throw error(401, "Unauthorized");
    }

    const isValidUser = await AuthService.verifiedPassword(
      input.password,
      auth?.password
    );

    if (!isValidUser) {
      throw error(401, "Unauthorized");
    }

    const authReturn: Auth = {
      id: auth._id.toString(),
      email: auth.email,
      name: auth.name ?? "",
      verifiedAt: auth.verifiedAt,
      token: auth.token,
    };

    return {
      ...authReturn,
      token: AuthService.generateToken(authReturn),
    };
  }

  static async verifiedPassword(
    password_string: string,
    password_hashed: string = ""
  ) {
    return await bcrypt.compare(password_string, password_hashed);
  }

  static generateToken(user: any) {
    return jwt.sign(user, process.env.JWT_KEY || "", {
      expiresIn: Number.parseInt(process.env.JWT_EXPIRATION || "60") * 60,
    });
  }

  static verifiedToken(token: string) {
    return jwt.verify(token, process.env.JWT_KEY || "");
  }

  static auth(token: string = ""): Auth | string {
    let authorizationToken = token;
    authorizationToken = authorizationToken.split(" ")[1];

    const auth = AuthService.verifiedToken(authorizationToken);

    if (typeof auth === "string") {
      return auth;
    }

    return {
      id: auth.id,
      email: auth.email,
      name: auth.name,
      verifiedAt: auth.verifiedAt,
      token: auth.token,
    };
  }
}
