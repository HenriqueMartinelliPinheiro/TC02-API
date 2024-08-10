import { Logger } from '../../loggers/Logger';
import { roleLogPath } from '../../config/logPaths';
import { FetchAllRolesService } from '../../services/role/FetchAllRolesService';
import { AppError } from '../../utils/errors/AppError';

export class FetchAllRolesController {
	private fetchAllRolesService: FetchAllRolesService;
	private logger: Logger;

	constructor(fetchAllRolesService: FetchAllRolesService) {
		this.fetchAllRolesService = fetchAllRolesService;
		this.logger = new Logger('FetchAllRolesController', roleLogPath);
		this.fetchAllRoles = this.fetchAllRoles.bind(this);
	}
	async fetchAllRoles(req, res) {
		try {
			const roles = await this.fetchAllRolesService.execute();
			this.logger.info('Roles retornados', req.requestEmail);
			return res.status(201).json({
				roles: roles,
				msg: 'Cargos Retornados com Sucesso',
			});
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.requestEmail, error);
				return res.status(error.statusCode).json({
					roles: null,
					msg: error.message,
				});
			}
			this.logger.error('Erro ao Buscar Roles', req.requestEmail, error);
			return res.status(500).json({
				roles: null,
				msg: 'Erro ao Buscar Cargos',
			});
		}
	}
}
