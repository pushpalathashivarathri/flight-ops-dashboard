import * as L from 'leaflet';
import { Flight } from '../../../../core/models/flight.model';
import { STATUS_COLOR_MAP } from '../../../../core/constants/flight-status.constant';

/** Calculating the compass bearing (degrees) from one point to another, for rotating plane icons. */
export function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/**
 Creates a plane-shaped divIcon, colored by status and rotated to face
 its direction of travel (origin -> destination).
 */
export function createFlightIcon(flight: Flight, isSelected: boolean): L.DivIcon {
  const color = STATUS_COLOR_MAP[flight.status];
  const size = isSelected ? 34 : 28;
  const bearing = calculateBearing(
    flight.originLat,
    flight.originLng,
    flight.destinationLat,
    flight.destinationLng
  );

  return L.divIcon({
    className: 'flight-marker-icon',
    html: `
      <div style="
        transform: rotate(${bearing}deg);
        width: ${size}px;
        height: ${size}px;
        display: block;
        transform-origin: center;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));
      ">
        <svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-label="flight marker" role="img">
          <path fill="${color}"
            d="M21.8 16.3L14 13.7V4.9c0-.8-.7-1.4-1.5-1.4S11 4.1 11 4.9v8.8l-7.8 2.6L2 18.8l9-2.8v3.4l-2.2 1.6v1.2L12 22l3.2 1.1v-1.2L13 19.4v-3.4l9 2.8z"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}
/** Creates a small square marker for origin/destination endpoints of the selected route. */
export function createEndpointIcon(kind: 'origin' | 'destination'): L.DivIcon {
  const color = kind === 'origin' ? '#1565c0' : '#c62828';

  return L.divIcon({
    className: 'endpoint-marker-icon',
    html: `<div style="
      width: 14px;
      height: 14px;
      background-color: ${color};
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
}

/** Small persistent label shown next to each marker: callsign + route, like flight-radar apps. */
export function buildFlightLabel(flight: Flight): string {
  return `
    <div class="flight-label">
      <strong>${flight.callsign}</strong>
      <span>${flight.originCode} → ${flight.destinationCode}</span>
    </div>
  `;
}

/** Builds a popup HTML string for a flight marker (shown on click, in addition to the label). */
export function buildPopupContent(flight: Flight): string {
  return `
    <div class="flight-popup">
      <strong>${flight.flightNumber}</strong> (${flight.callsign})<br/>
      ${flight.originCode} → ${flight.destinationCode}<br/>
      Status: <span class="popup-status">${flight.status}</span>
    </div>
  `;
}

/** Draws a route line between origin and destination. */
export function createRoutePolyline(flight: Flight): L.Polyline {
  return L.polyline(
    [
      [flight.originLat, flight.originLng],
      [flight.destinationLat, flight.destinationLng]
    ],
    {
      color: STATUS_COLOR_MAP[flight.status],
      weight: 3,
      opacity: 0.85,
      dashArray: '1, 8',
      lineCap: 'round'
    }
  );
}

/** Computes bounds covering a flight's full route, for map.fitBounds(). */
export function getRouteBounds(flight: Flight): L.LatLngBounds {
  return L.latLngBounds([
    [flight.originLat, flight.originLng],
    [flight.destinationLat, flight.destinationLng]
  ]);
}
/**
  Groups flights by identical (rounded) coordinates and returns a Map from
  flight id -> adjusted [lat, lng], nudging overlapping markers into a small
  circle around their shared point so they're all individually visible/clickable.
 */
export function spreadOverlappingCoordinates(flights: Flight[]): Map<string, [number, number]> {
  const groups = new Map<string, Flight[]>();

  flights.forEach((flight) => {
    const key = `${flight.currentLat.toFixed(3)},${flight.currentLng.toFixed(3)}`;
    const group = groups.get(key) ?? [];
    group.push(flight);
    groups.set(key, group);
  });

  const result = new Map<string, [number, number]>();
  const offsetRadius = 0.15; // degrees — small enough to stay visually grouped, large enough to separate

  groups.forEach((group) => {
    if (group.length === 1) {
      result.set(group[0].id, [group[0].currentLat, group[0].currentLng]);
      return;
    }

    group.forEach((flight, index) => {
      const angle = (2 * Math.PI * index) / group.length;
      const lat = flight.currentLat + offsetRadius * Math.sin(angle);
      const lng = flight.currentLng + offsetRadius * Math.cos(angle);
      result.set(flight.id, [lat, lng]);
    });
  });

  return result;
}