import { EventDomain } from './EventDomain';
import { AttendanceDomain } from './AttendanceDomain';

interface EventActivityProps {
	eventActivityId?: number;
	eventActivityTitle: string;
	eventActivityStartDate: Date;
	eventActivityEndDate: Date;
	eventActivityDescription: string;
	createdAt?: Date;
	updatedAt?: Date;
	event?: EventDomain;
	attendances?: AttendanceDomain[];
}

export class EventActivityDomain {
	private eventActivityId?: number;
	private eventActivityTitle: string;
	private eventActivityStartDate: Date;
	private eventActivityEndDate: Date;
	private eventActivityDescription: string;
	private createdAt: Date;
	private updatedAt: Date;
	private event?: EventDomain;
	private attendances: AttendanceDomain[];

	constructor(props: EventActivityProps) {
		this.eventActivityId = props.eventActivityId;
		this.eventActivityTitle = props.eventActivityTitle;
		this.eventActivityStartDate = props.eventActivityStartDate;
		this.eventActivityDescription = props.eventActivityDescription;
		this.eventActivityEndDate = props.eventActivityEndDate;
		this.createdAt = props.createdAt || new Date();
		this.updatedAt = props.updatedAt || new Date();
		this.event = props.event;
		this.attendances = props.attendances || [];
	}

	getEventActivityId() {
		return this.eventActivityId;
	}

	getEventActivityDescription() {
		return this.eventActivityDescription;
	}

	getEventActivityTitle() {
		return this.eventActivityTitle;
	}

	getEventActivityStartDate() {
		return this.eventActivityStartDate;
	}

	getEventActivityEndDate() {
		return this.eventActivityEndDate;
	}

	getCreatedAt() {
		return this.createdAt;
	}

	getUpdatedAt() {
		return this.updatedAt;
	}

	getEvent() {
		return this.event;
	}

	getAttendances() {
		return this.attendances;
	}

	setEvent(event: EventDomain) {
		this.event = event;
	}

	setEventActivityDescription(eventActivityDescription: string) {
		this.eventActivityDescription = eventActivityDescription;
	}

	setEventActivityTitle(eventActivityTitle: string) {
		this.eventActivityDescription = eventActivityTitle;
	}

	setEventActivityStartDate(eventActivityStartDate: Date) {
		this.eventActivityStartDate = eventActivityStartDate;
	}

	setEventActivityEndDate(eventActivityEndDate: Date) {
		this.eventActivityEndDate = eventActivityEndDate;
	}

	addAttendance(attendance: AttendanceDomain) {
		this.attendances.push(attendance);
	}

	setCreatedAt(createdAt: Date) {
		this.createdAt = createdAt;
	}

	setUpdatedAt(updatedAt: Date) {
		this.updatedAt = updatedAt;
	}
}
