import { Request, Response } from 'express';
import { Logger } from '../../../loggers/Logger';
import { StudentExchangeService } from '../../../services/student/StudentAuthExchangeService';
import { AppError } from '../../../utils/errors/AppError';
import { StudentLoginService } from '../../../services/student/StudentLoginService';
import { StudentLoginRepository } from '../../../repository/implementation/StudentLoginRepository';
import { PrismaClient } from '@prisma/client';
import { studentLoginLogPath } from '../../../config/logPaths';

export class AuthExchangeController {
	private exchangeService: StudentExchangeService;
	private logger: Logger;
	private studentLoginService: StudentLoginService;
	private studentLoginRepository: StudentLoginRepository;

	constructor(exchangeService: StudentExchangeService) {
		this.exchangeService = exchangeService;
		this.logger = new Logger('StudentAuth', studentLoginLogPath);
		const prismaClient = new PrismaClient();
		this.studentLoginRepository = new StudentLoginRepository(prismaClient);
		this.studentLoginService = new StudentLoginService(this.studentLoginRepository);
	}

	exchange = async (req: Request, res: Response) => {
		const { code } = req.body;

		if (!code) {
			this.logger.error('Código não fornecido', req.requestEmail);
			return res.status(400).send('Code not provided');
		}

		try {
			const token = await this.exchangeService.exchangeCodeForToken(code);
			const accessToken = token.access_token;
			const studentCpf = token.claims.sub;
			await this.studentLoginService.execute(studentCpf, accessToken);

			res.cookie('govbr_access_token', token.access_token, {
				httpOnly: true,
				secure: true,
			});

			return res.status(200).json({
				msg: 'Sucesso ao autenticar',
				studentCpf: studentCpf,
			});
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
