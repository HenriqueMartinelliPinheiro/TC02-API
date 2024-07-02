import Joi from "joi";

export const createEventTypes = Joi.object({
    title: Joi.string().required(),
    eventStatus: Joi.number().required(),
    eventStartDate: Joi.date,
    eventEndDate: Joi.date,
})