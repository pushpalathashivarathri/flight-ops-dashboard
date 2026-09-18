import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'flight-ops-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  readonly theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  toggleTheme(): void {
    const next: Theme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.themeSubject.next(next);
    this.applyTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}