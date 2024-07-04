// EventCourseDomain.ts

import { EventDomain } from './EventDomain';

interface EventCourseProps {
  eventCourseId?: number;
  courseName: string;
  event?: EventDomain;
}

export class EventCourseDomain {
  private eventCourseId?: number;
  private courseName: string;
  private event?: EventDomain;

  constructor(props: EventCourseProps) {
    this.eventCourseId = props.eventCourseId;
    this.courseName = props.courseName;
    this.event = props.event;
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

  setEvent(event: EventDomain) {
    this.event = event;
  }
}
