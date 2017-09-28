import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPreviewComponent } from './person-preview.component';

describe('PersonPreviewComponent', () => {
  let component: PersonPreviewComponent;
  let fixture: ComponentFixture<PersonPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
