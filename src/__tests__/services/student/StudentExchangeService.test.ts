import { describe, it, expect, vi, beforeEach } from 'vitest'; // Adicionei beforeEach na importação
import { StudentExchangeService } from '../../../services/student/StudentAuthExchangeService';
import { govbrOauth } from 'govbr-oauth';
import { AppError } from '../../../utils/errors/AppError';

vi.mock('govbr-oauth', () => ({
	govbrOauth: {
		getToken: vi.fn(),
	},
}));

describe('StudentExchangeService', () => {
	let studentExchangeService: StudentExchangeService;

	beforeEach(() => {
		vi.clearAllMocks();
		studentExchangeService = new StudentExchangeService();
	});

	it('should exchange code for token successfully', async () => {
		const tokenData = {
			access_token: 'access_token',
			claims: { sub: 'studentCpf' },
		};
		(govbrOauth.getToken as any).mockResolvedValue(tokenData);

		const result = await studentExchangeService.exchangeCodeForToken(
			'authorization_code'
		);

		expect(govbrOauth.getToken).toHaveBeenCalledWith(
			studentExchangeService.config,
			'authorization_code'
		);
		expect(result).toEqual(tokenData);
	});

	it('should throw AppError if getToken fails', async () => {
		const error = new Error('Erro de autenticação');
		(govbrOauth.getToken as any).mockRejectedValue(error);

		await expect(
			studentExchangeService.exchangeCodeForToken('authorization_code')
		).rejects.toThrow(AppError);
		await expect(
			studentExchangeService.exchangeCodeForToken('authorization_code')
		).rejects.toThrow('Erro ao trocar código por token');
	});
});
