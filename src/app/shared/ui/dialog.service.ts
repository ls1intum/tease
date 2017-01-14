/**
 * Created by Malte Bucksch on 08/12/2016.
 */
import {Observable, Subject} from 'rxjs/Rx';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable, ViewContainerRef } from '@angular/core';
import {Person} from "../models/person";
import {PersonDetailComponent} from "../../person-details/details/person-detail.component";

@Injectable()
export class DialogService {
  constructor(private dialog: MdDialog) { }

  public showPersonDetails(person: Person, persons: Person[], viewContainerRef: ViewContainerRef): Observable<EventTypePersonDetails> {
    let dialogRef: MdDialogRef<PersonDetailComponent>;
    
    let config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;

    dialogRef = this.dialog.open(PersonDetailComponent, config);
    dialogRef.componentInstance.person = person;
    dialogRef.componentInstance.persons = persons;

    let eventSubject = new Subject<EventTypePersonDetails>();
    dialogRef.afterClosed().subscribe(()=> {
      eventSubject.next(EventTypePersonDetails.DialogClosed);
    });
    dialogRef.componentInstance.nextPersonClicked().subscribe(() => {
      eventSubject.next(EventTypePersonDetails.NextPersonPressed);
    });

    return eventSubject.asObservable();
  }
}

export enum EventTypePersonDetails {
  DialogClosed, NextPersonPressed
}
