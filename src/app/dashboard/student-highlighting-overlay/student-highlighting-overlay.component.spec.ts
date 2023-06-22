import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHighlightingOverlayComponent } from './student-highlighting-overlay.component';

describe('StudentHighlightingOverlayComponent', () => {
  let component: StudentHighlightingOverlayComponent;
  let fixture: ComponentFixture<StudentHighlightingOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentHighlightingOverlayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentHighlightingOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
