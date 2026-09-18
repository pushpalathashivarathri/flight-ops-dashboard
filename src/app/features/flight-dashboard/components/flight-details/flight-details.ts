import { Component, Input, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { Flight } from '../../../../core/models/flight.model';
import { FlightService } from '../../../../core/services/flight';
import { STATUS_DISPLAY_LABEL } from '../../../../core/constants/flight-status.constant';
import { getAirlineName } from '../../../../core/constants/airline.constant';
import { getFlightTelemetry, FlightTelemetry } from './flight-telemetry.helper';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [CommonModule, DatePipe, EmptyState],
  templateUrl: './flight-details.html',
  styleUrl: './flight-details.scss'
})
export class FlightDetails {
  @Input() flight: Flight | null = null;

  private readonly flightService = inject(FlightService);

  get airlineName(): string {
    return this.flight ? getAirlineName(this.flight.flightNumber) : '';
  }

  get statusLabel(): string {
    return this.flight ? STATUS_DISPLAY_LABEL[this.flight.status] : '';
  }

  get telemetry(): FlightTelemetry | null {
    return this.flight ? getFlightTelemetry(this.flight) : null;
  }

  onClose(): void {
    this.flightService.clearSelection();
  }

  /** Re-centers/zooms the map on this flight (useful if the user panned or zoomed away). */
  onCenterOnMap(): void {
    if (this.flight) {
      this.flightService.selectFlight(this.flight.id);
    }
  }
}