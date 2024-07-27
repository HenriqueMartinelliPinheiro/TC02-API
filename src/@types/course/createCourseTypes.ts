import { request } from "http";
import Joi from "joi";

export const createCourseTypes = Joi.object({
    courseName: Joi.string().required(),
    courseEmailCoordinator: Joi.string().required(),
    requestEmail: Joi.string().required(),
});