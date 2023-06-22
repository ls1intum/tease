import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatisticsComponent } from '../team-statistics/team-score.component';

describe('ProjectStatisticsComponent', () => {
  let component: ProjectStatisticsComponent;
  let fixture: ComponentFixture<ProjectStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectStatisticsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
