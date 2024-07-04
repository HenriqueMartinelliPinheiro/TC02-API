import { Router } from 'express';
import { CreateUserController } from '../controller/user/CreateUserController';
import { CreateUserService } from '../services/user/CreateUserService';
import { UserRepository } from '../repository/implementation/UserRepository';
import { Prisma, PrismaClient } from '@prisma/client';
import { RoleRepository } from '../repository/implementation/RoleRepository';

export const userRouter = Router();

const prismaClient = new PrismaClient();
const userRepository = new UserRepository(new PrismaClient);
const roleRepository = new RoleRepository(prismaClient);
const createUserService = new CreateUserService(userRepository, roleRepository);
const createUserController = new CreateUserController(createUserService);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operações relacionadas a usuários
 */

/**
 * @swagger
 * /createUser:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               userEmail:
 *                 type: string
 *                 format: email
 *               userPassword:
 *                 type: string
 *             required:
 *               - userName
 *               - userEmail
 *               - userPassword
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     userName:
 *                       type: string
 *                       example: John Doe
 *                     userEmail:
 *                       type: string
 *                       example: johndoe@example.com
 *                 msg:
 *                   type: string
 *                   example: Usuário criado com sucesso
 *       '400':
 *         description: Dados inválidos
 *       '500':
 *         description: Erro interno do servidor
 */
userRouter.post("/createUser",createUserController.createUser);