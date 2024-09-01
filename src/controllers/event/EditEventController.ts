import { EditEventService } from '../../services/event/EditEventService';
import { Request, Response } from 'express';
import { EventDomain } from '../../domain/EventDomain';
import { AppError } from '../../utils/errors/AppError';
import { Logger } from '../../loggers/Logger';
import { eventLogPath } from '../../config/logPaths';
import { isValidRequest } from '../../utils/validations/isValidRequest';
import { EventActivityDomain } from '../../domain/EventActivityDomain';
import { EventLocationDomain } from '../../domain/EventLocationDomain';
import { isValidEventDate } from '../../utils/validations/isValidEventDate';
import { editEventTypes } from '../../@types/event/editEventTypes';

export class EditEventController {
	private editEventService: EditEventService;
	private logger: Logger;

	constructor(editEventService: EditEventService) {
		this.editEventService = editEventService;
		this.logger = new Logger('EditEventController', eventLogPath);
	}

	editEvent = async (req: Request, res: Response) => {
		let event;
		try {
			const error = isValidRequest(req.body, editEventTypes);
			if (typeof error === 'string') {
				this.logger.error(error, req.requestEmail);
				return res.status(400).json({
					event: undefined,
					msg: error,
				});
			}

			const eventActivities = req.body.eventActivities.map((activity: any) => {
				return new EventActivityDomain({
					eventActivityTitle: activity.eventActivityTitle,
					eventActivityStartDate: new Date(activity.eventActivityStartDate),
					eventActivityEndDate: new Date(activity.eventActivityEndDate),
					eventActivityDescription: activity.eventActivityDescription,
				});
			});

			if (
				!isValidEventDate(
					new Date(req.body.eventStartDate),
					new Date(req.body.eventEndDate),
					eventActivities
				)
			) {
				this.logger.error('Datas Inválidas', req.requestEmail);
				return res.status(400).json({
					event: undefined,
					msg: 'Datas Inválidas',
				});
			}

			event = new EventDomain({
				eventId: req.body.eventId,
				eventEndDate: new Date(req.body.eventEndDate),
				eventStartDate: new Date(req.body.eventStartDate),
				eventTitle: req.body.eventTitle,
				eventActivities: eventActivities,
				eventStatus: req.body.eventStatus,
				eventLocation:
					req.body.eventLatitude && req.body.eventLongitude && req.body.eventRadius
						? new EventLocationDomain({
								latitude: req.body.eventLatitude,
								longitude: req.body.eventLongitude,
								radius: req.body.eventRadius,
						  })
						: undefined,
			});

			const updatedEvent = await this.editEventService.execute(
				event,
				req.body.selectedCoursesIds
			);

			this.logger.info(
				`Evento atualizado com sucesso ${updatedEvent.eventId}`,
				req.requestEmail
			);
			return res.status(200).json({
				event: updatedEvent,
				msg: 'Evento Atualizado com Sucesso',
			});
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.requestEmail);
				return res.status(error.statusCode).json({
					event: undefined,
					msg: error.message,
				});
			}
			this.logger.error('Erro ao atualizar Evento', req.requestEmail, error);
			return res.status(500).json({
				event: undefined,
				msg: 'Erro interno do Servidor',
			});
		}
	};
}
