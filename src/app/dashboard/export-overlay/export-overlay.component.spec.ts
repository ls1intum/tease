import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportOverlayComponent } from './export-overlay.component';

describe('ExportOverlayComponent', () => {
  let component: ExportOverlayComponent;
  let fixture: ComponentFixture<ExportOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportOverlayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
