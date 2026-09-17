import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FlightService } from '../../../../core/services/flight';
import { Flight } from '../../../../core/models/flight.model';
import {
  createFlightIcon,
  createEndpointIcon,
  buildPopupContent,
  createRoutePolyline,
  getRouteBounds
} from './leaflet-map.helper';

@Component({
  selector: 'app-flight-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-map.html',
  styleUrl: './flight-map.scss'
})
export class FlightMap implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) private mapContainerRef!: ElementRef<HTMLDivElement>;

  private readonly flightService = inject(FlightService);
  private readonly destroy$ = new Subject<void>();

  private map!: L.Map;
  private markerLayer!: L.LayerGroup;
  private routeLayer!: L.LayerGroup;
  private markersByFlightId = new Map<string, L.Marker>();
  private currentFlights: Flight[] = [];
  private selectedFlightId: string | null = null;

  ngAfterViewInit(): void {
    this.initializeMap();
    this.subscribeToFlightData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap(): void {
    this.map = L.map(this.mapContainerRef.nativeElement, {
      center: [20, 60],
      zoom: 3,
      minZoom: 2,
      worldCopyJump: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
    this.routeLayer = L.layerGroup().addTo(this.map);
  }

  private subscribeToFlightData(): void {
    combineLatest([
      this.flightService.filteredFlights$,
      this.flightService.selectedFlightId$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([flights, selectedId]) => {
        this.currentFlights = flights;
        this.selectedFlightId = selectedId;
        this.renderMarkers(flights, selectedId);
        this.renderSelectedRoute(flights, selectedId);
      });
  }

  private renderMarkers(flights: Flight[], selectedId: string | null): void {
    this.markerLayer.clearLayers();
    this.markersByFlightId.clear();

    flights.forEach((flight) => {
      const isSelected = flight.id === selectedId;
      const icon = createFlightIcon(flight, isSelected);

      const marker = L.marker([flight.currentLat, flight.currentLng], { icon })
        .bindPopup(buildPopupContent(flight))
        .on('click', () => this.flightService.selectFlight(flight.id));

      marker.addTo(this.markerLayer);
      this.markersByFlightId.set(flight.id, marker);
    });
  }

  private renderSelectedRoute(flights: Flight[], selectedId: string | null): void {
    this.routeLayer.clearLayers();

    if (!selectedId) {
      return;
    }

    const flight = flights.find((f) => f.id === selectedId);
    if (!flight) {
      return;
    }

    const routeLine = createRoutePolyline(flight);
    routeLine.addTo(this.routeLayer);

    const originMarker = L.marker([flight.originLat, flight.originLng], {
      icon: createEndpointIcon('origin')
    }).bindTooltip(`Origin: ${flight.originCode}`, { permanent: false });

    const destinationMarker = L.marker([flight.destinationLat, flight.destinationLng], {
      icon: createEndpointIcon('destination')
    }).bindTooltip(`Destination: ${flight.destinationCode}`, { permanent: false });

    originMarker.addTo(this.routeLayer);
    destinationMarker.addTo(this.routeLayer);

    const bounds = getRouteBounds(flight);
    this.map.fitBounds(bounds, { padding: [60, 60], maxZoom: 6 });
  }
}