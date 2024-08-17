import Joi from 'joi';

export const createEventTypes = Joi.object({
	eventTitle: Joi.string().min(2, 'Título muito curto').required(),
	eventStartDate: Joi.date().required(),
	eventEndDate: Joi.date().required(),
	eventActivities: Joi.array()
		.min(1)
		.items(
			Joi.object({
				eventActivityStartDate: Joi.date().required(),
				eventActivityEndDate: Joi.date().required(),
				eventActivityDescription: Joi.string()
					.min(10, 'Descrição Muito Curta')
					.required(),
			})
		)
		.required(),
	courses: Joi.array().min(1).items(Joi.number().required()).required(),
});
