import { EventActivityDomain } from '../../domain/EventActivityDomain';

export const isValidEventDate = (
	eventStartDate: Date,
	eventEndDate: Date,
	eventActivities: EventActivityDomain[]
): boolean => {
	if (eventEndDate < eventStartDate) {
		return false;
	}
	console.log('Inicio Evento: ', eventStartDate, 'Fim Evento:', eventEndDate);

	for (const activity of eventActivities) {
		console.log(
			'Inicio Atividade: ',
			activity.getEventActivityStartDate(),
			'Fim Atividade: ',
			activity.getEventActivityEndDate()
		);

		if (
			activity.getEventActivityEndDate() < activity.getEventActivityStartDate() ||
			activity.getEventActivityEndDate() < eventStartDate ||
			activity.getEventActivityEndDate() > eventEndDate ||
			activity.getEventActivityStartDate() < eventStartDate ||
			activity.getEventActivityStartDate() > eventEndDate
		) {
			console.log('False');
			return false;
		}
	}
	console.log('True');
	return true;
};
