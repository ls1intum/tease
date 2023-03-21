import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPoolStatisticsComponent } from './person-pool-statistics.component';

describe('PersonPoolStatisticsComponent', () => {
  let component: PersonPoolStatisticsComponent;
  let fixture: ComponentFixture<PersonPoolStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonPoolStatisticsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonPoolStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
