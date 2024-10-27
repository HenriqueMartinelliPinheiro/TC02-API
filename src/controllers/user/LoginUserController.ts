import { Request, Response } from 'express';
import { isValidPassword } from '../../utils/validations/isValidPassword';
import { isValidRequest } from '../../utils/validations/isValidRequest';
import { generateUserErrorResponse } from '../../utils/generateUserErrorResponse';
import { UserDomain } from '../../domain/UserDomain';
import { Logger } from '../../loggers/Logger';
import { userLogPath } from '../../config/logPaths';
import { LoginUserService } from '../../services/user/LoginUserService';
import { loginUserTypes } from '../../@types/user/loginUserTypes';
import { AppError } from '../../utils/errors/AppError';

export class LoginUserController {
	private loginUserService: LoginUserService;
	private logger: Logger;

	constructor(loginUserService: LoginUserService) {
		this.logger = new Logger('LoginUserController', userLogPath);
		this.loginUserService = loginUserService;
		this.loginUser = this.loginUser.bind(this);
	}

	async loginUser(req: Request, res: Response) {
		const error = isValidRequest(req.body, loginUserTypes);
		if (typeof error === 'string') {
			this.logger.error(`Dados inválidos no Login: ${req.body.userEmail}`, error);
			return res.status(400).json({
				msg: error,
				user: undefined,
			});
		}

		if (!isValidPassword(req.body.userPassword)) {
			this.logger.error(`Senha Inválida: ${req.body.userEmail}`);
			return res.status(400).json({
				msg: 'Senha Inválida',
				user: undefined,
			});
		}

		try {
			const user = await this.loginUserService.execute(
				new UserDomain({
					userEmail: req.body.userEmail,
					userPassword: req.body.userPassword,
				})
			);

			if (!user) {
				this.logger.warn('Usuário ou senha incorretos');
				return res.status(401).json({
					user: undefined,
					msg: 'Email ou senha incorretos',
				});
			}

			this.logger.info(`Usuário logado`, req.body.userEmail);
			console.log('Token:', user.getAccessToken());
			res.cookie('token', user.getAccessToken(), {
				httpOnly: true,
				//secure: true,
				sameSite: 'strict',
				path: '/',
			});

			return res.status(201).json({
				user,
				msg: 'Usuário logado com sucesso',
				accessToken: user.getAccessToken(),
				accessTokenExpiration: user.getAccessTokenExpiration(),
			});
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.body.userEmail);
				return res.status(error.statusCode).json({
					user: undefined,
					msg: error.message,
				});
			}

			this.logger.error('Erro ao fazer login', req.body.userEmail, error);
			return res.status(500).json({
				user: undefined,
				msg: 'Erro desconhecido ao fazer login',
			});
		}
	}
}
