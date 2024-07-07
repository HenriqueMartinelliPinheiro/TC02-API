import Joi from "joi";

export const isValidRequest = (objectData: {}, schema : Joi.ObjectSchema): boolean => {
    try {
        const { error, value } = schema.validate(objectData);

        if (error) {
            return false;
        }
    
        return true;
    } catch (error) {
        return false;
    }
   
}