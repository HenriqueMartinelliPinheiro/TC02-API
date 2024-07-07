import { Router } from 'express';
import { CreateUserController } from '../controller/user/CreateUserController';
import { CreateUserService } from '../services/user/CreateUserService';
import { UserRepository } from '../repository/implementation/UserRepository';
import { Prisma, PrismaClient } from '@prisma/client';
import { RoleRepository } from '../repository/implementation/RoleRepository';
import { LoginUserService } from '../services/user/LoginUserService';
import { LoginUserController } from '../controller/user/LoginUserController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminRoleMiddleware } from '../middlewares/adminRoleMiddleware';

export const userRouter = Router();

const prismaClient = new PrismaClient();

const userRepository = new UserRepository(new PrismaClient);

const roleRepository = new RoleRepository(prismaClient);

const createUserService = new CreateUserService(userRepository, roleRepository);
const createUserController = new CreateUserController(createUserService);

const loginUserService = new LoginUserService(userRepository);
const loginUserController = new LoginUserController(loginUserService);

userRouter.post("/createUser",authMiddleware, adminRoleMiddleware, createUserController.createUser);


userRouter.post("/loginUser", loginUserController.loginUser);