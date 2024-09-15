import Joi from 'joi';

export const createAttendanceTypes = Joi.object({
	studentName: Joi.string().min(2).required().messages({
		'string.min': 'O nome do estudante deve ter pelo menos 2 caracteres.',
		'any.required': 'O nome do estudante é obrigatório.',
	}),
	studentRegistration: Joi.string().min(5).required().messages({
		'string.min': 'O registro do estudante deve ter pelo menos 5 caracteres.',
		'any.required': 'O registro do estudante é obrigatório.',
	}),
	studentCpf: Joi.string().length(11).required().messages({
		'string.length': 'O CPF do estudante deve ter exatamente 11 caracteres.',
		'any.required': 'O CPF do estudante é obrigatório.',
	}),
	eventActivityId: Joi.number().required().messages({
		'number.base': 'O ID da atividade deve ser um número.',
		'any.required': 'O ID da atividade é obrigatório.',
	}),
	eventId: Joi.number().required().messages({
		'number.base': 'O ID do evento deve ser um número.',
		'any.required': 'O ID do evento é obrigatório.',
	}),
	latitude: Joi.number().required().messages({
		'number.base': 'A latitude deve ser um número.',
		'any.required': 'A latitude é obrigatória.',
	}),
	longitude: Joi.number().required().messages({
		'number.base': 'A longitude deve ser um número.',
		'any.required': 'A longitude é obrigatória.',
	}),
});
