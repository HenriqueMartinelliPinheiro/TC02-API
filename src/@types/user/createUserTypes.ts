import Joi from 'joi';

export const createUserTypes = Joi.object({
	userEmail: Joi.string().required(),
	userName: Joi.string().required(),
	userPassword: Joi.string().required(),
	roleId: Joi.number().required(),
	roleTitle: Joi.string().required(),
});
