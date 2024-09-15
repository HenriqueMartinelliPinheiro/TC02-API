import { EventLocation } from '@prisma/client';

export interface IEventLocationRepository {
	findEventLocationByEventId(eventId: number): Promise<EventLocation | null>;
}
