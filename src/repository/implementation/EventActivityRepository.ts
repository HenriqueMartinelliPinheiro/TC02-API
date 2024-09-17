import { EventActivity, PrismaClient } from '@prisma/client';

export class EventActivityRepository implements EventActivityRepository {
	private prismaClient: PrismaClient;
	constructor(prismaClient) {
		this.prismaClient = prismaClient;
	}

	fetchEventActivityById = async (
		eventActivityId: number
	): Promise<EventActivity | undefined> => {
		try {
			const eventActivity = await this.prismaClient.eventActivity.findUnique({
				where: { eventActivityId },
				include: {
					event: true,
					Attendances: true,
				},
			});

			if (eventActivity) {
				return eventActivity;
			}
			throw new Error('Atividade do evento não encontrada');
		} catch (error) {
			throw error;
		}
	};
}
