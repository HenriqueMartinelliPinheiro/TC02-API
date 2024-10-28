import Joi from 'joi';

export const studentAuthExchangeTypes = Joi.object({
	code: Joi.string().required().messages({
		'any.required': 'O código é obrigatório.',
	}),
});
