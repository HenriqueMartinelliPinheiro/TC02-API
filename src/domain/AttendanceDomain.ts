import { EventPeriodDomain } from './EventActivityDomain';

interface AttendanceProps {
  attendanceId?: number;
  studentName: string;
  studentRegistration: string;
  eventPeriod?: EventPeriodDomain;
  studentEntryYear: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AttendanceDomain {
  private attendanceId?: number;
  private studentName: string;
  private studentRegistration: string;
  private eventPeriod?: EventPeriodDomain;
  private studentEntryYear: number;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: AttendanceProps) {
    this.attendanceId = props.attendanceId;
    this.studentName = props.studentName;
    this.studentRegistration = props.studentRegistration;
    this.eventPeriod = props.eventPeriod;
    this.studentEntryYear = props.studentEntryYear;
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

  getEventPeriod() {
    return this.eventPeriod;
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

  setEventPeriod(eventPeriod: EventPeriodDomain) {
    this.eventPeriod = eventPeriod;
  }

  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }
}
