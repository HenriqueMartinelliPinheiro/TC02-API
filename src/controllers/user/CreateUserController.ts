import { Request, Response } from 'express';
import { CreateUserService } from '../../services/user/CreateUserService';
import { isValidPassword } from '../../utils/validations/isValidPassword';
import { createUserTypes } from '../../@types/user/createUserTypes';
import { isValidRequest } from '../../utils/validations/isValidRequest';
import { UserDomain } from '../../domain/UserDomain';
import { RoleDomain } from '../../domain/RoleDomain';
import { Logger } from '../../loggers/Logger';
import { userLogPath } from '../../config/logPaths';
import { AppError } from '../../utils/errors/AppError';

export class CreateUserController {
	private createUserService: CreateUserService;
	private logger: Logger;
	constructor(createUserService: CreateUserService) {
		this.logger = new Logger('CreateUserController', userLogPath);
		this.createUserService = createUserService;
		this.createUser = this.createUser.bind(this);
	}

	async createUser(req: Request, res: Response) {
		if (!isValidRequest(req.body, createUserTypes)) {
			this.logger.warn(
				`Dados inválidos ao criar usuário ${req.body.userEmail}`,
				req.requestEmail
			);
			return res.status(400).json({
				msg: 'Dados inválidos',
				user: undefined,
			});
		}

		if (!isValidPassword(req.body.userPassword)) {
			this.logger.warn(`Senha inválida ao criar usuário`, req.requestEmail);
			return res.status(400).json({
				msg: 'Senha inválida',
				user: undefined,
			});
		}

		try {
			const user = await this.createUserService.execute(
				new UserDomain({
					userName: req.body.userName,
					userEmail: req.body.userEmail,
					userPassword: req.body.userPassword,
					role: new RoleDomain({
						roleId: req.body.roleId,
						roleTitle: req.body.roleTitle,
					}),
				})
			);

			this.logger.info(`User Id ${user.getUserId()} created`, req.requestEmail);
			return res.status(201).json({
				user,
				msg: 'Usuário criado com sucesso',
			});
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.requestEmail);
				return res.status(error.statusCode).json({
					user: undefined,
					msg: error.message,
				});
			}
			this.logger.error('Erro ao criar usuário', req.requestEmail, error);
			return res.status(500).json({
				user: undefined,
				msg: 'Erro ao criar usuário',
			});
		}
	}
}
