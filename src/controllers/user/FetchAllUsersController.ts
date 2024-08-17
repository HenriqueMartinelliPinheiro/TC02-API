import { Logger } from '../../loggers/Logger';
import { userLogPath } from '../../config/logPaths';
import { FetchAllUsersService } from '../../services/user/FetchAllUsersService';
import { AppError } from '../../utils/errors/AppError';

export class FetchAllUsersController {
	private fetchAllUsersService: FetchAllUsersService;
	private logger: Logger;

	constructor(fetchAllUsersService) {
		this.fetchAllUsersService = fetchAllUsersService;
		this.logger = new Logger('FetchAllUsersController', userLogPath);
		this.fetchAllUsers = this.fetchAllUsers.bind(this);
	}
	async fetchAllUsers(req, res) {
		try {
			const { skip = 0, take = 0, searchTerm = '' } = req.query;

			const { users, total } = await this.fetchAllUsersService.execute(
				Number(skip),
				Number(take),
				searchTerm
			);

			this.logger.info('Usuários retornados', req.requestEmail);
			return res.status(201).json({
				total: total,
				users: users,
				msg: 'Usuários Retornados com Sucesso',
			});
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.requestEmail, error);
				return res.status(error.statusCode).json({
					total: 0,
					users: null,
					msg: error.message,
				});
			}
			this.logger.error('Erro ao Buscar Usuários', req.requestEmail, error);
			return res.status(500).json({
				users: null,
				total: 0,
				msg: 'Erro ao Buscar Usuários',
			});
		}
	}
}
