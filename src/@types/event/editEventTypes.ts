import Joi from 'joi';

export const editEventTypes = Joi.object({
	eventId: Joi.number().min(1).required().messages({
		'number.base': 'O ID do evento deve ser um número.',
		'any.required': 'O ID do evento é obrigatório.',
	}),
	eventTitle: Joi.string().min(2).required().messages({
		'string.min': 'O título do evento deve ter pelo menos 2 caracteres.',
		'any.required': 'O título do evento é obrigatório.',
	}),
	eventStartDate: Joi.date().required().messages({
		'date.base': 'A data de início do evento deve ser uma data válida.',
		'any.required': 'A data de início do evento é obrigatória.',
	}),
	eventEndDate: Joi.date().required().messages({
		'date.base': 'A data de término do evento deve ser uma data válida.',
		'any.required': 'A data de término do evento é obrigatória.',
	}),
	eventActivities: Joi.array()
		.min(1)
		.items(
			Joi.object({
				eventActivityTitle: Joi.string().min(2).required().messages({
					'string.min': 'O título da atividade deve ter pelo menos 2 caracteres.',
					'any.required': 'O título da atividade é obrigatório.',
				}),
				eventActivityStartDate: Joi.date().required().messages({
					'date.base': 'A data de início da atividade deve ser uma data válida.',
					'any.required': 'A data de início da atividade é obrigatória.',
				}),
				eventActivityEndDate: Joi.date().required().messages({
					'date.base': 'A data de término da atividade deve ser uma data válida.',
					'any.required': 'A data de término da atividade é obrigatória.',
				}),
				eventActivityDescription: Joi.string().min(10).required().messages({
					'string.min': 'A descrição da atividade deve ter pelo menos 10 caracteres.',
					'any.required': 'A descrição da atividade é obrigatória.',
				}),
			})
		)
		.required()
		.messages({
			'array.min': 'Deve haver pelo menos uma atividade no evento.',
			'any.required': 'As atividades do evento são obrigatórias.',
		}),
	selectedCoursesIds: Joi.array()
		.min(1)
		.items(Joi.number().required())
		.required()
		.messages({
			'array.min': 'Deve haver pelo menos um curso selecionado.',
			'any.required': 'Selecionar os cursos é obrigatório.',
		}),
	eventStatus: Joi.string(),
	eventRadius: Joi.number().optional(),
	eventLatitude: Joi.number().optional(),
	eventLongitude: Joi.number().optional(),
});
