export interface Airport {
  code: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
}

export const AIRPORTS: Airport[] = [
  { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', lat: 17.2403, lng: 78.4294 },
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', lat: 28.5562, lng: 77.1000 },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', lat: 19.0896, lng: 72.8656 },
  { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', lat: 13.1986, lng: 77.7066 },
  { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', lat: 12.9941, lng: 80.1709 },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', lat: 22.6547, lng: 88.4467 },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', lat: 25.2532, lng: 55.3657 },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', lat: 1.3644, lng: 103.9915 },
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', lat: 51.4700, lng: -0.4543 },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', lat: 50.0379, lng: 8.5622 },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', lat: 25.2609, lng: 51.6138 },
  { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', lat: 24.4330, lng: 54.6511 }
];

export function getAirportByCode(code: string): Airport | undefined {
  return AIRPORTS.find(a => a.code === code);
}