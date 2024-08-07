import Joi from 'joi';

export const createUserTypes = Joi.object({
	userEmail: Joi.string().email().required(),
	userName: Joi.string().required().min(2),
	userPassword: Joi.string().required(),
	roleId: Joi.number().required().greater(0),
	roleTitle: Joi.string().required().min(2),
});
