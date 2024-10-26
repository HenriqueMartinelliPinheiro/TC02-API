import { govbrOauth } from 'govbr-oauth';
import { AppError } from '../../utils/errors/AppError';

export class StudentExchangeService {
	config = {
		URL_PROVIDER: process.env.GOVBR_URL_PROVIDER,
		URL_SERVICE: process.env.GOVBR_URL_SERVICE,
		REDIRECT_URI: process.env.GOVBR_REDIRECT_URI,
		SCOPES: process.env.GOVBR_SCOPES,
		CLIENT_ID: process.env.GOVBR_CLIENT_ID,
		SECRET: process.env.GOVBR_SECRET,
	};
	async exchangeCodeForToken(code: string) {
		try {
			return await govbrOauth.getToken(this.config, code);
		} catch (error) {
			throw new AppError('Erro ao trocar código por token', 500);
		}
	}
}
