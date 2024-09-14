import { EventActivityDomain } from './EventActivityDomain';

interface AttendanceProps {
	attendanceId?: number;
	studentName: string;
	studentRegistration: string;
	eventActivity?: EventActivityDomain;
	createdAt?: Date;
	updatedAt?: Date;
}

export class AttendanceDomain {
	private attendanceId?: number;
	private studentName: string;
	private studentRegistration: string;
	private eventActivity?: EventActivityDomain;
	private studentEntryYear: number;
	private createdAt: Date;
	private updatedAt: Date;

	constructor(props: AttendanceProps) {
		this.attendanceId = props.attendanceId;
		this.studentName = props.studentName;
		this.studentRegistration = props.studentRegistration;
		this.eventActivity = props.eventActivity;
		this.createdAt = props.createdAt || new Date();
		this.updatedAt = props.updatedAt || new Date();
	}

	getAttendanceId() {
		return this.attendanceId;
	}

	getStudentName() {
		return this.studentName;
	}

	getStudentRegistration() {
		return this.studentRegistration;
	}

	getEventActivity() {
		return this.eventActivity;
	}

	getStudentEntryYear() {
		return this.studentEntryYear;
	}

	getCreatedAt() {
		return this.createdAt;
	}

	getUpdatedAt() {
		return this.updatedAt;
	}

	setEventActivity(eventActivity: EventActivityDomain) {
		this.eventActivity = eventActivity;
	}

	setCreatedAt(createdAt: Date) {
		this.createdAt = createdAt;
	}

	setUpdatedAt(updatedAt: Date) {
		this.updatedAt = updatedAt;
	}
}
