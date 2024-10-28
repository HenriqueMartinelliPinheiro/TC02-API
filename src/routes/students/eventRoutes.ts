import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { EventRepository } from '../../repository/implementation/EventRepository';
import { FetchAllEventsService } from '../../services/event/FetchAllEventsService';
import { FetchAllEventsController } from '../../controllers/event/FetchAllEventsController';
import { GetEventByIdService } from '../../services/event/GetEventByIdService';
import { GetEventByIdController } from '../../controllers/event/GetEventByIdController';
import verifyHttpOnlyTokenMiddleware from '../../middlewares/studentAuthMiddleware';

export const eventStudentRouter = Router();

const prismaClient = new PrismaClient();

const eventRepository = new EventRepository(prismaClient);

const fetchAllEventsService = new FetchAllEventsService(eventRepository);
const fetchAllEventsController = new FetchAllEventsController(fetchAllEventsService);

const getEventByIdService = new GetEventByIdService(eventRepository);
const getEventByIdController = new GetEventByIdController(getEventByIdService);

eventStudentRouter.get(
	'/fetchEvents',
	verifyHttpOnlyTokenMiddleware,
	fetchAllEventsController.fetchAllEvents
);

eventStudentRouter.get(
	'/getEventByIdStudent/:eventId',
	verifyHttpOnlyTokenMiddleware,
	getEventByIdController.getEventById
);
