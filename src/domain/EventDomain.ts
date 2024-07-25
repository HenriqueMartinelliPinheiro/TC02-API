import { CourseDomain } from './CourseDomain';

interface EventProps {
  eventId?: number;
  title: string;
  eventStatus: string;
  eventStartDate: Date;
  eventEndDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  courses?: CourseDomain[];
}

export class EventDomain {
  private eventId?: number;
  private title: string;
  private eventStatus: string;
  private eventStartDate: Date;
  private eventEndDate: Date;
  private createdAt: Date;
  private updatedAt: Date;
  private courses: CourseDomain[];

  constructor(props: EventProps) {
    this.eventId = props.eventId;
    this.title = props.title;
    this.eventStatus = props.eventStatus;
    this.eventStartDate = props.eventStartDate;
    this.eventEndDate = props.eventEndDate;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.courses = props.courses || [];
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

  getCourses() {
    return this.courses;
  }

  setTitle(title: string) {
    this.title = title;
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

  addCourse(course: CourseDomain) {
    this.courses.push(course);
  }

  removeCourse(courseId: number) {
    this.courses = this.courses.filter(course => course.getCourseId() !== courseId);
  }
}