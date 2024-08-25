import Joi from 'joi';

export const getCourseByIdTypes = Joi.object({
	courseId: Joi.number().required().greater(0).messages({
		'number.base': 'O ID do curso deve ser um número válido.',
		'number.greater': 'O ID do curso deve ser maior que 0.',
		'any.required': 'O ID do curso é obrigatório.',
	}),
});
