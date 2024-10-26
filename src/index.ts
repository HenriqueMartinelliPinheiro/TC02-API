import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { swaggerOptions } from './config/swaggerOptions';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: ['http://200.135.55.14:5173', 'http://localhost:5173'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})
);

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Endpoint to handle govbr token exchange
app.post('/api/govbr/token', async (req: Request, res: Response) => {
	try {
		const { code } = req.body;
		if (!code) {
			return res.status(400).json({ message: 'Code is required' });
		}

		const config = {
			URL_PROVIDER: process.env.GOVBR_URL_PROVIDER!,
			URL_SERVICE: process.env.GOVBR_URL_SERVICE!,
			REDIRECT_URI: process.env.GOVBR_REDIRECT_URI!,
			SCOPES: process.env.GOVBR_SCOPES!,
			CLIENT_ID: process.env.GOVBR_CLIENT_ID!,
			SECRET: process.env.GOVBR_SECRET!,
		};
		const tokenResponse = await axios.post(`${config.URL_PROVIDER}/token`, {
			code,
			redirect_uri: config.REDIRECT_URI,
			client_id: config.CLIENT_ID,
			client_secret: config.SECRET,
			grant_type: 'authorization_code',
		});

		const token = tokenResponse.data;
		if (!token) {
			return res.status(500).json({ message: 'Failed to obtain access token' });
		}

		console.log('Token:', token);
		res.json({ access_token: token.access_token });
	} catch (error) {
		console.error('Erro ao trocar o código pelo token:', error);
		res.status(500).json({ message: 'Erro ao trocar o código pelo token' });
	}
});

app.listen(4000, () => {
	console.log(`App is listening on port 4000`);
});
