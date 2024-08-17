import { Logger } from '../../../loggers/Logger';
import { eventLogPath } from '../../../config/logPaths';
import { getAllEventStatusValues } from '../../../utils/simpleQuerries/eventStatusEnums';

export class FetchAllEventStatusController {
	private logger: Logger;

	constructor() {
		this.logger = new Logger('FetchAllEventStatusController', eventLogPath);
		this.fetchAllEventStatus = this.fetchAllEventStatus.bind(this);
	}
	async fetchAllEventStatus(req, res) {
		try {
			const status = await getAllEventStatusValues();

			this.logger.info('Status retornados com sucesso.');
			res.status(200).json({
				status: status,
				msg: 'Status retornados com sucesso',
			});
		} catch (error) {
			this.logger.error('Erro ao Buscar Cursos', req.requestEmail, error);
			return res.status(500).json({
				status: null,
				total: 0,
				msg: 'Erro ao buscar status',
			});
		}
	}
}
