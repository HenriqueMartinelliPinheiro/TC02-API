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

	fetchEventActivitiesByEventId = async (
		eventId: number
	): Promise<EventActivity[]> => {
		try {
			const eventActivities = await this.prismaClient.eventActivity.findMany({
				where: { eventId },
				include: {
					event: true,
					Attendances: true,
				},
			});

			return eventActivities;
		} catch (error) {
			throw new Error('Erro ao buscar atividades do evento');
		}
	};
}
