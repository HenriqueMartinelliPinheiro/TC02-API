import { Request, Response } from 'express';
import { Logger } from '../../../loggers/Logger';
import { StudentLoginService } from '../../../services/student/StudentLoginRedirect';
import { AppError } from '../../../utils/errors/AppError';

export class StudentAuthController {
	private loginService: StudentLoginService;
	private logger: Logger;

	constructor(loginService: StudentLoginService) {
		this.loginService = loginService;
		this.logger = new Logger('studentAuth', 'StudentAuthController');
	}

	login = (req: Request, res: Response) => {
		try {
			const redirectUrl = this.loginService.generateLoginUrl();
			res.redirect(redirectUrl);
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message);
				return res.status(error.statusCode).send(error.message);
			}
			this.logger.error('Erro ao gerar URL de login', 'Desconhecido', error);
			return res.status(500).send('Erro interno do servidor');
		}
	};
}
