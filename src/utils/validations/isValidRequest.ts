import Joi from 'joi';

export const isValidRequest = (
	objectData: {},
	schema: Joi.ObjectSchema
): string | boolean => {
	try {
		const { error } = schema.validate(objectData);
		if (error) {
			return error.details[0].message;
		}

		return true;
	} catch (err) {
		return 'Erro ao validar a solicitação.';
	}
};
