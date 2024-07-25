import { EventDomain } from './EventDomain';

interface CourseProps {
  courseId?: number;
  courseName: string;
  createdAt?: Date;
  updatedAt?: Date;
  courseCoordinatorEmail: string;
  events?: EventDomain[];
}

export class CourseDomain {
  private courseId?: number;
  private courseName: string;
  private createdAt: Date;
  private updatedAt: Date;
  private courseCoordinatorEmail: string;
  private events: EventDomain[];

  constructor(props: CourseProps) {
    this.courseId = props.courseId;
    this.courseName = props.courseName;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.courseCoordinatorEmail = props.courseCoordinatorEmail;
    this.events = props.events || [];
  }

  getCourseId() {
    return this.courseId;
  }

  getCourseName() {
    return this.courseName;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  getCourseCoordinatorEmail() {
    return this.courseCoordinatorEmail;
  }

  getEvents() {
    return this.events;
  }

  setCourseName(courseName: string) {
    this.courseName = courseName;
  }

  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  setCourseCoordinatorEmail(email: string) {
    this.courseCoordinatorEmail = email;
  }

  addEvent(event: EventDomain) {
    this.events.push(event);
  }

  removeEvent(eventId: number) {
    this.events = this.events.filter(event => event.getEventId() !== eventId);
  }
}
