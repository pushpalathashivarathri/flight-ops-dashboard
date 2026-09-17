import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Flight } from '../models/flight.model';

@Injectable({
  providedIn: 'root'
})
export class FlightDataService {
  private readonly dataUrl = 'assets/data/mock-flights.json';

  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches the flight dataset.
   * In a real system this would call a backend REST/WebSocket API —
   * swapping the implementation here is all that's required later.
   */
  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.dataUrl);
  }
}