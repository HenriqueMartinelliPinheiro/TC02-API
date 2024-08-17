import { EventRepository } from '../../repository/implementation/EventRepository';
import { IEventRepository } from '../../repository/interfaces/IEventRepository';
import { PrismaClient } from '@prisma/client';
import { CreateEventService } from '../../services/event/CreateEventService';
import { Request, Response } from 'express';
import { createEventTypes } from '../../@types/event/createEventTypes';
import { EventDomain } from '../../domain/EventDomain';
import { AppError } from '../../utils/errors/AppError';
import { Logger } from '../../loggers/Logger';
import { eventLogPath } from '../../config/logPaths';
import { isValidRequest } from '../../utils/validations/isValidRequest';
import { EventActivityDomain } from '../../domain/EventActivityDomain';

export class CreateEventController {
	private createEventService: CreateEventService;
	private logger: Logger;

	constructor(createEventService: CreateEventService) {
		this.createEventService = createEventService;
		this.logger = new Logger('CreateEventController', eventLogPath);
	}

	createEvent = async (req: Request, res: Response) => {
		try {
			if (!isValidRequest(req.body, createEventTypes)) {
				return res.status(400).json({
					event: undefined,
					msg: 'Dados Inválidos',
				});
			}

			const eventActivities = req.body.eventActivities.map((activity: any) => {
				return new EventActivityDomain({
					eventActivityStartDate: activity.eventActivityStartDate,
					eventActivityEndDate: activity.eventActivityEndDate,
					eventActivityDescription: activity.eventActivityDescription,
				});
			});

			const event = new EventDomain({
				eventEndDate: req.body.eventEndDate,
				eventStartDate: req.body.eventStartDate,
				eventTitle: req.body.eventTitle,
				eventActivities: eventActivities,
				eventStatus: req.body.eventStatus,
			});

			const createdEvent = await this.createEventService.execute(event, req.body.courses);

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
			this.logger.error('Erro ao criar Evento', req.requestEmail, error);
			return res.status(500).json({
				event: undefined,
				msg: 'Erro interno do Servidor',
			});
		}
	};
}
