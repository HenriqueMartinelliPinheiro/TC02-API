import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

import { roleRoles } from '../config/roles/role/roleRoles';
import { FetchAllRolesController } from '../controllers/role/FetchAllRolesController';
import { RoleRepository } from '../repository/implementation/RoleRepository';
import { PrismaClient } from '@prisma/client';
import { FetchAllRolesService } from '../services/role/FetchAllRolesService';

export const 	roleRouter = Router();

const prismaClient = new PrismaClient();

const roleRepository = new RoleRepository(prismaClient);
const fetchAllRolesService = new FetchAllRolesService(roleRepository);
const fetchAllRolesController = new FetchAllRolesController(fetchAllRolesService);

roleRouter.get(
	'/fetchAllRoles',
	authMiddleware,
	roleMiddleware(roleRoles.FETCH_ALL_ROLES_ROLES),
	fetchAllRolesController.fetchAllRoles
);
