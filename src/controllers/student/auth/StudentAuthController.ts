import { Request, Response } from 'express';
import { Logger } from '../../../loggers/Logger';
import { StudentLoginRedirectService } from '../../../services/student/StudentLoginRedirect';
import { AppError } from '../../../utils/errors/AppError';
import { studentLoginLogPath } from '../../../config/logPaths';

export class StudentAuthController {
	private studentLoginRedirectService: StudentLoginRedirectService;
	private logger: Logger;

	constructor(loginService: StudentLoginRedirectService) {
		this.studentLoginRedirectService = loginService;
		this.logger = new Logger('studentAuth', studentLoginLogPath);
	}

	login = (req: Request, res: Response) => {
		try {
			const redirectUrl = this.studentLoginRedirectService.generateLoginUrl();
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
