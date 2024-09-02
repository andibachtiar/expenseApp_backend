import Joi from "joi";

export class AuthValidation {
  static async loginValidate(body: any) {
    return await Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(5).max(25).required(),
    }).validateAsync(body);
  }

  static async registerValidate(body: any) {
    return await Joi.object({
      email: Joi.string().email().required(),
      name: Joi.string().required().max(100),
      password: Joi.string().min(5).max(25).required(),
    }).validateAsync(body);
  }
}
