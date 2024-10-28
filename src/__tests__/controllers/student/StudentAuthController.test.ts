import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { StudentAuthController } from '../../../controllers/student/auth/StudentAuthController';
import { StudentLoginRedirectService } from '../../../services/student/StudentLoginRedirect';
import { Logger } from '../../../loggers/Logger';
import { AppError } from '../../../utils/errors/AppError';

vi.mock('../../../services/student/StudentLoginRedirect');
vi.mock('../../../loggers/Logger', () => {
	return {
		Logger: vi.fn().mockImplementation(() => {
			return {
				error: vi.fn(),
			};
		}),
	};
});

describe('StudentAuthController', () => {
	let studentAuthController: StudentAuthController;
	let studentLoginRedirectService: StudentLoginRedirectService;
	let req: Partial<Request>;
	let res: Partial<Response>;

	beforeEach(() => {
		vi.clearAllMocks();

		studentLoginRedirectService = new StudentLoginRedirectService();
		studentLoginRedirectService.generateLoginUrl = vi.fn();

		studentAuthController = new StudentAuthController(studentLoginRedirectService);

		req = {};
		res = {
			redirect: vi.fn() as any,
			status: vi.fn().mockReturnThis(),
			send: vi.fn(),
		};
	});

	it('should redirect to login URL when login method is called', () => {
		const redirectUrl = 'https://govbr.com/auth';
		(studentLoginRedirectService.generateLoginUrl as any).mockReturnValue(redirectUrl);

		studentAuthController.login(req as Request, res as Response);

		expect(studentLoginRedirectService.generateLoginUrl).toHaveBeenCalled();
		expect(res.redirect).toHaveBeenCalledWith(redirectUrl);
	});

	it('should handle AppError and respond with the appropriate status code and message', () => {
		const appError = new AppError('Erro ao gerar URL de login', 400);
		(studentLoginRedirectService.generateLoginUrl as any).mockImplementation(() => {
			throw appError;
		});

		studentAuthController.login(req as Request, res as Response);

		expect(studentLoginRedirectService.generateLoginUrl).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith('Erro ao gerar URL de login');
	});

	it('should handle generic error and respond with 500 status code', () => {
		const genericError = new Error('Erro desconhecido');
		(studentLoginRedirectService.generateLoginUrl as any).mockImplementation(() => {
			throw genericError;
		});

		studentAuthController.login(req as Request, res as Response);

		expect(studentLoginRedirectService.generateLoginUrl).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.send).toHaveBeenCalledWith('Erro interno do servidor');
	});
});
