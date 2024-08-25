import Joi from 'joi';

export const createRoleTypes = Joi.object({
	roleTitle: Joi.string().required().min(2).messages({
		'string.min': 'Título do cargo muito curto',
		'any.required': 'Por favor informe um cargo',
	}),
});
