import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { Flight } from '../../../../core/models/flight.model';
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
}