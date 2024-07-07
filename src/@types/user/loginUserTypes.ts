import Joi from "joi";

export const loginUserTypes = Joi.object({
    userEmail: Joi.string().required(),
    userPassword: Joi.string().required(),
});