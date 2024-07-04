// EventLocationDomain.ts

import { EventDomain } from './EventDomain';

interface EventLocationProps {
  eventLocationId?: number;
  latitude: number;
  longitude: number;
  radius: number;
  createdAt?: Date;
  updatedAt?: Date;
  event?: EventDomain;
}

export class EventLocationDomain {
  private eventLocationId?: number;
  private latitude: number;
  private longitude: number;
  private radius: number;
  private createdAt: Date;
  private updatedAt: Date;
  private event?: EventDomain;

  constructor(props: EventLocationProps) {
    this.eventLocationId = props.eventLocationId;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.radius = props.radius;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.event = props.event;
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

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  getEvent() {
    return this.event;
  }

  setEvent(event: EventDomain) {
    this.event = event;
  }
}
