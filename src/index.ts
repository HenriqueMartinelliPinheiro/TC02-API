import express, { Express } from 'express';
import cors from 'cors';
import { eventRouter } from './routes/eventRoutes';
import { userRouter } from './routes/userRoutes';
import { swaggerOptions } from './config/swaggerOptions';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { courseRouter } from './routes/courseRoutes';
import cookieParser from 'cookie-parser';

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins?.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		allowedHeaders: ['Content-Type'],
		credentials: true, // necessário para permitir cookies
	})
);

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/', eventRouter);
app.use('/', userRouter);
app.use('/', courseRouter);

app.listen(4000, () => {
	console.log(`App is listening on port 4000`);
});
