import { EventDomain } from './EventDomain';

interface EventCourseProps {
  eventCourseId?: number;
  courseName: string;
  event?: EventDomain;
  createdAt?: Date;
  updatedAt?: Date;
}

export class EventCourseDomain {
  private eventCourseId?: number;
  private courseName: string;
  private event?: EventDomain;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: EventCourseProps) {
    this.eventCourseId = props.eventCourseId;
    this.courseName = props.courseName;
    this.event = props.event;
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

  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }
}
