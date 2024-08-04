import Joi from 'joi';

export const fetchAllCoursesTypes = Joi.object({
	requestEmail: Joi.string().email().required(),
});
