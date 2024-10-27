import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { userLogPath } from '../config/logPaths';
import { Logger } from '../loggers/Logger';

const prisma = new PrismaClient();
const logger = new Logger('authMiddleware', userLogPath);

declare module 'express-serve-static-core' {
	interface Request {
		requestEmail?: string;
	}
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessToken = req.cookies.token;
		console.log(accessToken);

		if (!accessToken) {
			logger.error('Access Token missing');
			return res.status(401).json({ message: 'Token de acesso ausente' });
		}

		const { isValid, userEmail } = await validateAccessToken(accessToken);
		if (isValid && userEmail) {
			logger.info('Requisição Aceita', userEmail);
			req.requestEmail = userEmail;
			return next();
		} else {
			logger.error('Invalid Access Token');
			return res.status(401).json({ message: 'Token de acesso inválido' });
		}
	} catch (error) {
		logger.error('AuthMiddleware Error', req.requestEmail, error);
		return res.status(401).json({ msg: 'Usuário não autenticado' });
	}
};

const validateAccessToken = async (accessToken: string) => {
	try {
		const decodedAccessToken = jwt.verify(
			accessToken,
			process.env.JWT_ACCESS_SECRET!
		) as jwt.JwtPayload;
		const now = Math.floor(Date.now() / 1000);

		if (decodedAccessToken.exp > now) {
			const user = await prisma.user.findUniqueOrThrow({
				where: { userId: decodedAccessToken.userId },
				include: { login: true },
			});

			if (decodedAccessToken.userId === user.userId) {
				const userEmail = user.userEmail;
				return { isValid: true, userEmail };
			}
		}

		return { isValid: false, userEmail: null };
	} catch (error) {
		throw error;
	}
};
