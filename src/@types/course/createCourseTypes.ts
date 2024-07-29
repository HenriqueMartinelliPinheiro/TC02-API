import { request } from "http";
import Joi from "joi";

export const createCourseTypes = Joi.object({
    courseName: Joi.string().required(),
    courseCoordinatorEmail: Joi.string().required(),
    requestEmail: Joi.string().required(),
});