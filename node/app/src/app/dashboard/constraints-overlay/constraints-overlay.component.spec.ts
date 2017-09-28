import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstraintsOverlayComponent } from './constraints-overlay.component';

describe('ConstraintsOverlayComponent', () => {
  let component: ConstraintsOverlayComponent;
  let fixture: ComponentFixture<ConstraintsOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstraintsOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstraintsOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
