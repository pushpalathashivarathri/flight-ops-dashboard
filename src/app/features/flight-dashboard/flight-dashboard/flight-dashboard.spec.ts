import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightDashboard } from './flight-dashboard';

describe('FlightDashboard', () => {
  let component: FlightDashboard;
  let fixture: ComponentFixture<FlightDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
