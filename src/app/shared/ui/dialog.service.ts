/**
 * Created by Malte Bucksch on 08/12/2016.
 */
import { Observable } from 'rxjs/Rx';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable, ViewContainerRef } from '@angular/core';
import {Person} from "../models/person";
import {PersonDetailComponent} from "../../person-details/person-detail.component";

@Injectable()
export class DialogService {

  constructor(private dialog: MdDialog) { }

  public showPersonDetails(person: Person, viewContainerRef: ViewContainerRef): Observable<boolean> {
    let dialogRef: MdDialogRef<PersonDetailComponent>;
    let config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;

    dialogRef = this.dialog.open(PersonDetailComponent, config);

    dialogRef.componentInstance.person = person;

    return dialogRef.afterClosed();
  }
}
