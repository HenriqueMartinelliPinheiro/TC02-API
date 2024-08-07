import Joi from 'joi';

export const editCourseTypes = Joi.object({
	courseName: Joi.string().required().min(2),
	courseCoordinatorEmail: Joi.string().email().required(),
	courseId: Joi.number().greater(0),
});
