import Joi from 'joi';

export const createRoleTypes = Joi.object({
	roleTitle: Joi.string().required().min(2),
});
