import { govbrOauth } from 'govbr-oauth';
import { AppError } from '../../utils/errors/AppError';

export class StudentLoginService {
	config = {
		URL_PROVIDER: process.env.GOVBR_URL_PROVIDER,
		URL_SERVICE: process.env.GOVBR_URL_SERVICE,
		REDIRECT_URI: process.env.GOVBR_REDIRECT_URI,
		SCOPES: process.env.GOVBR_SCOPES,
		CLIENT_ID: process.env.GOVBR_CLIENT_ID,
		SECRET: process.env.GOVBR_SECRET,
	};

	generateLoginUrl(): string {
		try {
			return govbrOauth.authorize(this.config);
		} catch (error) {
			throw new AppError('Erro ao gerar URL de login', 500);
		}
	}
}
