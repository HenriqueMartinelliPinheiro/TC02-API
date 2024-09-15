import { PrismaClient, EventLocation } from '@prisma/client';
import { IEventLocationRepository } from '../interfaces/IEventLocationRepository';

export class EventLocationRepository implements IEventLocationRepository {
	private prismaClient: PrismaClient;

	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}

	findEventLocationByEventId = async (eventId: number): Promise<EventLocation | null> => {
		try {
			const eventLocation = await this.prismaClient.eventLocation.findUnique({
				where: {
					eventId: eventId,
				},
			});

			return eventLocation;
		} catch (error) {
			throw new Error(`Erro ao buscar a localização do evento ${eventId}`);
		}
	};
}
