import Joi from 'joi';

export const createUserTypes = Joi.object({
	userEmail: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.messages({
			'string.email': 'Por favor, insira um endereço de e-mail válido.',
			'any.required': 'O campo de e-mail é obrigatório.',
		}),
	userName: Joi.string().required().min(2).messages({
		'string.min': 'O nome deve ter pelo menos 2 caracteres.',
		'any.required': 'O campo de nome é obrigatório.',
	}),
	userPassword: Joi.string().required().messages({
		'any.required': 'O campo de senha é obrigatório.',
	}),
	roleId: Joi.number().required().greater(0).messages({
		'number.base': 'Erro com o cargo ao inserir.',
		'number.greater': 'Erro com o cargo ao inserir.',
		'any.required': 'Erro com o cargo ao inserir.',
	}),
	roleTitle: Joi.string().required().min(2).messages({
		'string.min': 'Erro com o cargo ao inserir.',
		'any.required': 'Erro com o cargo ao inserir.',
	}),
});
