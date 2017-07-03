import { Injectable, EventEmitter } from '@angular/core';
import {Person} from "../models/person";

@Injectable()
export class CustomPersonDetailDialogService {
  // Observable
  displayedPersonEventEmitter: EventEmitter<Person> = new EventEmitter();

  constructor(){
    console.log("CustomPersonDetailDialogService constructor called");
  }
}
