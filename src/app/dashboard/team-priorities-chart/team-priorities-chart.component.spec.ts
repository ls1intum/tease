import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPrioritiesChartComponent } from './team-priorities-chart.component';

describe('TeamPrioritiesChartComponent', () => {
  let component: TeamPrioritiesChartComponent;
  let fixture: ComponentFixture<TeamPrioritiesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeamPrioritiesChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPrioritiesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
