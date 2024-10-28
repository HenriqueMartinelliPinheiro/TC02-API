import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StudentLoginRedirectService } from '../../../services/student/StudentLoginRedirect';
import { govbrOauth } from 'govbr-oauth';
import { AppError } from '../../../utils/errors/AppError';

vi.mock('govbr-oauth', () => ({
	govbrOauth: {
		authorize: vi.fn(),
	},
}));

describe('StudentLoginRedirectService', () => {
	let studentLoginRedirectService: StudentLoginRedirectService;

	beforeEach(() => {
		vi.clearAllMocks();
		studentLoginRedirectService = new StudentLoginRedirectService();
	});

	it('should generate a login URL successfully', () => {
		// Simulação do valor retornado pela função de autenticação do govbrOauth
		const loginUrl = 'https://govbr.com/auth';
		(govbrOauth.authorize as any).mockReturnValue(loginUrl);

		const result = studentLoginRedirectService.generateLoginUrl();

		// Verifica se a função authorize foi chamada com a configuração correta
		expect(govbrOauth.authorize).toHaveBeenCalledWith(studentLoginRedirectService.config);
		expect(result).toBe(loginUrl);
	});

	it('should throw AppError if there is an error generating the login URL', () => {
		// Simulação para fazer com que a função authorize lance um erro
		const error = new Error('Erro ao autenticar');
		(govbrOauth.authorize as any).mockImplementation(() => {
			throw error;
		});

		// Utiliza uma função para verificar a exceção
		expect(() => studentLoginRedirectService.generateLoginUrl()).toThrow(AppError);
		expect(() => studentLoginRedirectService.generateLoginUrl()).toThrow(
			'Erro ao gerar URL de login'
		);
	});
});
