import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { AuthExchangeController } from '../../../controllers/student/auth/StudentAuthExchangeController';
import { StudentExchangeService } from '../../../services/student/StudentAuthExchangeService';
import { StudentLoginService } from '../../../services/student/StudentLoginService';
import { AppError } from '../../../utils/errors/AppError';
import { isValidRequest } from '../../../utils/validations/isValidRequest';

vi.mock('../../../services/student/StudentAuthExchangeService');
vi.mock('../../../services/student/StudentLoginService');
vi.mock('../../../loggers/Logger', () => {
	return {
		Logger: vi.fn().mockImplementation(() => {
			return {
				error: vi.fn(),
			};
		}),
	};
});
vi.mock('../../../utils/validations/isValidRequest');

describe('AuthExchangeController', () => {
	let authExchangeController: AuthExchangeController;
	let exchangeService: StudentExchangeService;
	let loginService: StudentLoginService;
	let req: Partial<Request>;
	let res: Partial<Response>;

	beforeEach(() => {
		vi.clearAllMocks();

		exchangeService = new StudentExchangeService();
		loginService = new StudentLoginService({} as any);

		// Injetando o mock do loginService manualmente
		authExchangeController = new AuthExchangeController(exchangeService);
		(authExchangeController as any).studentLoginService = loginService;

		req = {
			body: {
				code: 'authorization_code',
			},
		};

		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
			cookie: vi.fn(),
			send: vi.fn(),
		};
	});

	it('should return 400 if request is invalid', async () => {
		(isValidRequest as any).mockReturnValue('Dados inválidos');

		await authExchangeController.exchange(req as Request, res as Response);

		expect(isValidRequest).toHaveBeenCalledWith(req.body, expect.anything());
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			msg: 'Dados inválidos',
			user: undefined,
		});
	});

	it('should return 200 if authentication is successful', async () => {
		(isValidRequest as any).mockReturnValue(true);
		const token = {
			access_token: 'access_token',
			claims: { sub: 'studentCpf' },
		};
		(exchangeService.exchangeCodeForToken as any).mockResolvedValue(token);

		const studentLogin = {
			getAccessToken: vi.fn().mockReturnValue('jwt_token'),
		};
		(loginService.execute as any).mockResolvedValue(studentLogin);

		await authExchangeController.exchange(req as Request, res as Response);

		expect(exchangeService.exchangeCodeForToken).toHaveBeenCalledWith(req.body.code);
		expect(loginService.execute).toHaveBeenCalledWith('studentCpf', token.access_token);
		expect(res.cookie).toHaveBeenCalledWith('token', 'jwt_token', {
			httpOnly: true,
			secure: true,
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			msg: 'Sucesso ao autenticar',
			studentCpf: 'studentCpf',
		});
	});

	it('should handle AppError correctly', async () => {
		(isValidRequest as any).mockReturnValue(true);
		const appError = new AppError('Erro ao trocar código por token', 400);
		(exchangeService.exchangeCodeForToken as any).mockRejectedValue(appError);

		await authExchangeController.exchange(req as Request, res as Response);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith('Erro ao trocar código por token');
	});

	it('should handle generic error and respond with 500 status', async () => {
		(isValidRequest as any).mockReturnValue(true);
		const genericError = new Error('Erro desconhecido');
		(exchangeService.exchangeCodeForToken as any).mockRejectedValue(genericError);

		await authExchangeController.exchange(req as Request, res as Response);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.send).toHaveBeenCalledWith('Falha ao Autenticar');
	});
});
