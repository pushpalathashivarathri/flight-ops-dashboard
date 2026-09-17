import * as L from 'leaflet';
import { Flight } from '../../../../core/models/flight.model';
import { STATUS_COLOR_MAP } from '../../../../core/constants/flight-status.constant';

/**
 * Creates a custom divIcon colored by flight status.
 * Avoids Leaflet's default marker image path issues under Angular's build system entirely.
 */
export function createFlightIcon(flight: Flight, isSelected: boolean): L.DivIcon {
  const color = STATUS_COLOR_MAP[flight.status];
  const size = isSelected ? 22 : 16;
  const borderWidth = isSelected ? 3 : 2;

  return L.divIcon({
    className: 'flight-marker-icon',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border: ${borderWidth}px solid ${isSelected ? '#ffffff' : 'rgba(255,255,255,0.85)'};
      border-radius: 50%;
      box-shadow: 0 0 0 ${isSelected ? 4 : 0}px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.4);
    "></div>`,
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
      box-shadow: 0 1px 4px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
}

/** Builds a popup HTML string for a flight marker. */
export function buildPopupContent(flight: Flight): string {
  return `
    <div class="flight-popup">
      <strong>${flight.flightNumber}</strong> (${flight.callsign})<br/>
      ${flight.originCode} → ${flight.destinationCode}<br/>
      Status: <span class="popup-status">${flight.status}</span>
    </div>
  `;
}

/** Draws a dashed great-circle-style route line between origin and destination. */
export function createRoutePolyline(flight: Flight): L.Polyline {
  return L.polyline(
    [
      [flight.originLat, flight.originLng],
      [flight.destinationLat, flight.destinationLng]
    ],
    {
      color: '#1565c0',
      weight: 3,
      opacity: 0.8,
      dashArray: '8, 6'
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