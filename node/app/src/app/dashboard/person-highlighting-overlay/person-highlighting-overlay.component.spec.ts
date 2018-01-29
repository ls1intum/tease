import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonHighlightingOverlayComponent } from './person-highlighting-overlay.component';

describe('PersonHighlightingOverlayComponent', () => {
  let component: PersonHighlightingOverlayComponent;
  let fixture: ComponentFixture<PersonHighlightingOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonHighlightingOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonHighlightingOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
