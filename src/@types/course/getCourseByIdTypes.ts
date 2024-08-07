import Joi from 'joi';

export const getCourseByIdTypes = Joi.object({
	courseId: Joi.number().required().greater(0),
});
