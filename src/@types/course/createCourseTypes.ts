import Joi from 'joi';

export const createCourseTypes = Joi.object({
	courseName: Joi.string().min(2).required().messages({
		'string.min': 'O nome do curso deve ter pelo menos 2 caracteres.',
		'any.required': 'O nome do curso é obrigatório.',
	}),
	courseCoordinatorEmail: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.messages({
			'string.email':
				'Por favor, insira um endereço de e-mail válido para o coordenador do curso.',
			'any.required': 'O e-mail do coordenador do curso é obrigatório.',
		}),
});
