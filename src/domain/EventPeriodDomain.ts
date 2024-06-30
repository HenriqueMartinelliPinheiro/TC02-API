interface EventPeriodProps {
    eventPeriodId?: number;
    periodStartDate: Date;
    periodEndDate: Date;
    eventId: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export class EventPeriodDomain {
    private eventPeriodId?: number;
    private periodStartDate: Date;
    private periodEndDate: Date;
    private eventId: number;
    private createdAt: Date;
    private updatedAt: Date;
  
    constructor(props: EventPeriodProps) {
      this.eventPeriodId = props.eventPeriodId;
      this.periodStartDate = props.periodStartDate;
      this.periodEndDate = props.periodEndDate;
      this.eventId = props.eventId;
      this.createdAt = props.createdAt || new Date();
      this.updatedAt = props.updatedAt || new Date();
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
  
    getEventId() {
      return this.eventId;
    }
  
    getCreatedAt() {
      return this.createdAt;
    }
  
    getUpdatedAt() {
      return this.updatedAt;
    }
  
    setPeriodStartDate(periodStartDate: Date) {
      this.periodStartDate = periodStartDate;
    }
  
    setPeriodEndDate(periodEndDate: Date) {
      this.periodEndDate = periodEndDate;
    }
  }
  