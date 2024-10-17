import { Event, Prisma } from '@prisma/client';
import { EventDomain } from '../../domain/EventDomain';
import { EventCourseDomain } from '../../domain/EventCourseDomain';
import { EventActivityDomain } from '../../domain/EventActivityDomain';

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

	getEventActivitiesByEventId(eventId: number): Promise<any>;

	removeEventActivity(activityId: number): Promise<any>;

	updateEventActivity(activity: EventActivityDomain, eventId: number): Promise<any>;

	addEventActivity(activity: EventActivityDomain, eventId: number): Promise<any>;

	getAttendanceRecordsByActivityId(activityId: number): Promise<any>;
}
