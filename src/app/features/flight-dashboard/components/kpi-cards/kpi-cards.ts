import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightKpis } from '../../../../core/models/flight-filter.model';

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.scss'
})
export class KpiCards {
  @Input() kpis: FlightKpis | null = null;
}