import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDetailOverlayComponent } from './person-detail-overlay.component';

describe('PersonDetailOverlayComponent', () => {
  let component: PersonDetailOverlayComponent;
  let fixture: ComponentFixture<PersonDetailOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonDetailOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDetailOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
