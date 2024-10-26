import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { govbrOauth } from 'govbr-oauth';
import { eventRouter } from './routes/eventRoutes';
import { userRouter } from './routes/userRoutes';
import { courseRouter } from './routes/courseRoutes';
import { roleRouter } from './routes/roleRoutes';
import { studentRouter } from './routes/studentRoutes';
import { attendanceRouter } from './routes/students/attendanceRoutes';
import reportsRouter from './routes/reportsRoutes';
import { eventStudentRouter } from './routes/students/eventRoutes';
import { swaggerOptions } from './config/swaggerOptions';

const app: Express = express();

// Middleware configuration
app.use(express.json());
app.use(cookieParser());

app.use(
	cors({
		origin: ['http://200.135.55.14:5173', 'http://localhost:5173'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})
);

// Swagger Documentation
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define routes for application
app.use('/api', eventRouter);
app.use('/api', userRouter);
app.use('/api', courseRouter);
app.use('/api', roleRouter);
app.use('/api', studentRouter);
app.use('/api', attendanceRouter);
app.use('/api', reportsRouter);
app.use('/api', eventStudentRouter);

// GovBR OAuth Configuration
const config = {
	URL_PROVIDER: process.env.GOVBR_URL_PROVIDER,
	URL_SERVICE: process.env.GOVBR_URL_SERVICE,
	REDIRECT_URI: process.env.GOVBR_REDIRECT_URI, // URL para receber o retorno
	SCOPES: process.env.GOVBR_SCOPES,
	CLIENT_ID: process.env.GOVBR_CLIENT_ID, // ID do cliente fornecido pelo gov.br
	SECRET: process.env.GOVBR_SECRET, // Chave secreta fornecida pelo gov.br
};

// Endpoint for login with gov.br
app.get('/api/auth/login', (req, res) => {
	const url = govbrOauth.authorize(config);
	res.redirect(url);
});

// Endpoint to handle token exchange from frontend
app.post('/api/auth/exchange', async (req, res) => {
	const { code } = req.body;

	if (!code) {
		return res.status(400).send('Code not provided');
	}

	try {
		const token = await govbrOauth.getToken(config, code);
		console.log(token);
		res.cookie('govbr_access_token', token.access_token, {
			httpOnly: true,
			secure: true,
		});
		res.status(200).send('Authentication successful');
	} catch (error) {
		console.error('Error exchanging code for token:', error);
		res.status(500).send('Authentication failed');
	}
});

// Start server
app.listen(4000, () => {
	console.log('App is listening on port 4000');
});
