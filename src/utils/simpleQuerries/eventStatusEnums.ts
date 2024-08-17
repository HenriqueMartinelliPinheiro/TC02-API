import { EventStatus } from '@prisma/client';

export function getAllEventStatusValues(): EventStatus[] {
	try {
		return [
			EventStatus.NAO_INICIADO,
			EventStatus.EM_ANDAMENTO,
			EventStatus.ENCERRADO,
			EventStatus.CANCELADO,
		];
	} catch (error) {
		throw error;
	}
}
