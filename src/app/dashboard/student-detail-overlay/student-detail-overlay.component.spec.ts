import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailOverlayComponent } from './student-detail-overlay.component';

describe('StudentDetailOverlayComponent', () => {
  let component: StudentDetailOverlayComponent;
  let fixture: ComponentFixture<StudentDetailOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentDetailOverlayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDetailOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
