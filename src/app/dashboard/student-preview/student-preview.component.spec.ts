import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPreviewComponent } from './student-preview.component';

describe('StudentPreviewComponent', () => {
  let component: StudentPreviewComponent;
  let fixture: ComponentFixture<StudentPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentPreviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
