import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightingToolbarComponent } from './highlighting-toolbar.component';

describe('HighlightingToolbarComponent', () => {
  let component: HighlightingToolbarComponent;
  let fixture: ComponentFixture<HighlightingToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighlightingToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightingToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
