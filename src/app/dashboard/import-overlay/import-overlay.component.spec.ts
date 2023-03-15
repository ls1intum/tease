import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOverlayComponent } from './import-overlay.component';

describe('ImportOverlayComponent', () => {
  let component: ImportOverlayComponent;
  let fixture: ComponentFixture<ImportOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportOverlayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
