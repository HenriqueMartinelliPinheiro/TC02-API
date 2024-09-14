import { CreateEventService } from '../../services/event/CreateEventService';
import { Request, Response } from 'express';
import { createEventTypes } from '../../@types/event/createEventTypes';
import { EventDomain } from '../../domain/EventDomain';
import { AppError } from '../../utils/errors/AppError';
import { Logger } from '../../loggers/Logger';
import { eventLogPath } from '../../config/logPaths';
import { isValidRequest } from '../../utils/validations/isValidRequest';
import { EventActivityDomain } from '../../domain/EventActivityDomain';
import { EventLocationDomain } from '../../domain/EventLocationDomain';
import { isValidEventDate } from '../../utils/validations/isValidEventDate';
import { EventCourseDomain } from '../../domain/EventCourseDomain';

export class CreateEventController {
	private createEventService: CreateEventService;
	private logger: Logger;

	constructor(createEventService: CreateEventService) {
		this.createEventService = createEventService;
		this.logger = new Logger('CreateEventController', eventLogPath);
	}

	createEvent = async (req: Request, res: Response) => {
		let event;
		try {
			const error = isValidRequest(req.body, createEventTypes);
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

			const eventCourses = req.body.selectedCourses.map((course: any) => {
				return new EventCourseDomain({
					courseId: course.courseId,
					courseName: course.courseName,
				});
			});

			event = new EventDomain({
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

			const createdEvent = await this.createEventService.execute(event, eventCourses);

			this.logger.info(
				`Evento criado com sucesso ${createdEvent.eventId}`,
				req.requestEmail
			);
			return res.status(201).json({
				event: createdEvent,
				msg: 'Evento Criado com Sucesso',
			});
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.requestEmail);
				return res.status(error.statusCode).json({
					event: undefined,
					msg: error.message,
				});
			}
			this.logger.error(
				'Erro ao criar Evento',
				req.requestEmail || 'Desconhecido',
				error
			);
			return res.status(500).json({
				event: undefined,
				msg: 'Erro interno do Servidor',
			});
		}
	};
}
