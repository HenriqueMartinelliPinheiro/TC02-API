import Joi from 'joi';

export const getEventByIdTypes = Joi.object({
	eventId: Joi.number().required().messages({
		'number.base': 'O ID do evento deve ser um número.',
	}),
});
