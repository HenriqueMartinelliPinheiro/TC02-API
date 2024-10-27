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
import { studentRouter } from './routes/students/studentRoutes';
import { attendanceRouter } from './routes/students/attendanceRoutes';
import reportsRouter from './routes/reportsRoutes';
import { eventStudentRouter } from './routes/students/eventRoutes';
import { swaggerOptions } from './config/swaggerOptions';
import { studentAuthRouter } from './routes/students/studentAuthRoutes';

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

app.use(
	cors({
		origin: '*', // Permite todas as origens
		allowedHeaders: '*', // Permite todos os cabeçalhos
		methods: '*', // Permite todos os métodos
		credentials: true, // Necessário para permitir cookies
	})
);

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', eventRouter);
app.use('/api', userRouter);
app.use('/api', courseRouter);
app.use('/api', roleRouter);
app.use('/api', studentRouter);
app.use('/api', attendanceRouter);
app.use('/api', reportsRouter);
app.use('/api', eventStudentRouter);
app.use('/api', studentAuthRouter);

app.listen(4000, () => {
	console.log('App is listening on port 4000');
});
