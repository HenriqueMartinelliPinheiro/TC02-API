import { Router } from 'express';
import { CreateEventController } from '../controllers/event/CreateEventController';
import { PrismaClient } from '@prisma/client';
import { EventRepository } from '../repository/implementation/EventRepository';
import { CreateEventService } from '../services/event/CreateEventService';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { FetchAllEventStatusController } from '../controllers/event/enums/FetchAllEventStatusController';
import { eventRoles } from '../config/roles/event/eventRoles';
import { FetchAllEventsService } from '../services/event/FetchAllEventsService';
import { FetchAllEventsController } from '../controllers/event/FetchAllEventsController';

export const eventRouter = Router();

const prismaClient = new PrismaClient();

const eventRepository = new EventRepository(prismaClient);

const createEventService = new CreateEventService(eventRepository);
const createEventController = new CreateEventController(createEventService);

const fetchAllEventsService = new FetchAllEventsService(eventRepository);
const fetchAllEventsController = new FetchAllEventsController(fetchAllEventsService);

const fetchAllEventStatus = new FetchAllEventStatusController();

eventRouter.post(
	'/createEvent',
	authMiddleware,
	roleMiddleware(eventRoles.CREATE_EVENT_ROLES),
	createEventController.createEvent
);

eventRouter.get(
	'/fetchAllEventStatusOptions',
	authMiddleware,
	roleMiddleware(eventRoles.FETCH_ALL_EVENT_STATUS_ROLES),
	fetchAllEventStatus.fetchAllEventStatus
);

eventRouter.get(
	'/fetchAllEvents',
	authMiddleware,
	roleMiddleware(eventRoles.FETCH_ALL_EVENTS),
	fetchAllEventsController.fetchAllEvents
);
