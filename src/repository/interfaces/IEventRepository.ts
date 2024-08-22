import { Event } from '@prisma/client';
import { EventDomain } from '../../domain/EventDomain';

export interface IEventRepository {
	createEvent(event: EventDomain, courses: [number]): Promise<Event>;
	createEventWithLocation(event: EventDomain, courses: [number]): Promise<Event>;
}
