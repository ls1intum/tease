/**
 * Created by Malte Bucksch on 16/12/2016.
 */
import { Injectable, ViewContainerRef } from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class ToolbarService {
  private buttonNameSource = new Subject<string>();
  buttonNameChanged = this.buttonNameSource.asObservable();

  constructor() {

  }

  changeButtonName(newName: string){
    this.buttonNameSource.next(newName);
  }
}
