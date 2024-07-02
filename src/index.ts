import express, { Express, Request, Response } from "express";
import { eventRouter } from "./routes/eventRoutes";
import cors from 'cors';
import { userRouter } from "./routes/userRoutes";

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/",eventRouter)
app.use("/", userRouter);

app.listen(4000, () => {
 console.log(`App is listening on port 4000`);
});