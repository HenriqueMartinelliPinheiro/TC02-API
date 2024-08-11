import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { userLogPath } from '../config/logPaths';
import { Logger } from '../loggers/Logger';

const prisma = new PrismaClient();
const logger = new Logger('adminRoleMiddleware', userLogPath);

export const roleMiddleware = (requiredRoles: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			if ('requestEmail' in req) {
				const userEmail = req.requestEmail;

				const user = await prisma.user.findFirst({
					where: {
						userEmail: userEmail,
					},
					include: {
						role: true,
					},
				});

				if (!user || !user.role || !requiredRoles.includes(user.role.roleTitle)) {
					logger.warn('Acesso não autorizado', req.body.userId);
					return res.status(401).json({
						msg: 'Não autorizado',
					});
				}
				logger.info('Usuário autorizado', req.requestEmail);
				return next();
			} else {
				logger.warn('UserEmail ausente na requisição');
				return res.status(400).json({
					msg: 'UserEmail ausente na requisição',
				});
			}
		} catch (error) {
			logger.error('Erro no middleware adminRole:', error);
			return res.status(500).json({
				msg: 'Erro interno do servidor',
			});
		}
	};
};
