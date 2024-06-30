interface AttendanceProps {
    AttendanceId?: number;
    studentName: string;
    studentRegistration: string;
    eventPeriodId: number;
  }
  
  export class AttendanceDomain {
    private AttendanceId?: number;
    private studentName: string;
    private studentRegistration: string;
    private eventPeriodId: number;
  
    constructor(props: AttendanceProps) {
      this.AttendanceId = props.AttendanceId;
      this.studentName = props.studentName;
      this.studentRegistration = props.studentRegistration;
      this.eventPeriodId = props.eventPeriodId;
    }
  
    getAttendanceId() {
      return this.AttendanceId;
    }
  
    getStudentName() {
      return this.studentName;
    }
  
    getStudentRegistration() {
      return this.studentRegistration;
    }
  
    getEventPeriodId() {
      return this.eventPeriodId;
    }
  
    setStudentName(studentName: string) {
      this.studentName = studentName;
    }
  
    setStudentRegistration(studentRegistration: string) {
      this.studentRegistration = studentRegistration;
    }
  }
  