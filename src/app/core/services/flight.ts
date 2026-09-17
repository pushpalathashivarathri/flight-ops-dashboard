import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators';

import { Flight, FlightStatus } from '../models/flight.model';
import { FlightFilter, FlightKpis, DEFAULT_FLIGHT_FILTER } from '../models/flight-filter.model';
import { FlightDataService } from './flight-data';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private readonly flightDataService = inject(FlightDataService);

  // ---- Source state ----
  private readonly filterSubject = new BehaviorSubject<FlightFilter>(DEFAULT_FLIGHT_FILTER);
  private readonly selectedFlightIdSubject = new BehaviorSubject<string | null>(null);

  /** All flights, loaded once from the data service and cached for all subscribers. */
  readonly flights$: Observable<Flight[]> = this.flightDataService.getFlights().pipe(
    shareReplay({ bufferSize: 1, refCount: false })
  );

  readonly filter$: Observable<FlightFilter> = this.filterSubject.asObservable();
  readonly selectedFlightId$: Observable<string | null> = this.selectedFlightIdSubject.asObservable();

  /** Flights after applying the active search + filter criteria. */
  readonly filteredFlights$: Observable<Flight[]> = combineLatest([
    this.flights$,
    this.filter$
  ]).pipe(
    map(([flights, filter]) => this.applyFilter(flights, filter)),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  /** Dynamically computed KPI counts — always reflects the currently filtered set. */
  readonly kpis$: Observable<FlightKpis> = this.filteredFlights$.pipe(
    map((flights) => this.computeKpis(flights)),
    distinctUntilChanged(
      (a, b) => a.total === b.total && a.active === b.active && a.delayed === b.delayed && a.arrived === b.arrived
    )
  );

  /** The currently selected flight object (or null), resolved from the full flight list. */
  readonly selectedFlight$: Observable<Flight | null> = combineLatest([
    this.flights$,
    this.selectedFlightId$
  ]).pipe(
    map(([flights, id]) => flights.find((f) => f.id === id) ?? null)
  );

  /** Distinct status values present in the data, for dynamic filter dropdown options. */
  readonly statusOptions$: Observable<FlightStatus[]> = this.flights$.pipe(
    map((flights) => Array.from(new Set(flights.map((f) => f.status))).sort())
  );

  /** Distinct origin airport names present in the data. */
  readonly originOptions$: Observable<string[]> = this.flights$.pipe(
    map((flights) => Array.from(new Set(flights.map((f) => f.origin))).sort())
  );

  /** Distinct destination airport names present in the data. */
  readonly destinationOptions$: Observable<string[]> = this.flights$.pipe(
    map((flights) => Array.from(new Set(flights.map((f) => f.destination))).sort())
  );

  /** Updates the active filter/search criteria. Called by FlightFiltersComponent. */
  updateFilters(filter: FlightFilter): void {
    this.filterSubject.next(filter);
  }

  /** Resets filters back to defaults. */
  clearFilters(): void {
    this.filterSubject.next(DEFAULT_FLIGHT_FILTER);
  }

  /** Marks a flight as selected. Called by FlightMapComponent on marker click. */
  selectFlight(flightId: string): void {
    this.selectedFlightIdSubject.next(flightId);
  }

  /** Clears the current selection. */
  clearSelection(): void {
    this.selectedFlightIdSubject.next(null);
  }

  private applyFilter(flights: Flight[], filter: FlightFilter): Flight[] {
    const callsignQuery = filter.callsign.trim().toLowerCase();

    return flights.filter((flight) => {
      const matchesCallsign = callsignQuery
        ? flight.callsign.toLowerCase().includes(callsignQuery)
        : true;
      const matchesStatus = filter.status === 'All' ? true : flight.status === filter.status;
      const matchesOrigin = filter.origin === 'All' ? true : flight.origin === filter.origin;
      const matchesDestination =
        filter.destination === 'All' ? true : flight.destination === filter.destination;

      return matchesCallsign && matchesStatus && matchesOrigin && matchesDestination;
    });
  }

  private computeKpis(flights: Flight[]): FlightKpis {
    return {
      total: flights.length,
      active: flights.filter((f) => f.status === 'Active').length,
      delayed: flights.filter((f) => f.status === 'Delayed').length,
      arrived: flights.filter((f) => f.status === 'Arrived').length
    };
  }
}