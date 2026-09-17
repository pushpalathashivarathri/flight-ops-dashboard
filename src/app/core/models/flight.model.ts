export type FlightStatus = 'Active' | 'Delayed' | 'Arrived' | 'Scheduled';

export interface Flight {
  id: string;
  flightNumber: string;
  callsign: string;
  aircraftType: string;
  origin: string;
  originCode: string;
  originLat: number;
  originLng: number;
  destination: string;
  destinationCode: string;
  destinationLat: number;
  destinationLng: number;
  status: FlightStatus;
  estimatedDeparture: string; // ISO 8601 string
  estimatedArrival: string;   // ISO 8601 string
  currentLat: number;
  currentLng: number;
}