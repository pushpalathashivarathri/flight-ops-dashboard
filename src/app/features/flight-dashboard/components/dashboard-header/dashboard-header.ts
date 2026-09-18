import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DatePipe, AsyncPipe } from '@angular/common';
import { Subject, interval } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';

import { ThemeService } from '../../../../core/services/theme';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, DatePipe, AsyncPipe],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.scss'
})
export class DashboardHeader implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly themeService = inject(ThemeService);

  readonly theme$ = this.themeService.theme$;
  currentTime = new Date();

  ngOnInit(): void {
    interval(1000)
      .pipe(startWith(0), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentTime = new Date();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }
}