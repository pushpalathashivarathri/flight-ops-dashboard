import { Flight } from '../../../../core/models/flight.model';
import { calculateBearing } from '../flight-map/leaflet-map.helper';

export interface FlightTelemetry {
  scheduledDeparture: string;
  scheduledArrival: string;
  altitudeFt: number | null;
  groundSpeedKts: number | null;
  trackDegrees: number;
}

/**
 * Derives illustrative telemetry from the flight's own data:
 * - Track is the REAL compass bearing computed from origin -> destination coordinates.
 * - Scheduled times are the estimated times shifted by a small offset (larger for
 *   Delayed flights), since the mock dataset only stores estimated times.
 * - Altitude/ground speed are deterministic mock values (seeded by flight id) shown
 *   only for Active (airborne) flights.
 */
export function getFlightTelemetry(flight: Flight): FlightTelemetry {
  const delayOffsetMinutes = flight.status === 'Delayed' ? 25 : 0;
  const seed = hashFlightId(flight.id);
  const isAirborne = flight.status === 'Active';

  return {
    scheduledDeparture: shiftMinutes(flight.estimatedDeparture, -delayOffsetMinutes),
    scheduledArrival: shiftMinutes(flight.estimatedArrival, -delayOffsetMinutes),
    altitudeFt: isAirborne ? 28000 + (seed % 9) * 1000 : null,
    groundSpeedKts: isAirborne ? 420 + (seed % 15) * 8 : null,
    trackDegrees: Math.round(
      calculateBearing(flight.originLat, flight.originLng, flight.destinationLat, flight.destinationLng)
    )
  };
}

function shiftMinutes(isoString: string, minutes: number): string {
  const date = new Date(isoString);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

function hashFlightId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  }
  return Math.abs(hash);
}