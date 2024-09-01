import { Event } from '@prisma/client';
import { EventDomain } from '../../domain/EventDomain';

export interface IEventRepository {
	createEvent(event: EventDomain, courses: number[]): Promise<Event>;
	createEventWithLocation(event: EventDomain, courses: number[]): Promise<Event>;
	fetchAllEvents(
		skip: number,
		take: number,
		searchTerm: string
	): Promise<{ events: EventDomain[] | undefined; total: number }>;
	fetchEventById(eventId: number): Promise<Event>;
	editEventWithLocation(
		event: EventDomain,
		courses: number[]
	): Promise<Event | undefined>;
	editEvent(event: EventDomain, courses: number[]): Promise<Event | undefined>;
}
