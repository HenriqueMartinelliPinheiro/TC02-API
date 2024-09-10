import path from 'path';

export const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'API Documentation',
			version: '1.0.0',
			description: 'Documentação da API usando Swagger com TypeScript',
		},
		servers: [
			{
				url: 'http://localhost:4000',
				description: 'Local server',
			},
		],
	},
	apis: [path.resolve(__dirname, '../docs/swagger.yaml')],
};
