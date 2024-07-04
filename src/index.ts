import express, { Express, Request, Response } from "express";
import { eventRouter } from "./routes/eventRoutes";
import cors from 'cors';
import { userRouter } from "./routes/userRoutes";
import { swaggerOptions } from "./config/swaggerOptions";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const app: Express = express();

app.use(express.json());
app.use(cors());

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware para servir a UI do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/",eventRouter)
app.use("/", userRouter);

app.listen(4000, () => {
 console.log(`App is listening on port 4000`);
});