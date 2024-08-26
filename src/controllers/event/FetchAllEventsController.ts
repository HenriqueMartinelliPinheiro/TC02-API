import { Logger } from '../../loggers/Logger';
import { eventLogPath } from '../../config/logPaths';
import { FetchAllEventsService } from '../../services/event/FetchAllEventsService';
import { AppError } from '../../utils/errors/AppError';

export class FetchAllEventsController {
	private fetchAllEventsService: FetchAllEventsService;
	private logger: Logger;

	constructor(fetchAllEventsService: FetchAllEventsService) {
		this.fetchAllEventsService = fetchAllEventsService;
		this.logger = new Logger('FetchAllEventsController', eventLogPath);
		this.fetchAllEvents = this.fetchAllEvents.bind(this);
	}

	async fetchAllEvents(req, res) {
		try {
			const { skip = 0, take = 0, searchTerm = '' } = req.query;

			const { events, total } = await this.fetchAllEventsService.execute(
				Number(skip),
				Number(take),
				searchTerm
			);

			this.logger.info('Eventos retornados', req.requestEmail);
			return res.status(201).json({
				total: total,
				events: events,
				msg: 'Eventos Retornados com Sucesso',
			});
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.requestEmail, error);
				return res.status(error.statusCode).json({
					total: 0,
					events: null,
					msg: error.message,
				});
			}
			this.logger.error('Erro ao Buscar Eventos', req.requestEmail, error);
			return res.status(500).json({
				events: null,
				total: 0,
				msg: 'Erro ao Buscar Eventos',
			});
		}
	}
}
