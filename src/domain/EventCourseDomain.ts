import { EventDomain } from './EventDomain';

interface EventCourseProps {
	eventCourseId?: number;
	courseName: string;
	courseId: number;
	event?: EventDomain;
	createdAt?: Date;
	updatedAt?: Date;
}

export class EventCourseDomain {
	private eventCourseId?: number;
	private courseId: number;
	private courseName: string;
	private event?: EventDomain;
	private createdAt: Date;
	private updatedAt: Date;

	constructor(props: EventCourseProps) {
		this.eventCourseId = props.eventCourseId;
		this.courseName = props.courseName;
		this.event = props.event;
		this.courseId = props.courseId;
		this.createdAt = props.createdAt || new Date();
		this.updatedAt = props.updatedAt || new Date();
	}

	getEventCourseId() {
		return this.eventCourseId;
	}

	getCourseName() {
		return this.courseName;
	}

	getEvent() {
		return this.event;
	}

	getCourseId() {
		return this.courseId;
	}

	getCreatedAt() {
		return this.createdAt;
	}

	getUpdatedAt() {
		return this.updatedAt;
	}

	setEvent(event: EventDomain) {
		this.event = event;
	}

	setCreatedAt(createdAt: Date) {
		this.createdAt = createdAt;
	}

	setCourseName(courseName: string) {
		this.courseName = courseName;
	}

	setCourseId(courseId: number) {
		this.courseId = courseId;
	}

	setUpdatedAt(updatedAt: Date) {
		this.updatedAt = updatedAt;
	}
}
