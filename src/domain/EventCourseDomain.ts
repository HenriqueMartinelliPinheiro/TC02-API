interface EventCourseProps {
    eventCourseId?: number;
    courseName: string;
    eventId: number;
  }
  
  export class EventCourseDomain {
    private eventCourseId?: number;
    private courseName: string;
    private eventId: number;
  
    constructor(props: EventCourseProps) {
      this.eventCourseId = props.eventCourseId;
      this.courseName = props.courseName;
      this.eventId = props.eventId;
    }
  
    getEventCourseId() {
      return this.eventCourseId;
    }
  
    getCourseName() {
      return this.courseName;
    }
  
    getEventId() {
      return this.eventId;
    }
  
    setCourseName(courseName: string) {
      this.courseName = courseName;
    }
  }
  