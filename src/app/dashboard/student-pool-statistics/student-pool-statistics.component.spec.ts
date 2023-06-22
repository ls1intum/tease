import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPoolStatisticsComponent } from './student-pool-statistics.component';

describe('StudentPoolStatisticsComponent', () => {
  let component: StudentPoolStatisticsComponent;
  let fixture: ComponentFixture<StudentPoolStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentPoolStatisticsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPoolStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
