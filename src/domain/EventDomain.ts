import { CourseDomain } from './CourseDomain';
import { EventLocationDomain } from './EventLocationDomain';
import { EventActivityDomain } from './EventActivityDomain';

interface EventProps {
	eventId?: number;
	eventTitle: string;
	eventStatus?: string;
	eventStartDate: Date;
	eventEndDate: Date;
	createdAt?: Date;
	updatedAt?: Date;
	courses?: CourseDomain[];
	eventLocation?: EventLocationDomain;
	eventActivities?: EventActivityDomain[];
}

export class EventDomain {
	private eventId?: number;
	private eventTitle: string;
	private eventStatus?: string;
	private eventStartDate: Date;
	private eventEndDate: Date;
	private createdAt?: Date;
	private updatedAt?: Date;
	private courses: CourseDomain[];
	private eventLocation?: EventLocationDomain;
	private eventActivities: EventActivityDomain[];

	constructor(props: EventProps) {
		this.eventId = props.eventId;
		this.eventTitle = props.eventTitle;
		this.eventStatus = props.eventStatus;
		this.eventStartDate = props.eventStartDate;
		this.eventEndDate = props.eventEndDate;
		this.createdAt = props.createdAt || new Date();
		this.updatedAt = props.updatedAt || new Date();
		this.courses = props.courses || [];
		this.eventLocation = props.eventLocation;
		this.eventActivities = props.eventActivities || [];
	}

	getEventId() {
		return this.eventId;
	}

	getEventTitle() {
		return this.eventTitle;
	}

	getEventStatus() {
		return this.eventStatus;
	}

	getEventStartDate() {
		return this.eventStartDate;
	}

	getEventEndDate() {
		return this.eventEndDate;
	}

	getCreatedAt() {
		return this.createdAt;
	}

	getUpdatedAt() {
		return this.updatedAt;
	}

	getCourses() {
		return this.courses;
	}

	getEventLocation() {
		return this.eventLocation;
	}

	getEventActivities() {
		return this.eventActivities;
	}

	setEventTitle(eventTitle: string) {
		this.eventTitle = eventTitle;
	}

	setEventStatus(eventStatus: string) {
		this.eventStatus = eventStatus;
	}

	setEventStartDate(eventStartDate: Date) {
		this.eventStartDate = eventStartDate;
	}

	setEventEndDate(eventEndDate: Date) {
		this.eventEndDate = eventEndDate;
	}

	setCreatedAt(createdAt: Date) {
		this.createdAt = createdAt;
	}

	setUpdatedAt(updatedAt: Date) {
		this.updatedAt = updatedAt;
	}

	setEventLocation(location: EventLocationDomain) {
		this.eventLocation = location;
	}

	addCourse(course: CourseDomain) {
		this.courses.push(course);
	}

	removeCourse(courseId: number) {
		this.courses = this.courses.filter((course) => course.getCourseId() !== courseId);
	}

	addEventActivity(activity: EventActivityDomain) {
		this.eventActivities.push(activity);
	}

	removeEventActivity(activityId: number) {
		this.eventActivities = this.eventActivities.filter(
			(activity) => activity.getEventActivityId() !== activityId
		);
	}
}
