interface EventLocationProps {
    eventLocationId?: number;
    latitude: number;
    longitude: number;
    radius: number;
    eventId: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export class EventLocationDomain {
    private eventLocationId?: number;
    private latitude: number;
    private longitude: number;
    private radius: number;
    private eventId: number;
    private createdAt: Date;
    private updatedAt: Date;
  
    constructor(props: EventLocationProps) {
      this.eventLocationId = props.eventLocationId;
      this.latitude = props.latitude;
      this.longitude = props.longitude;
      this.radius = props.radius;
      this.eventId = props.eventId;
      this.createdAt = props.createdAt || new Date();
      this.updatedAt = props.updatedAt || new Date();
    }
  
    getEventLocationId() {
      return this.eventLocationId;
    }
  
    getLatitude() {
      return this.latitude;
    }
  
    getLongitude() {
      return this.longitude;
    }
  
    getRadius() {
      return this.radius;
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
  
    setLatitude(latitude: number) {
      this.latitude = latitude;
    }
  
    setLongitude(longitude: number) {
      this.longitude = longitude;
    }
  
    setRadius(radius: number) {
      this.radius = radius;
    }
  }
  