import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDetailCardComponent } from './person-detail-card.component';

describe('PersonDetailCardComponent', () => {
  let component: PersonDetailCardComponent;
  let fixture: ComponentFixture<PersonDetailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonDetailCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
