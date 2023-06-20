import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailCardComponent } from './student-detail-card.component';

describe('StudentDetailCardComponent', () => {
  let component: StudentDetailCardComponent;
  let fixture: ComponentFixture<StudentDetailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentDetailCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
