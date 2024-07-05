import { EventLocationDomain } from './EventLocationDomain';
import { EventPeriodDomain } from './EventPeriodDomain';
import { EventCourseDomain } from './EventCourseDomain';

interface EventProps {
  eventId?: number;
  title: string;
  eventStatus: string;
  eventStartDate: Date;
  eventEndDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  eventLocation?: EventLocationDomain;
  eventPeriods?: EventPeriodDomain[];
  eventCourses?: EventCourseDomain[];
}

export class EventDomain {
  private eventId?: number;
  private title: string;
  private eventStatus: string;
  private eventStartDate: Date;
  private eventEndDate: Date;
  private createdAt: Date;
  private updatedAt: Date;
  private eventLocation?: EventLocationDomain;
  private eventPeriods: EventPeriodDomain[];
  private eventCourses: EventCourseDomain[];

  constructor(props: EventProps) {
    this.eventId = props.eventId;
    this.title = props.title;
    this.eventStatus = props.eventStatus;
    this.eventStartDate = props.eventStartDate;
    this.eventEndDate = props.eventEndDate;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.eventLocation = props.eventLocation;
    this.eventPeriods = props.eventPeriods || [];
    this.eventCourses = props.eventCourses || [];
  }

  getEventId() {
    return this.eventId;
  }

  getTitle() {
    return this.title;
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

  getEventLocation() {
    return this.eventLocation;
  }

  getEventPeriods() {
    return this.eventPeriods;
  }

  getEventCourses() {
    return this.eventCourses;
  }

  setEventLocation(eventLocation: EventLocationDomain) {
    this.eventLocation = eventLocation;
  }

  addEventPeriod(eventPeriod: EventPeriodDomain) {
    this.eventPeriods.push(eventPeriod);
  }

  addEventCourse(eventCourse: EventCourseDomain) {
    this.eventCourses.push(eventCourse);
  }

  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }
}
