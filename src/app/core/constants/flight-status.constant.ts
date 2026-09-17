import { FlightStatus } from '../models/flight.model';

export const FLIGHT_STATUSES: FlightStatus[] = ['Active', 'Delayed', 'Arrived', 'Scheduled'];

export const STATUS_COLOR_MAP: Record<FlightStatus, string> = {
  Active: '#2e7d32',    // green
  Delayed: '#e65100',   // orange
  Arrived: '#546e7a',   // slate gray
  Scheduled: '#1565c0'  // blue
};