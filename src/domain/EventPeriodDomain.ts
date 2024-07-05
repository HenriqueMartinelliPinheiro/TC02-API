import { EventDomain } from './EventDomain';
import { AttendanceDomain } from './AttendanceDomain';

interface EventPeriodProps {
  eventPeriodId?: number;
  periodStartDate: Date;
  periodEndDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  event?: EventDomain;
  attendances?: AttendanceDomain[];
}

export class EventPeriodDomain {
  private eventPeriodId?: number;
  private periodStartDate: Date;
  private periodEndDate: Date;
  private createdAt: Date;
  private updatedAt: Date;
  private event?: EventDomain;
  private attendances: AttendanceDomain[];

  constructor(props: EventPeriodProps) {
    this.eventPeriodId = props.eventPeriodId;
    this.periodStartDate = props.periodStartDate;
    this.periodEndDate = props.periodEndDate;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.event = props.event;
    this.attendances = props.attendances || [];
  }

  getEventPeriodId() {
    return this.eventPeriodId;
  }

  getPeriodStartDate() {
    return this.periodStartDate;
  }

  getPeriodEndDate() {
    return this.periodEndDate;
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
