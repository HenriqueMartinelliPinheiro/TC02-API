import Joi from 'joi';

export const issueReportTypes = Joi.object({
	eventId: Joi.number().required().greater(0).messages({
		'number.base': 'O campo eventId deve ser um número.',
		'number.greater': 'O campo eventId deve ser maior que 0.',
		'any.required': 'O campo eventId é obrigatório.',
	}),
	userEmail: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.messages({
			'string.email': 'Por favor, insira um endereço de e-mail válido.',
			'any.required': 'O campo userEmail é obrigatório.',
		}),
});
