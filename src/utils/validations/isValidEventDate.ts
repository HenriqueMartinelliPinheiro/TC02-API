import { EventActivityDomain } from '../../domain/EventActivityDomain';

export const isValidEventDate = (
	eventStartDate: Date,
	eventEndDate: Date,
	eventActivities: EventActivityDomain[]
): boolean => {
	if (eventEndDate < eventStartDate) {
		return false;
	}

	for (const activity of eventActivities) {


		if (
			activity.getEventActivityEndDate() < activity.getEventActivityStartDate() ||
			activity.getEventActivityEndDate() < eventStartDate ||
			activity.getEventActivityEndDate() > eventEndDate ||
			activity.getEventActivityStartDate() < eventStartDate ||
			activity.getEventActivityStartDate() > eventEndDate
		) {
			return false;
		}
	}
	return true;
};
