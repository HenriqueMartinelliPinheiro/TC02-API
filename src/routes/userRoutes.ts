import { Router } from 'express';
import { CreateUserController } from '../controller/user/CreateUserController';

export const userRouter = Router();

const createUserController = new CreateUserController();

userRouter.post("/createUser",createUserController.createUser);