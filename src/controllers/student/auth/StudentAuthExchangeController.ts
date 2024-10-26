import { Request, Response } from 'express';
import { Logger } from '../../../loggers/Logger';
import { StudentExchangeService } from '../../../services/student/StudentAuthExchangeService';
import { AppError } from '../../../utils/errors/AppError';

export class AuthExchangeController {
	private exchangeService: StudentExchangeService;
	private logger: Logger;

	constructor(exchangeService: StudentExchangeService) {
		this.exchangeService = exchangeService;
		this.logger = new Logger('StudentAuth', 'StudentAuthController');
	}

	exchange = async (req: Request, res: Response) => {
		const { code } = req.body;

		if (!code) {
			this.logger.error('Código não fornecido', req.requestEmail);
			return res.status(400).send('Code not provided');
		}

		try {
			const token = await this.exchangeService.exchangeCodeForToken(code);
			res.cookie('govbr_access_token', token.access_token, {
				httpOnly: true,
				secure: true,
			});
			console.log(token);
			return res.status(200).send('Sucesso ao autenticar');
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.requestEmail);
				return res.status(error.statusCode).send(error.message);
			}
			this.logger.error('Erro ao trocar código por token', req.requestEmail, error);
			return res.status(500).send('Falha ao Autenticar');
		}
	};
}
