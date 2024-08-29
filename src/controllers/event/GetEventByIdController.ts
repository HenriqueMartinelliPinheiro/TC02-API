import { getEventByIdTypes } from '../../@types/event/getEventById';
import { eventLogPath } from '../../config/logPaths';
import { Logger } from '../../loggers/Logger';
import { GetEventByIdService } from '../../services/event/GetCourseByIdService';
import { AppError } from '../../utils/errors/AppError';
import { isValidRequest } from '../../utils/validations/isValidRequest';

export class GetEventByIdController {
	private getEventByIdService: GetEventByIdService;
	private logger: Logger;

	constructor(service: GetEventByIdService) {
		this.getEventByIdService = service;
		this.logger = new Logger('GetEventByIdController', eventLogPath);
	}

	async getEventById(req, res) {
		try {
			const error = isValidRequest(req.params, getEventByIdTypes);

			if (typeof error === 'string') {
				this.logger.warn(error, req.requestEmail);
				return res.status(400).json({
					event: undefined,
					msg: error,
				});
			}

			const event = await this.getEventByIdService.execute(req.params.eventId);

			if (!event) {
				this.logger.info('Evento não encontrado', req.requestEmail);
				return res.status(404).json({
					event: undefined,
					msg: 'Evento não encontrado',
				});
			}

			this.logger.info('Evento retornado com sucesso', req.requestEmail);

			return res.status(200).json({
				event: event,
				msg: 'Evento retornado com sucesso',
			});
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.requestEmail);
				return res.status(error.statusCode).json({
					event: undefined,
					msg: error.message,
				});
			}
			return res.status(500).json({
				msg: 'Erro Interno do Servidor',
				event: undefined,
			});
		}
	}
}
