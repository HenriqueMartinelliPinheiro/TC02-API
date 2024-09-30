import { Event, Prisma } from '@prisma/client';
import { EventDomain } from '../../domain/EventDomain';
import { EventCourseDomain } from '../../domain/EventCourseDomain';

export interface IEventRepository {
	createEvent(event: EventDomain, courses: EventCourseDomain[]): Promise<Event>;

	createEventWithLocation(
		event: EventDomain,
		courses: EventCourseDomain[]
	): Promise<Event>;

	fetchAllEvents(
		skip: number,
		take: number,
		searchTerm: string
	): Promise<{ events: EventDomain[] | undefined; total: number }>;

	fetchEventById(eventId: number): Promise<Prisma.EventGetPayload<{
		include: { eventActivity: true; eventCourse: true; eventLocation: true };
	}> | null>;

	editEventWithLocation(
		event: EventDomain,
		courses: EventCourseDomain[]
	): Promise<Event | undefined>;
	editEvent(event: EventDomain, courses: EventCourseDomain[]): Promise<Event | undefined>;
}
