import { FlightStatus } from '../models/flight.model';

export const FLIGHT_STATUSES: FlightStatus[] = ['Active', 'Delayed', 'Arrived', 'Scheduled'];

export const STATUS_COLOR_MAP: Record<FlightStatus, string> = {
  Active: '#2e7d32',
  Delayed: '#e65100',
  Arrived: '#546e7a',
  Scheduled: '#1565c0'
};

export const STATUS_DISPLAY_LABEL: Record<FlightStatus, string> = {
  Active: 'On Time',
  Delayed: 'Delayed',
  Arrived: 'Arrived',
  Scheduled: 'Scheduled'
};