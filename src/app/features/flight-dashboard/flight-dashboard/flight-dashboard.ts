import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightService } from '../../../core/services/flight';
import { DashboardHeader } from '../components/dashboard-header/dashboard-header';
import { KpiCards } from '../components/kpi-cards/kpi-cards';
import { FlightFilters } from '../components/flight-filters/flight-filters';
import { FlightMap } from '../components/flight-map/flight-map';
import { FlightDetails } from '../components/flight-details/flight-details';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-flight-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardHeader,
    KpiCards,
    FlightFilters,
    FlightMap,
    FlightDetails,
    EmptyState
  ],
  templateUrl: './flight-dashboard.html',
  styleUrl: './flight-dashboard.scss'
})
export class FlightDashboard {
  private readonly flightService = inject(FlightService);

  readonly kpis$ = this.flightService.kpis$;
  readonly filteredFlights$ = this.flightService.filteredFlights$;
  readonly selectedFlight$ = this.flightService.selectedFlight$;
}