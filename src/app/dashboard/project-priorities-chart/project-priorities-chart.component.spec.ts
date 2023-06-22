import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPrioritiesChartComponent } from './project-priorities-chart.component';

describe('ProjectPrioritiesChartComponent', () => {
  let component: ProjectPrioritiesChartComponent;
  let fixture: ComponentFixture<ProjectPrioritiesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectPrioritiesChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPrioritiesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
