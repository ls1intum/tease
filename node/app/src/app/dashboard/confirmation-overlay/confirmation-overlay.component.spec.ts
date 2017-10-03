import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ConfirmationOverlayComponent} from "./confirmation-overlay.component";


describe('ConstraintsOverlayComponent', () => {
  let component: ConfirmationOverlayComponent;
  let fixture: ComponentFixture<ConfirmationOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
