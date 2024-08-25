import Joi from 'joi';

export const loginUserTypes = Joi.object({
	userEmail: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.messages({
			'string.email': 'Por favor, insira um endereço de e-mail válido.',
			'any.required': 'O campo de e-mail é obrigatório.',
		}),
	userPassword: Joi.string().min(6).required().messages({
		'string.min': 'A senha deve ter pelo menos 6 caracteres.',
		'any.required': 'O campo de senha é obrigatório.',
	}),
});
