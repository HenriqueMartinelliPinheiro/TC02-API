import { EventActivityDomain } from './EventActivityDomain';

interface AttendanceProps {
	attendanceId?: number;
	studentName: string;
	studentRegistration: string;
	eventActivity?: EventActivityDomain;
	createdAt?: Date;
	updatedAt?: Date;
	studentCpf: string;
}

export class AttendanceDomain {
	private attendanceId?: number;
	private studentName: string;
	private studentRegistration: string;
	private eventActivity?: EventActivityDomain;
	private createdAt: Date;
	private updatedAt: Date;
	private studentCpf: string;

	constructor(props: AttendanceProps) {
		this.attendanceId = props.attendanceId;
		this.studentName = props.studentName;
		this.studentRegistration = props.studentRegistration;
		this.eventActivity = props.eventActivity;
		this.createdAt = props.createdAt || new Date();
		this.updatedAt = props.updatedAt || new Date();
		this.studentCpf = props.studentCpf;
	}

	getAttendanceId() {
		return this.attendanceId;
	}

	getStudentName() {
		return this.studentName;
	}

	getStudentCpf() {
		return this.studentCpf;
	}

	getStudentRegistration() {
		return this.studentRegistration;
	}

	getEventActivity() {
		return this.eventActivity;
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

	setStudentCpf(studentCpf: string) {
		this.studentCpf = studentCpf;
	}

	setCreatedAt(createdAt: Date) {
		this.createdAt = createdAt;
	}

	setUpdatedAt(updatedAt: Date) {
		this.updatedAt = updatedAt;
	}
}
