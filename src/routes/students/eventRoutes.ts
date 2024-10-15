import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { EventRepository } from '../../repository/implementation/EventRepository';
import { FetchAllEventsService } from '../../services/event/FetchAllEventsService';
import { FetchAllEventsController } from '../../controllers/event/FetchAllEventsController';
import { GetEventByIdService } from '../../services/event/GetEventByIdService';
import { GetEventByIdController } from '../../controllers/event/GetEventByIdController';

export const eventStudentRouter = Router();

const prismaClient = new PrismaClient();

const eventRepository = new EventRepository(prismaClient);

const fetchAllEventsService = new FetchAllEventsService(eventRepository);
const fetchAllEventsController = new FetchAllEventsController(fetchAllEventsService);

const getEventByIdService = new GetEventByIdService(eventRepository);
const getEventByIdController = new GetEventByIdController(getEventByIdService);

eventStudentRouter.get(
	'/fetchEvents',
	// authMiddleware,
	// roleMiddleware(eventRoles.FETCH_ALL_EVENTS),
	fetchAllEventsController.fetchAllEvents
);

eventStudentRouter.get(
	'/getEventByIdStudent/:eventId',
	// authMiddleware,
	// roleMiddleware(eventRoles.GET_EVENT_BY_ID),
	getEventByIdController.getEventById
);
