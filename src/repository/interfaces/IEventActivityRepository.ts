import { EventActivity } from '@prisma/client';

export interface IEventActivityRepository {
	fetchEventActivityById(eventActivityId: number): Promise<EventActivity | undefined>;
	fetchEventActivitiesByEventId(eventId: number): Promise<EventActivity[]>;
}
