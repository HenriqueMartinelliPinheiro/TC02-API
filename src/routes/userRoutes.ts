import { Router } from 'express';
import { CreateUserController } from '../controller/user/CreateUserController';
import { CreateUserService } from '../services/user/CreateUserService';
import { UserRepository } from '../repository/implementation/UserRepository';
import { Prisma, PrismaClient } from '@prisma/client';

export const userRouter = Router();

const userRepository = new UserRepository(new PrismaClient);
const createUserService = new CreateUserService(userRepository);
const createUserController = new CreateUserController(createUserService);

userRouter.post("/createUser",createUserController.createUser);