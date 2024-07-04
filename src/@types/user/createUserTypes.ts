import Joi from "joi";

export const createUserTypes = Joi.object({
    userEmail: Joi.string().required(),
    userName: Joi.string().required(),
    userPassword: Joi.string().required(),
    userRoleId: Joi.number().required(),
});