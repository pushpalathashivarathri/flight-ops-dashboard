import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FlightService } from '../../../../core/services/flight';
import { FlightStatus } from '../../../../core/models/flight.model';
import { DEFAULT_FLIGHT_FILTER } from '../../../../core/models/flight-filter.model';

@Component({
  selector: 'app-flight-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flight-filters.html',
  styleUrl: './flight-filters.scss'
})
export class FlightFilters implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly flightService = inject(FlightService);
  private readonly destroy$ = new Subject<void>();

  readonly statusOptions$ = this.flightService.statusOptions$;
  readonly originOptions$ = this.flightService.originOptions$;
  readonly destinationOptions$ = this.flightService.destinationOptions$;

  readonly filterForm = this.fb.nonNullable.group({
    callsign: DEFAULT_FLIGHT_FILTER.callsign,
    status: DEFAULT_FLIGHT_FILTER.status as FlightStatus | 'All',
    origin: DEFAULT_FLIGHT_FILTER.origin,
    destination: DEFAULT_FLIGHT_FILTER.destination
  });

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged(
          (a, b) =>
            a.callsign === b.callsign &&
            a.status === b.status &&
            a.origin === b.origin &&
            a.destination === b.destination
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.flightService.updateFilters({
          callsign: value.callsign ?? '',
          status: (value.status as FlightStatus | 'All') ?? 'All',
          origin: value.origin ?? 'All',
          destination: value.destination ?? 'All'
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClearFilters(): void {
    this.filterForm.reset(DEFAULT_FLIGHT_FILTER);
    this.flightService.clearFilters();
  }
}