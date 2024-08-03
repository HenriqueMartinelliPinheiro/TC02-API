import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { LoginUserService } from '../../../services/user/LoginUserService';
import { isValidEmail } from '../../../utils/validations/isValidEmail';
import { isValidPassword } from '../../../utils/validations/isValidPassword';
import { isValidRequest } from '../../../utils/validations/isValidRequest';
import { generateUserErrorResponse } from '../../../utils/generateUserErrorResponse';
import { UserDomain } from '../../../domain/UserDomain';
import { loginUserTypes } from '../../../@types/user/loginUserTypes';
import { Logger } from '../../../loggers/Logger';
import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../../repository/interfaces/IUserRepository';
import { UserRepository } from '../../../repository/implementation/UserRepository';
import { LoginUserController } from '../../../controllers/user/LoginUserController';

// Mock das funções e classes necessárias
vi.mock('../../../utils/validations/isValidEmail');
vi.mock('../../../utils/validations/isValidPassword');
vi.mock('../../../utils/validations/isValidRequest');
vi.mock('../../../utils/generateUserErrorResponse', () => {
	return {
		generateUserErrorResponse: vi.fn(),
	};
});
vi.mock('../../../loggers/Logger', () => {
	return {
		Logger: vi.fn().mockImplementation(() => {
			return {
				warn: vi.fn(),
				error: vi.fn(),
				info: vi.fn(),
			};
		}),
	};
});

describe('LoginUserController', () => {
	let loginUserController: LoginUserController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let loginUserService: LoginUserService;
	let userRepository: IUserRepository;
	let prismaClient: PrismaClient;

	beforeEach(() => {
		// Mocks do repositório e logger
		prismaClient = new PrismaClient();
		userRepository = new UserRepository(prismaClient);

		loginUserService = new LoginUserService(userRepository);
		loginUserService.execute = vi.fn(); // Mock do método execute

		loginUserController = new LoginUserController(loginUserService);

		req = {
			body: {
				userEmail: 'test@example.com',
				userPassword: 'Password123',
				requestUserEmail: 'test@example.com',
			},
		};

		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
			setHeader: vi.fn(),
			cookie: vi.fn(),
		};
	});

	it('should return 400 if request is invalid', async () => {
		(isValidRequest as any).mockReturnValue(false);

		await loginUserController.loginUser(req as Request, res as Response);

		expect(isValidRequest).toHaveBeenCalledWith(req.body, loginUserTypes);
		expect(generateUserErrorResponse).toHaveBeenCalledWith(res, 'Dados Inválidos', 400);
	});

	it('should return 400 if password is invalid', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(isValidPassword as any).mockReturnValue(false);

		await loginUserController.loginUser(req as Request, res as Response);

		expect(isValidPassword).toHaveBeenCalledWith(req.body.userPassword);
		expect(generateUserErrorResponse).toHaveBeenCalledWith(res, 'Senha Inválida', 400);
	});

	it('should return 400 if email is invalid', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(isValidPassword as any).mockReturnValue(true);
		(isValidEmail as any).mockReturnValue(false);

		await loginUserController.loginUser(req as Request, res as Response);

		expect(isValidEmail).toHaveBeenCalledWith(req.body.userEmail);
		expect(generateUserErrorResponse).toHaveBeenCalledWith(res, 'Email Inválido', 400);
	});

	it('should return 401 if email or password is incorrect', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(isValidPassword as any).mockReturnValue(true);
		(isValidEmail as any).mockReturnValue(true);

		(loginUserService.execute as any).mockResolvedValue(undefined);

		await loginUserController.loginUser(req as Request, res as Response);

		expect(loginUserService.execute).toHaveBeenCalledWith(expect.any(UserDomain));
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			user: undefined,
			msg: 'Email ou senha incorretos',
		});
	});

	it('should return 201 if user is logged in successfully', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(isValidPassword as any).mockReturnValue(true);
		(isValidEmail as any).mockReturnValue(true);

		const user = new UserDomain({
			userEmail: 'test@example.com',
			userPassword: 'Password123',
		});
		user.getAccessToken = vi.fn().mockReturnValue('access-token');
		user.getAccessTokenExpiration = vi.fn().mockReturnValue('expiration-date');
		user.getUserId = vi.fn().mockReturnValue(1);

		(loginUserService.execute as any).mockResolvedValue(user);

		await loginUserController.loginUser(req as Request, res as Response);

		expect(loginUserService.execute).toHaveBeenCalledWith(expect.any(UserDomain));
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			user,
			msg: 'Usuário logado com sucesso',
			accessToken: user.getAccessToken(),
			accessTokenExpiration: user.getAccessTokenExpiration(),
		});
	});

	it('should return 500 if there is an internal server error', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(isValidPassword as any).mockReturnValue(true);
		(isValidEmail as any).mockReturnValue(true);

		const error = new Error('Internal Server Error');
		(loginUserService.execute as any).mockRejectedValue(error);

		await loginUserController.loginUser(req as Request, res as Response);

		expect(loginUserService.execute).toHaveBeenCalledWith(expect.any(UserDomain));
		expect(generateUserErrorResponse).toHaveBeenCalledWith(
			res,
			'Erro interno do servidor',
			500
		);
	});
});
