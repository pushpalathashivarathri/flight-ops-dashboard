export const AIRLINE_PREFIX_MAP: Record<string, string> = {
  AI: 'Air India',
  '6E': 'IndiGo',
  UK: 'Vistara',
  EK: 'Emirates',
  SQ: 'Singapore Airlines',
  QR: 'Qatar Airways',
  LH: 'Lufthansa',
  EY: 'Etihad Airways',
  '9W': 'Jet Airways'
};

export function getAirlineName(flightNumber: string): string {
  const prefix = flightNumber.slice(0, 2).toUpperCase();
  return AIRLINE_PREFIX_MAP[prefix] ?? 'Unknown Airline';
}