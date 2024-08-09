import { isValidRequest } from '../../utils/validations/isValidRequest';
import { createRoleTypes } from '../../@types/role/createRoleTypes';
import { CreateRoleService } from '../../services/role/CreateRoleService';
import { RoleDomain } from '../../domain/RoleDomain';
import { Logger } from '../../loggers/Logger';
import { roleLogPath } from '../../config/logPaths';

export class CreateRoleController {
	private createRoleService: CreateRoleService;
	private logger: Logger;

	constructor(createRoleService) {
		this.createRoleService = createRoleService;
		this.logger = new Logger('CreateRoleController', roleLogPath);
		this.createRole = this.createRole.bind(this);
	}
	async createRole(req, res) {
		try {
		} catch (error) {
			this.logger.error('Error on creating role', req.requestEmail, error);
			return res.status(400).json({
				role: undefined,
				msg: 'Erro ao criar curso',
			});
		}
	}
}
