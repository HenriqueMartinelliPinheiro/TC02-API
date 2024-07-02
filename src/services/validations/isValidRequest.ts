import Joi from "joi";
import { createUserTypes } from "../../@types/user/createUserTypes";

export const isValidRequest = (objectData: {}, schema : Joi.ObjectSchema): boolean => {
    try {
        const { error, value } = createUserTypes.validate(objectData);

        if (error) {
            return false;
        }
    
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
   
}