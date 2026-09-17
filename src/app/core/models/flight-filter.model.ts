import { FlightStatus } from './flight.model';

export interface FlightFilter {
  callsign: string;
  status: FlightStatus | 'All';
  origin: string | 'All';
  destination: string | 'All';
}

export interface FlightKpis {
  total: number;
  active: number;
  delayed: number;
  arrived: number;
}

export const DEFAULT_FLIGHT_FILTER: FlightFilter = {
  callsign: '',
  status: 'All',
  origin: 'All',
  destination: 'All'
};