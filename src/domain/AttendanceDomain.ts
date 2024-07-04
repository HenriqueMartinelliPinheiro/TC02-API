// AttendanceDomain.ts

import { EventPeriodDomain } from './EventPeriodDomain';

interface AttendanceProps {
  attendanceId?: number;
  studentName: string;
  studentRegistration: string;
  eventPeriod?: EventPeriodDomain;
  studentEntryYear: number;
}

export class AttendanceDomain {
  private attendanceId?: number;
  private studentName: string;
  private studentRegistration: string;
  private eventPeriod?: EventPeriodDomain;
  private studentEntryYear: number;

  constructor(props: AttendanceProps) {
    this.attendanceId = props.attendanceId;
    this.studentName = props.studentName;
    this.studentRegistration = props.studentRegistration;
    this.eventPeriod = props.eventPeriod;
    this.studentEntryYear = props.studentEntryYear;
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

  setEventPeriod(eventPeriod: EventPeriodDomain) {
    this.eventPeriod = eventPeriod;
  }
}
