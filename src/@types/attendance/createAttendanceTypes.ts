import Joi from 'joi';

export const createAttendanceTypes = Joi.object({
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
